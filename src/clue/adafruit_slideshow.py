from PIL import Image

import os
import base64
from io import BytesIO
from base_circuitpython import base_cp_constants as CONSTANTS
import time
import collections
from random import shuffle
from common import utils
from common.telemetry import telemetry_py
from common.telemetry_events import TelemetryEvent
import board

# taken from adafruit
# https://github.com/adafruit/Adafruit_CircuitPython_Slideshow/blob/master/adafruit_slideshow.py


class PlayBackOrder:
    """Defines possible slideshow playback orders."""

    # pylint: disable=too-few-public-methods
    ALPHABETICAL = 0
    """Orders by alphabetical sort of filenames"""

    RANDOM = 1
    """Randomly shuffles the images"""
    # pylint: enable=too-few-public-methods


class PlayBackDirection:
    """Defines possible slideshow playback directions."""

    # pylint: disable=too-few-public-methods
    BACKWARD = -1
    """The next image is before the current image. When alphabetically sorted, this is towards A."""

    FORWARD = 1
    """The next image is after the current image. When alphabetically sorted, this is towards Z."""
    # pylint: enable=too-few-public-methods


# custom
class SlideShow:
    """
    Class for displaying a slideshow of .bmp images on displays.
    :param str folder: Specify the folder containing the image files, in quotes. Default is
                       the root directory, ``"/"``.
    :param PlayBackOrder order: The order in which the images display. You can choose random
                                (``RANDOM``) or alphabetical (``ALPHABETICAL``). Default is
                                ``ALPHABETICAL``.
    :param bool loop: Specify whether to loop the images or play through the list once. `True`
                 if slideshow will continue to loop, ``False`` if it will play only once.
                 Default is ``True``.
    :param int dwell: The number of seconds each image displays, in seconds. Default is 3.
    :param bool fade_effect: Specify whether to include the fade effect between images. ``True``
                        tells the code to fade the backlight up and down between image display
                        transitions. ``False`` maintains max brightness on the backlight between
                        image transitions. Default is ``True``.
    :param bool auto_advance: Specify whether to automatically advance after dwell seconds. ``True``
                 if slideshow should auto play, ``False`` if you want to control advancement
                 manually.  Default is ``True``.
    :param PlayBackDirection direction: The playback direction.
    Example code for Hallowing Express. With this example, the slideshow will play through once
    in alphabetical order:
    .. code-block:: python
        from adafruit_slideshow import PlayBackOrder, SlideShow
        import board
        import pulseio
        slideshow = SlideShow(board.DISPLAY, pulseio.PWMOut(board.TFT_BACKLIGHT), folder="/",
                              loop=False, order=PlayBackOrder.ALPHABETICAL)
        while slideshow.update():
            pass
    Example code for Hallowing Express. Sets ``dwell`` to 0 seconds, turns ``auto_advance`` off,
    and uses capacitive touch to advance backwards and forwards through the images and to control
    the brightness level of the backlight:
    .. code-block:: python
        from adafruit_slideshow import PlayBackOrder, SlideShow, PlayBackDirection
        import touchio
        import board
        import pulseio
        forward_button = touchio.TouchIn(board.TOUCH4)
        back_button = touchio.TouchIn(board.TOUCH1)
        brightness_up = touchio.TouchIn(board.TOUCH3)
        brightness_down = touchio.TouchIn(board.TOUCH2)
        slideshow = SlideShow(board.DISPLAY, pulseio.PWMOut(board.TFT_BACKLIGHT), folder="/",
                              auto_advance=False, dwell=0)
        while True:
            if forward_button.value:
                slideshow.direction = PlayBackDirection.FORWARD
                slideshow.advance()
            if back_button.value:
                slideshow.direction = PlayBackDirection.BACKWARD
                slideshow.advance()
            if brightness_up.value:
                slideshow.brightness += 0.001
            elif brightness_down.value:
                slideshow.brightness -= 0.001
    """

    def __init__(
        self,
        display,
        backlight_pwm=None,
        *,
        folder=".",
        order=PlayBackOrder.ALPHABETICAL,
        loop=True,
        dwell=3,
        fade_effect=True,
        auto_advance=True,
        direction=PlayBackDirection.FORWARD,
    ):
        self._BASE_DWELL = 0.3
        self._BASE_DWELL_DARK = 0.7
        self._NO_FADE_TRANSITION_INCREMENTS = 18

        self.auto_advance = auto_advance
        """Enable auto-advance based on dwell time.  Set to ``False`` to manually control."""

        self.loop = loop
        """Specifies whether to loop through the images continuously or play through the list once.
        ``True`` will continue to loop, ``False`` will play only once."""

        self.fade_effect = fade_effect
        """Whether to include the fade effect between images. ``True`` tells the code to fade the
           backlight up and down between image display transitions. ``False`` maintains max
           brightness on the backlight between image transitions."""

        self.dwell = self._BASE_DWELL + dwell
        """The number of seconds each image displays, in seconds."""

        self.direction = direction
        """Specify the playback direction.  Default is ``PlayBackDirection.FORWARD``.  Can also be
        ``PlayBackDirection.BACKWARD``."""

        self.advance = self.__advance_with_fade
        """Displays the next image. Returns True when a new image was displayed, False otherwise.
        """

        self.fade_frames = 8

        # assign new advance method if fade is disabled
        if not fade_effect:
            self.advance = self.__advance_no_fade

        self._img_start = None

        self.brightness = 1.0

        # blank screen for start
        self._curr_img_handle = Image.new(
            "RGBA", (CONSTANTS.SCREEN_HEIGHT_WIDTH, CONSTANTS.SCREEN_HEIGHT_WIDTH)
        )

        # if path is relative, this makes sure that
        # it's relative to the users's code file
        abs_path_parent_dir = os.path.abspath(
            os.path.join(utils.abs_path_to_user_file, os.pardir)
        )
        abs_path_folder = os.path.normpath(os.path.join(abs_path_parent_dir, folder))

        self.folder = abs_path_folder

        # get files within specified directory
        self.dirs = os.listdir(self.folder)

        self._order = order
        self._curr_img = ""

        # load images into main queue
        self.__load_images()

        display.show(self)
        # show the first working image
        self.advance()

        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_SLIDESHOW)

    @property
    def current_image_name(self):
        """Returns the current image name."""
        return self._curr_img

    @property
    def order(self):
        """Specifies the order in which the images are displayed. Options are random (``RANDOM``) or
        alphabetical (``ALPHABETICAL``). Default is ``RANDOM``."""
        return self._order

    @order.setter
    def order(self, order):
        if order not in [PlayBackOrder.ALPHABETICAL, PlayBackOrder.RANDOM]:
            raise ValueError("Order must be either 'RANDOM' or 'ALPHABETICAL'")

        self._order = order
        self.__load_images()

    @property
    def brightness(self):
        """Brightness of the backlight when an image is displaying. Clamps to 0 to 1.0"""
        return self._brightness

    @brightness.setter
    def brightness(self, brightness):
        if brightness < 0:
            brightness = 0
        elif brightness > 1.0:
            brightness = 1.0
        self._brightness = brightness

    def update(self):
        """Updates the slideshow to the next image."""
        now = time.monotonic()
        if not self.auto_advance or now - self._img_start < self.dwell:
            return True

        return self.advance()

    def __get_next_img(self):

        # handle empty queue
        if not len(self.pic_queue):
            if self.loop:
                self.__load_images()
            else:
                return ""

        if self.direction == PlayBackDirection.FORWARD:
            return self.pic_queue.popleft()
        else:
            return self.pic_queue.pop()

    def __load_images(self):
        dir_imgs = []
        for d in self.dirs:
            try:
                new_path = os.path.join(self.folder, d)

                # only add bmp imgs
                if os.path.splitext(new_path)[1] == CONSTANTS.BMP_IMG_ENDING:
                    dir_imgs.append(new_path)
            except Image.UnidentifiedImageError as e:
                continue

        if not len(dir_imgs):
            raise RuntimeError(CONSTANTS.NO_VALID_IMGS_ERR)

        if self._order == PlayBackOrder.RANDOM:
            shuffle(dir_imgs)
        else:
            dir_imgs.sort()

        # convert list to queue
        # (must be list beforehand for potential randomization)
        self.pic_queue = collections.deque(dir_imgs)

    def __advance_with_fade(self):
        if board.DISPLAY.active_group != self:
            return

        old_img = self._curr_img_handle
        advance_sucessful = False

        while not advance_sucessful:
            new_path = self.__get_next_img()
            if new_path == "":
                return False

            try:
                new_img = Image.open(new_path)

                new_img = new_img.convert("RGBA")
                new_img.putalpha(255)

                new_img = new_img.crop(
                    (0, 0, CONSTANTS.SCREEN_HEIGHT_WIDTH, CONSTANTS.SCREEN_HEIGHT_WIDTH)
                )

                if new_img.size[0] < 240 or new_img.size[1] < 240:
                    black_overlay = Image.new(
                        "RGBA",
                        CONSTANTS.SCREEN_HEIGHT_WIDTH,
                        CONSTANTS.SCREEN_HEIGHT_WIDTH,
                    )
                    black_overlay.paste(new_img)
                    new_img = black_overlay

                black_overlay = Image.new("RGBA", new_img.size)
                advance_sucessful = True
            except Image.UnidentifiedImageError as e:
                pass

        # fade out old photo
        for i in range(self.fade_frames, -1, -1):
            sendable_img = Image.blend(
                black_overlay, old_img, i * self.brightness / self.fade_frames
            )
            self.__send(sendable_img)

        time.sleep(self._BASE_DWELL_DARK)

        # fade in new photo
        for i in range(self.fade_frames + 1):
            sendable_img = Image.blend(
                black_overlay, new_img, i * self.brightness / self.fade_frames
            )
            self.__send(sendable_img)

        self._curr_img_handle = new_img
        self._curr_img = new_path
        self._img_start = time.monotonic()
        return True

    def __advance_no_fade(self):
        if board.DISPLAY.active_group != self:
            return

        old_img = self._curr_img_handle

        advance_sucessful = False

        while not advance_sucessful:
            new_path = self.__get_next_img()
            if new_path == "":
                return False

            try:
                new_img = Image.open(new_path)

                new_img = new_img.crop(
                    (0, 0, CONSTANTS.SCREEN_HEIGHT_WIDTH, CONSTANTS.SCREEN_HEIGHT_WIDTH)
                )

                if (
                    new_img.size[0] < CONSTANTS.SCREEN_HEIGHT_WIDTH
                    or new_img.size[1] < CONSTANTS.SCREEN_HEIGHT_WIDTH
                ):
                    black_overlay = Image.new(
                        "RGBA",
                        CONSTANTS.SCREEN_HEIGHT_WIDTH,
                        CONSTANTS.SCREEN_HEIGHT_WIDTH,
                    )
                    black_overlay.paste(new_img)
                    new_img = black_overlay

                self._curr_img = new_path

                new_img = new_img.convert("RGBA")
                new_img.putalpha(255)
                advance_sucessful = True
            except Image.UnidentifiedImageError as e:
                pass

        if self.brightness < 1.0:
            black_overlay = Image.new("RGBA", new_img.size)
            new_img = Image.blend(black_overlay, new_img, self.brightness)

        # gradually scroll new img over old img
        for i in range(self._NO_FADE_TRANSITION_INCREMENTS + 1):
            curr_y = (
                i * CONSTANTS.SCREEN_HEIGHT_WIDTH / self._NO_FADE_TRANSITION_INCREMENTS
            )
            img_piece = new_img.crop((0, 0, CONSTANTS.SCREEN_HEIGHT_WIDTH, curr_y))
            old_img.paste(img_piece)
            self.__send(old_img)

        self._curr_img_handle = new_img
        self._curr_img = new_path
        self._img_start = time.monotonic()
        return True

    def __send(self, img):
        # sends current bmp_img to the frontend
        buffered = BytesIO()
        img.save(buffered, format=CONSTANTS.BMP_IMG)
        byte_base64 = base64.b64encode(buffered.getvalue())

        # only send the base_64 string contents
        img_str = str(byte_base64)[2:-1]

        sendable_json = {CONSTANTS.BASE_64: img_str}
        utils.send_to_simulator(sendable_json, CONSTANTS.CLUE)

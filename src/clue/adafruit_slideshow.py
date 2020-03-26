import common
from PIL import Image

import os
import base64
from io import BytesIO
from base_circuitpython import base_cp_constants as CONSTANTS
import time
import collections
from random import shuffle

# taken from adafruit
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
    def __init__(
        self,
        display,
        backlight_pwm=None,
        *,
        folder="/",
        order=PlayBackOrder.ALPHABETICAL,
        loop=True,
        dwell=3,
        fade_effect=True,
        auto_advance=True,
        direction=PlayBackDirection.FORWARD,
    ):

        self.auto_advance = auto_advance

        self.__abs_path_to_code_file = ""
        abs_path_parent_dir = os.path.abspath(
            os.path.join(self.__abs_path_to_code_file, os.pardir)
        )
        abs_path_folder = os.path.normpath(os.path.join(abs_path_parent_dir, folder))

        self.folder = abs_path_folder
        self.dirs = os.listdir(self.folder)
        self.loop = loop
        self.BASE_DWELL = 0.3
        self.BASE_DWELL_DARK = 0.7
        if fade_effect:
            self.fade_frames = 10
        else:
            self.fade_frames = 0
        self.brightness = 1.0
        self.dwell = self.BASE_DWELL + dwell
        self.direction = direction
        self._order = order
        self._load_pic_queue()
        self.update()
        self.curr_img = ""

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
        self._reorder_images()

    def _reorder_images(self):
        self._load_pic_queue()

    def _get_img(self):
        if self.direction == PlayBackDirection.FORWARD:
            return self.pic_queue.popleft()
        else:
            return self.pic_queue.pop()

    def _load_pic_queue(self):
        dir_imgs = []
        for d in self.dirs:
            try:
                dir_imgs.append(os.path.join(self.folder, d))
            except Exception:
                continue
        if self._order == PlayBackOrder.RANDOM:
            shuffle(dir_imgs)

        self.pic_queue = collections.deque(dir_imgs)

    def update(self):

        successful = False
        while self.auto_advance and not successful:
            if len(self.pic_queue):
                successful = self.advance(self._get_img())
            elif self.loop:
                self._load_pic_queue()
            else:
                return False

        return True

    def advance(self, new_path):
        try:
            img = Image.open(new_path)
            self._curr_img = new_path
            img.convert("RGBA")

            img.putalpha(255)

            black_overlay = Image.new("RGBA", img.size)
        except Exception:
            return False

        time.sleep(self.BASE_DWELL_DARK)
        for i in range(self.fade_frames + 1):
            new_img = Image.blend(
                black_overlay, img, i * self.brightness / self.fade_frames
            )
            self._send(new_img)
        time.sleep(self.dwell)
        for i in range(self.fade_frames, -1, -1):
            new_img = Image.blend(
                black_overlay, img, i * self.brightness / self.fade_frames
            )
            self._send(new_img)
        return True

    def _send(self, img):
        # sends current bmp_img to the frontend
        buffered = BytesIO()
        img.save(buffered, format="BMP")
        byte_base64 = base64.b64encode(buffered.getvalue())
        img_str = str(byte_base64)[2:-1]

        sendable_json = {CONSTANTS.BASE_64: img_str}
        common.utils.send_to_simulator(sendable_json, CONSTANTS.CLUE)

    @property
    def brightness(self):
        return self._brightness

    @brightness.setter
    def brightness(self, brightness):
        if brightness < 0:
            brightness = 0
        elif brightness > 1.0:
            brightness = 1.0
        self._brightness = brightness

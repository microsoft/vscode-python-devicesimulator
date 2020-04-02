from PIL import Image
import threading
import os
import base64
from io import BytesIO
import time
import collections
import pathlib

from common import utils
import board
import base_cp_constants as CONSTANTS
import displayio
import terminalio


class Terminal:
    def __init__(self):
        self.__output_values = collections.deque()
        self.__lock = threading.Lock()
        self.__abs_path = pathlib.Path(__file__).parent.absolute()
        self.__base_img = Image.open(
            os.path.join(self.__abs_path, CONSTANTS.IMG_DIR_NAME, CONSTANTS.BLINKA_BMP)
        )

    def __create_newline(self, str_list):
        self.__lock.acquire()
        for string in str_list:
            self.__output_values.appendleft(string)

        over = len(self.__output_values) - CONSTANTS.CLUE_TERMINAL_LINE_NUM_MAX

        # max CONSTANTS.CLUE_TERMINAL_LINE_NUM_MAX items in output_values
        if over > 0:
            for i in range(over):
                self.__output_values.pop()

        self.__lock.release()

    def draw(self, no_verif=False):

        import adafruit_display_text.label

        self.__lock.acquire()

        # no need to check the active group within the Group class
        # since the caller of draw already did
        splash = displayio.Group(
            max_size=20, check_active_group_ref=False, auto_write=False
        )

        # since the text starts from the bottom,
        # we need to find an offset if there are empty spots

        # handling of output_values already ensures that there are
        # max CONSTANTS.CLUE_TERMINAL_LINE_NUM_MAX items in output_values deque
        num_empty_slots = CONSTANTS.CLUE_TERMINAL_LINE_NUM_MAX - len(
            self.__output_values
        )
        curr_y = CONSTANTS.CLUE_TERMINAL_Y_OFFSET + (
            CONSTANTS.CLUE_TERMINAL_LINE_HEIGHT * num_empty_slots
        )
        for output_val in reversed(self.__output_values):
            if len(output_val):
                text_area = adafruit_display_text.label.Label(
                    terminalio.FONT, text=output_val, line_spacing=1.25
                )

                text_area.y = curr_y
                text_area.x = CONSTANTS.CLUE_TERMINAL_X_OFFSET
                splash.append(text_area)

            curr_y += CONSTANTS.CLUE_TERMINAL_LINE_HEIGHT

        self.__lock.release()

        splash.draw(img=self.__base_img.copy())

    def add_str_to_terminal(self, curr_display_string=""):

        line_break_amt = CONSTANTS.CLUE_TERMINAL_LINE_BREAK_AMT

        # characters until forced newline
        newline_expected_val = line_break_amt
        out_str = ""
        new_strs = []
        for idx, d in enumerate(curr_display_string):
            # handle custom or forced newline
            if d == "\n" or newline_expected_val == 0:
                new_strs.append(out_str)
                out_str = ""
                newline_expected_val = line_break_amt

                # if it was a custom newline, no longer need to
                # process the character
                if d == "\n":
                    continue
            else:
                newline_expected_val -= 1
            out_str += d
        new_strs.append(out_str)

        self.__create_newline(new_strs)

        # only go ahead to draw the screen
        # if the terminal is actively on the screen
        if board.DISPLAY.active_group == None:
            self.draw()

import displayio
import terminalio
import adafruit_display_text
from PIL import Image
import threading

import os
import base64
from io import BytesIO
import base_cp_constants as CONSTANTS
import time
import collections
from common import utils
import board
import pathlib


class Terminal:
    def __init__(self):
        self.abs_path = pathlib.Path(__file__).parent.absolute()
        self.output_values = collections.deque()
        self.__lock = threading.Lock()
        self.base_img = Image.open(os.path.join(self.abs_path, "blinka.bmp"))

    def _create_newline(self, str_list):

        self.__lock.acquire()
        for string in str_list:
            self.output_values.appendleft(string)

        over = len(self.output_values) - 15
        if over > 0:
            for i in range(over):
                self.output_values.pop()

        self.__lock.release()

    def configure(self, no_verif=False):

        self.__lock.acquire()
        splash = displayio.Group(
            max_size=20, auto_write=False, check_active_group_ref=False
        )

        curr_y = 5 + (16 * (15 - len(self.output_values)))
        for o in reversed(self.output_values):
            if len(o):
                text_area = adafruit_display_text.label.Label(
                    terminalio.FONT, text=o, line_spacing=1.25
                )

                text_area.y = curr_y
                text_area.x = 15
                splash.append(text_area)

            curr_y += 16

        splash.draw(img=self.base_img.copy(), show=True)

        self.__lock.release()

    def add_str_to_terminal(self, curr_display_string=""):

        line_break_amt = 37
        newline_expected_val = line_break_amt
        out_str = ""
        new_strs = []
        for idx, d in enumerate(curr_display_string):
            if d == "\n":
                newline_expected_val = line_break_amt
                new_strs.append(out_str)
                out_str = ""
                continue
            elif newline_expected_val == 0:
                new_strs.append(out_str)
                out_str = ""
                newline_expected_val = line_break_amt
            else:
                newline_expected_val -= 1
            out_str += d
        new_strs.append(out_str)

        self._create_newline(new_strs)

        if board.DISPLAY.active_group == None:
            self.configure()

import displayio
import terminalio
from adafruit_display_text import label
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


class Terminal:
    def __init__(self):
        self.output_values = collections.deque()
        self.__lock = threading.Lock()
        # self.add_str_to_terminal("potato")
        # self._active = False

    # @property
    # def active(self):
    #     return self._active

    # @active.setter
    # def active(self, val):
    #     self._active = val
    #     if val:
    #         self._show()

    def _create_newline(self, str_list):
        for string in str_list:
            self.output_values.appendleft(string)

        over = len(self.output_values) - 15
        if over > 0:
            for i in range(over):
                self.output_values.pop()

    def configure(self, no_verif=False):

        self.__lock.acquire()
        splash = displayio.Group(
            max_size=20, auto_write=False, has_active_group_ref=False
        )

        # reset bmp_img to all black
        # splash.img.paste("black", [0, 0, splash.img.size[0], splash.img.size[1]])
        # print(self.output_values)
        curr_y = 5 + (16 * (15 - len(self.output_values)))
        for o in reversed(self.output_values):
            # print(o)
            # try:
            if len(o):
                text_area = label.Label(terminalio.FONT, text=o, line_spacing=1.25)

                text_area.y = curr_y
                text_area.x = 15
                splash.append(text_area)

            curr_y += 16
            # except Exception as e:
            #     # f = open(
            #     #     "C:\\Users\\t-anmah\\Documents\\python_ds_2\\out\\base_circuitpython\\testest.txt",
            #     #     "a",
            #     # )
            #     # f.write("Now the file has more content!")
            #     # f.write(o)
            #     # f.close()
            #     # print(o)
            #     print(type(e))
            #     pass

        splash.draw(show=True)

        self.__lock.release()

    def add_str_to_terminal(self, curr_display_string):

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

        self.__lock.acquire()
        self._create_newline(new_strs)
        self.__lock.release()

        if board.DISPLAY.active_group == None:
            self.configure()

    # def _send(self, img):
    #     # sends current bmp_img to the frontend
    #     buffered = BytesIO()
    #     img.save(buffered, format="BMP")
    #     byte_base64 = base64.b64encode(buffered.getvalue())

    #     # only send the base_64 string contents
    #     img_str = str(byte_base64)[2:-1]

    #     sendable_json = {CONSTANTS.BASE_64: img_str}
    #     utils.send_to_simulator(sendable_json, CONSTANTS.CLUE)

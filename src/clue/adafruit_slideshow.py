import common
from PIL import Image

import os
import base64
from io import BytesIO
from base_circuitpython import base_cp_constants as CONSTANTS


class SlideShow:
    def __init__(
        self,
        display,
        backlight_pwm=None,
        *,
        folder="/",
        order=0,
        loop=True,
        dwell=3,
        fade_effect=True,
        auto_advance=True,
        direction=1
    ):
        self.dirs = os.listdir(folder)
        self.img = None

    def show(self):
        for d in self.dirs:
            for i in range(6):
                self.img = Image.open(os.path.join("./pix", d))
                self.img.convert("RGBA")
                self.img.putalpha(i * 51)
                self.send()

            for i in range(5, -1):
                self.img = Image.open(os.path.join("./pix", d))
                self.img.convert("RGBA")
                self.img.putalpha(i * 51)
                self.send()

    def send(self):
        # sends current bmp_img to the frontend
        buffered = BytesIO()
        img.save(buffered, format="BMP")
        byte_base64 = base64.b64encode(buffered.getvalue())
        img_str = str(byte_base64)[2:-1]

        sendable_json = {CONSTANTS.BASE_64: img_str}
        common.utils.send_to_simulator(sendable_json, CONSTANTS.CLUE)

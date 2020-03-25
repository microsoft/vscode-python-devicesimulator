import common
from PIL import Image

import os
import base64
from io import BytesIO
from base_circuitpython import base_cp_constants as CONSTANTS
import time
import queue 

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
        direction=1,
    ):
        self.dirs = os.listdir(folder)
        self.folder = folder

        self.BASE_DWELL = 0.3
        self.BASE_DWELL_DARK = 0.7
        self.FADE_FRAMES = 10

        self.dwell = self.BASE_DWELL + dwell

        
        # for d in self.dirs:

        # self.pic_queue = 
    # 
    def show(self):

        img = None
        for d in self.dirs:
            try:
                new_path = os.path.join(self.folder, d)
                img = Image.open(new_path)
                img.convert("RGBA")

                img.putalpha(255)

                black_overlay = Image.new("RGBA", img.size)
            except Exception:
                continue
            for i in range(self.FADE_FRAMES + 1):
                new_img = Image.blend(black_overlay, img, i / self.FADE_FRAMES)
                self.send(new_img)
            time.sleep(self.dwell)
            for i in range(self.FADE_FRAMES, -1, -1):
                new_img = Image.blend(black_overlay, img, i / self.FADE_FRAMES)
                self.send(new_img)
            time.sleep(self.BASE_DWELL_DARK)

    def send(self, img):
        # sends current bmp_img to the frontend
        buffered = BytesIO()
        img.save(buffered, format="BMP")
        byte_base64 = base64.b64encode(buffered.getvalue())
        img_str = str(byte_base64)[2:-1]

        sendable_json = {CONSTANTS.BASE_64: img_str}
        common.utils.send_to_simulator(sendable_json, CONSTANTS.CLUE)

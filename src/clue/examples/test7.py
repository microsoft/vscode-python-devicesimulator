import sys
import os

sys.path.append(os.path.join(sys.path[0], ".."))
import terminalio
from adafruit_display_text import label


text = "Hello world"
text_area = label.Label(terminalio.FONT, text=text, auto_write=False, scale=14)
text_area.x = 0
text_area.y = 10
# print(text_area.anchor_point)
# print(text_area.anchored_position)
# print(text_area.background_color)
# print(text_area.bounding_box)
# print(text_area.line_spacing)
# board.DISPLAY.show(text_area)
text_area.draw(show=True)
# while True:
#     pass

# Call this with the font file as the command line argument.

import os
import sys

from PIL import Image

img = Image.new( 'RGB', (255,255), "black") # Create a new black image
bmp_img = img.load() # Create the pixel map

# Add paths so this runs in CPython in-place.
sys.path.append(os.path.join(sys.path[0], ".."))
from adafruit_bitmap_font import bitmap_font  # pylint: disable=wrong-import-position
sys.path.append(os.path.join(sys.path[0], "../test"))
font = bitmap_font.load_font(sys.argv[1])

width, height, dx, dy = font.get_bounding_box()
# for y in range(height):
#     print(f"{y}/{height} finished")
# for c in "Hi Vandy!!\n wats good":
#     glyph = font.get_glyph(ord(c))
#     if glyph is not None:
#         glyph.bitmap.set_scale(2)
#         # print(c)

# print("here...")
scale = 3
for y in range(height):
    x = 0
    for c in "Hi Vandy!!":
        
        glyph = font.get_glyph(ord(c))
        # if glyph is not None:
        #     glyph.bitmap.set_scale(2)
        #     print(c)
        if not glyph:
            continue
        print(glyph.tile_index)
        glyph_y = y + (glyph.height - (height + dy)) + glyph.dy
        pixels = []
        if 0 <= glyph_y < glyph.height:
            for i in range(glyph.width):
                value = glyph.bitmap[i, glyph_y]
                pix= (0,0,0)
                if value > 0:
                    pix= (255,255,255)
                    
                for i_new in range(scale):
                    for j_new in range(scale):
                        try:
                            bmp_img[x*scale+j_new,y*scale+i_new] = pix
                        except IndexError:
                            continue

                x += 1


# scale = 2
# for y in range(height):
#     x = 0
#     for c in "whats good":
        
#         glyph = font.get_glyph(ord(c))
#         # if glyph is not None:
#         #     glyph.bitmap.set_scale(2)
#         #     print(c)
        
#         if not glyph:
#             continue
#         glyph_y = y + (glyph.height - (height + dy)) + glyph.dy
#         pixels = []
#         if 0 <= glyph_y < glyph.height:
#             for i in range(glyph.width):
#                 value = glyph.bitmap[i, glyph_y]
#                 pix= (0,0,0)
#                 if value > 0:
#                     pix= (233,200,255)
                    
#                 for i_new in range(scale):
#                     for j_new in range(scale):
#                         try:
#                             bmp_img[x*scale+j_new,height*3+y*scale+i_new] = pix
#                         except IndexError:
#                             continue

#                 x += 1
        

# scale = 2
# for y in range(height):
    # x = 0
    # for c in "yeet":
        
    #     glyph = font.get_glyph(ord(c))
    #     # if glyph is not None:
    #     #     glyph.bitmap.set_scale(2)
    #     #     print(c)
        
    #     if not glyph:
    #         continue
    #     glyph_y = y + (glyph.height - (height + dy)) + glyph.dy
    #     pixels = []
    #     if 0 <= glyph_y < glyph.height:
    #         for i in range(glyph.width):
    #             value = glyph.bitmap[i, glyph_y]
    #             pix= (0,0,0)
    #             if value > 0:
    #                 pix= (233,200,43)
                    
    #             for i_new in range(scale):
    #                 for j_new in range(scale):
    #                     try:
    #                         bmp_img[x*scale+j_new,height*3+height*2+y*scale+i_new] = pix
    #                     except IndexError:
    #                         continue

    #             x += 1
img.show()
img.save('test.bmp')



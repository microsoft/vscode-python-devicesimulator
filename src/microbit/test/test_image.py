import pytest

from .. import constants as CONSTANTS
from .. import code_processing_shim
from ..display import Display
from ..image import Image




class TestImage(object):
    def setup_method(self):
        self.image = Image()
        self.image_heart = Image(CONSTANTS.HEART)
        # self.image_3x3 = 
        # self.image_empty = Image("")

    # GET PIXEL
    @pytest.mark.parametrize("x, y, brightness", [(1, 1, 4), (2, 3, 6), (4, 4, 9)])
    def test_get_pixel(self, x, y, brightness):
        self.image._Image__LED[y][x] = brightness
        assert brightness == self.image.get_pixel(x, y)

    # SET PIXEL
    @pytest.mark.parametrize("x, y, brightness", [(1, 1, 4), (2, 3, 6), (4, 4, 9)])
    def test_set_pixel(self, x, y, brightness):
        self.image.set_pixel(x, y, brightness)
        assert brightness == self.image._Image__LED[y][x]


    # GET PIXEL - INDEX ERROR
    @pytest.mark.parametrize("x, y", [(5, 0), (0, -1), (0, 5)])
    def test_get_pixel_error(self, x, y):
        with pytest.raises(ValueError, match=CONSTANTS.INDEX_ERR):
            self.image.get_pixel(x, y)

    # SET PIXEL - VARIOUS ERRORS
    @pytest.mark.parametrize(
        "x, y, brightness, err_msg",
        [
            (5, 0, 0, CONSTANTS.INDEX_ERR),
            (0, -1, 0, CONSTANTS.INDEX_ERR),
            (0, 0, -1, CONSTANTS.BRIGHTNESS_ERR),
        ],
    )
    def test_set_pixel_error(self, x, y, brightness, err_msg):
        with pytest.raises(ValueError, match=err_msg):
            self.image.set_pixel(x, y, brightness)
    
    # WIDTH & HEIGHT
    @pytest.mark.parametrize("image", [(Image()), (Image(3,3)), (Image(""))])
    def test_width_and_height(self, image):
        assert image.height() == len(image._Image__LED) 
        if len(image._Image__LED) == 0:
            assert image.width() == 0
        else:
            assert image.width() == len(image._Image__LED[0])

        assert image.height() == image.width()

    # BLIT
    # @pytest.mark.parametrize("x, y, w, h, x_dest, y_dest", [(0,0,3,3,4,3),(1,1,2,4,0,1),(1,3,1,2,0,2)])
    # def test_blit(self, x, y, w, h, x_dest, y_dest):
    #     x_offset = x_dest-x
    #     y_offset = y_dest-y
    #     result = Image()
        
    #     print("here")
    #     result.blit(self.image_heart, x, y, w, h, x_dest, y_dest)
    #     self.__check_blit(result, self.image_heart, x, y, w, h, x_offset, y_offset)

    # # helper! :D
    # def __check_value(self,src,x,y,value):
    #     if src._Image__valid_pos(x,y):
    #         assert(src._Image__LED[y][x] == value)
    # def __check_blit(self,target, src,x,y, w, h, x_offset,y_offset):
    #     for index_y, val_y in enumerate(src._Image__LED[y:]):
    #         if index_y >= h:
    #             break
    #         for index_x,val_x in enumerate(val_y[x:]):
    #             print(f"{index_x} {val_x}")
    #             if index_x >= w:
    #                 break
    #             if (src._Image__valid_pos(index_x+x_offset,index_y+y_offset)):
    #                 try:
    #                     self.__check_value(target,index_x+x_offset, index_y+y_offset, val_x)
    #                 except AssertionError as e:
    #                     print("uuuwu")
    #                     print(f"{index_x} {index_y} {w} {h} {x_offset} {y_offset}")
    #                     print(code_processing_shim.str(src))
    #                     print(code_processing_shim.str(target))
    #                     print(f"{index_x+x_offset} {index_y+y_offset} {val_x}")
    #                     print(e)


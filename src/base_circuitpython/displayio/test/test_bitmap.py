import pytest
from ..bitmap import Bitmap
from .. import constants as CONSTANTS


class TestBitmap(object):
    @pytest.mark.parametrize("x, y", [(1, 1), (2, 6), (0, 0)])
    def test_create_bitmap(self, x, y):
        bitmap = Bitmap(x, y)

    @pytest.mark.parametrize("x, y, palette_num", [(1, 1, 4), (2, 3, 6), (4, 4, 9)])
    def test_set_and_get_pixel(self, x, y, palette_num):
        bitmap = Bitmap(5, 5)
        bitmap[x, y] = palette_num
        assert palette_num == bitmap[x, y]

    @pytest.mark.parametrize("i, palette_num", [(1, 1), (24, 2)])
    def test_set_and_get_pixel_singular_index(self, i, palette_num):
        bitmap = Bitmap(5, 5)
        bitmap[i] = palette_num
        assert palette_num == bitmap[i]

    @pytest.mark.parametrize(
        "x_size, y_size, x_coord, y_coord",
        [(1, 1, 0, 4), (1, 1, 4, 0), (200, 200, 300, 1), (200, 200, 1, 300)],
    )
    def test_get_set_index_err(self, x_size, y_size, x_coord, y_coord):
        bitmap = Bitmap(x_size, y_size)

        with pytest.raises(IndexError, match=CONSTANTS.PIXEL_OUT_OF_BOUNDS):
            bitmap[x_coord, y_coord] = 0

        with pytest.raises(IndexError, match=CONSTANTS.PIXEL_OUT_OF_BOUNDS):
            val = bitmap[x_coord, y_coord]

    @pytest.mark.parametrize("x_size, y_size, i", [(1, 1, 3), (200, 200, 40000)])
    def test_get_set_index_err_singular_index(self, x_size, y_size, i):
        bitmap = Bitmap(x_size, y_size)

        with pytest.raises(IndexError, match=CONSTANTS.PIXEL_OUT_OF_BOUNDS):
            bitmap[i] = 0

        with pytest.raises(IndexError, match=CONSTANTS.PIXEL_OUT_OF_BOUNDS):
            val = bitmap[i]

import pytest
import sys
import os

sys.path.append(os.path.join(sys.path[0], ".."))

from displayio import Bitmap


class TestDisplayIO(object):
    
    # Bitmap class
    @pytest.mark.parametrize("x, y, brightness", [(1, 1, 4), (2, 3, 6), (4, 4, 9)])
    def test_set_and_get_pixel(self, x, y, brightness):
        self.display.set_pixel(x, y, brightness)
        assert brightness == self.display.get_pixel(x, y)

    @pytest.mark.parametrize("x, y, brightness", [(1, 1, 4), (2, 3, 6), (4, 4, 9)])
    def test_get_len(self, x, y, brightness):
        self.display.set_pixel(x, y, brightness)
        assert brightness == self.display.get_pixel(x, y)

    @pytest.mark.parametrize("x, y, brightness", [(1, 1, 4), (2, 3, 6), (4, 4, 9)])
    def test_too_many_colours(self, x, y, brightness):
        self.display.set_pixel(x, y, brightness)
        assert brightness == self.display.get_pixel(x, y)

    @pytest.mark.parametrize("x, y, brightness", [(1, 1, 4), (2, 3, 6), (4, 4, 9)])
    def test_empty_bitmap(self, x, y, brightness):
        self.display.set_pixel(x, y, brightness)
        assert brightness == self.display.get_pixel(x, y)
    
    @pytest.mark.parametrize("x, y, brightness", [(1, 1, 4), (2, 3, 6), (4, 4, 9)])
    def test_empty_bitmap(self, x, y, brightness):
        self.display.set_pixel(x, y, brightness)
        assert brightness == self.display.get_pixel(x, y)

    @pytest.mark.parametrize("x, y, brightness", [(1, 1, 4), (2, 3, 6), (4, 4, 9)])
    def test_draw_no_scale(self, x, y, brightness):
        self.display.set_pixel(x, y, brightness)
        assert brightness == self.display.get_pixel(x, y)

    @pytest.mark.parametrize("x, y, brightness", [(1, 1, 4), (2, 3, 6), (4, 4, 9)])
    def test_draw_no_scale(self, x, y, brightness):
        self.display.set_pixel(x, y, brightness)
        assert brightness == self.display.get_pixel(x, y)
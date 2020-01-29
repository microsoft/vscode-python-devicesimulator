import pytest

from .. import constants as CONSTANTS
from ..display import Display
from ..image import Image


class TestDisplay(object):
    def setup_method(self):
        self.display = Display()

    @pytest.mark.parametrize("x, y, brightness", [(1, 1, 4), (2, 3, 6), (4, 4, 9)])
    def test_get_pixel(self, x, y, brightness):
        self.display._Display__LEDs[y][x] = brightness
        assert brightness == self.display.get_pixel(x, y)

    @pytest.mark.parametrize("x, y", [(5, 0), (0, -1), (0, 5)])
    def test_get_pixel_error(self, x, y):
        with pytest.raises(ValueError, match=CONSTANTS.INDEX_ERR):
            self.display.get_pixel(x, y)

    @pytest.mark.parametrize("x, y, brightness", [(1, 1, 4), (2, 3, 6), (4, 4, 9)])
    def test_set_pixel(self, x, y, brightness):
        self.display.set_pixel(x, y, brightness)
        assert brightness == self.display._Display__LEDs[y][x]

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
            self.display.set_pixel(x, y, brightness)

    def test_clear(self):
        self.display._Display__LEDs[0][0] = 7
        self.display._Display__LEDs[3][4] = 6
        self.display._Display__LEDs[4][4] = 9
        assert not self.__is_clear()
        self.display.clear()
        assert self.__is_clear()

    def test_on(self):
        self.display._Display__on = False
        self.display.on()
        assert self.display._Display__on

    def test_off(self):
        self.display._Display__on = True
        self.display.off()
        assert False == self.display._Display__on

    @pytest.mark.parametrize("on", [True, False])
    def test_is_on(self, on):
        self.display._Display__on = on
        assert on == self.display.is_on()

    # Helpers
    def __is_clear(self):
        for y in range(CONSTANTS.LED_WIDTH):
            for x in range(CONSTANTS.LED_HEIGHT):
                if 0 != self.display._Display__LEDs[y][x]:
                    return False
        return True

    def test_use_me(self):
        img = Image(5, 5)
        img.set_pixel(0, 0, 8)
        img.set_pixel(0, 1, 9)
        img.set_pixel(0, 2, 7)
        img.set_pixel(2, 2, 6)
        self.display.show(img)

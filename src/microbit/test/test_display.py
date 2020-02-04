import pytest
import threading

from ..model import constants as CONSTANTS
from ..model.display import Display
from ..model.image import Image
from .. import shim


STR_A = "09900:90090:99990:90090:90090"
STR_QUESTION_MARK = "09990:90009:00990:00000:00900"
STR_EXCLAMATION_MARK = "09000:09000:09000:00000:09000:"
STR_SIX = "00090:00900:09990:90009:09990"


class TestDisplay(object):
    def setup_method(self):
        self.display = Display()

    @pytest.mark.parametrize("x, y, brightness", [(1, 1, 4), (2, 3, 6), (4, 4, 9)])
    def test_get_pixel(self, x, y, brightness):
        self.display._Display__image._Image__LED[y][x] = brightness
        assert brightness == self.display.get_pixel(x, y)

    @pytest.mark.parametrize("x, y", [(5, 0), (0, -1), (0, 5)])
    def test_get_pixel_error(self, x, y):
        with pytest.raises(ValueError, match=CONSTANTS.INDEX_ERR):
            self.display.get_pixel(x, y)

    @pytest.mark.parametrize("x, y, brightness", [(1, 1, 4), (2, 3, 6), (4, 4, 9)])
    def test_set_pixel(self, x, y, brightness):
        self.display.set_pixel(x, y, brightness)
        assert brightness == self.display._Display__image._Image__LED[y][x]

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
        self.display._Display__image._Image__LED[2][3] = 7
        self.display._Display__image._Image__LED[3][4] = 6
        self.display._Display__image._Image__LED[4][4] = 9
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

    def test_show_one_image(self):
        img = Image()
        img.set_pixel(0, 0, 8)
        img.set_pixel(0, 1, 9)
        img.set_pixel(0, 2, 7)
        img.set_pixel(2, 2, 6)
        self.display.show(img)
        assert Image._Image__same_image(img, self.display._Display__image)

    def test_show_different_size_image(self):
        img = Image(3, 7)
        img.set_pixel(1, 1, 9)
        img.set_pixel(2, 6, 9)  # Will not be on display
        expected = Image(5, 5)
        expected.set_pixel(1, 1, 9)
        self.display.show(img)
        assert Image._Image__same_image(expected, self.display._Display__image)

    def test_show_smaller_image(self):
        img = Image(2, 2)
        img.set_pixel(1, 1, 9)
        expected = Image(5, 5)
        expected.set_pixel(1, 1, 9)
        self.display.show(img)
        assert Image._Image__same_image(expected, self.display._Display__image)

    @pytest.mark.parametrize(
        "value, expected_str",
        [
            ("!", STR_EXCLAMATION_MARK),
            ("A", STR_A),
            (" ", CONSTANTS.BLANK_5X5),
            (6, STR_SIX),
            ("\x7F", STR_QUESTION_MARK),  # Character is out of our ASCII range
        ],
    )
    def test_show_char(self, value, expected_str):
        expected = Image(expected_str)
        self.display.show(value)
        assert Image._Image__same_image(expected, self.display._Display__image)

    def test_show_char_with_clear(self):
        expected = Image(CONSTANTS.BLANK_5X5)
        image = Image(STR_EXCLAMATION_MARK)
        self.display.show(image, clear=True)
        print(expected._Image__LED)
        print(self.display._Display__image._Image__LED)
        assert Image._Image__same_image(expected, self.display._Display__image)

    def test_show_iterable(self):
        expected = Image(STR_A)
        value = [Image(STR_EXCLAMATION_MARK), "A", "ab"]
        self.display.show(value)
        assert Image._Image__same_image(expected, self.display._Display__image)

    def test_show_non_iterable(self):
        with pytest.raises(TypeError):
            self.display.show(TestDisplay())

    def test_scroll(self):
        self.display.scroll("n!")

    # Helpers
    def __is_clear(self):
        i = Image(CONSTANTS.BLANK_5X5)
        return Image._Image__same_image(i, self.display._Display__image)

    def __print(self, img):
        print("")
        for i in range(5):
            print(img._Image__LED[i])


# pytest src/microbit/test/test_display.py --cov-report=html --cov=src/microbit

# Need tests for
# threaded show
# threaded scroll
# normal scroll

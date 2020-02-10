import pytest
import threading
from unittest import mock
from common import utils

from ..__model import constants as CONSTANTS
from ..__model.display import Display
from ..__model.image import Image


STR_A = "09900:90090:99990:90090:90090"
STR_QUESTION_MARK = "09990:90009:00990:00000:00900"
STR_EXCLAMATION_MARK = "09000:09000:09000:00000:09000:"
STR_SIX = "00090:00900:09990:90009:09990"


class TestDisplay(object):
    def setup_method(self):
        self.display = Display()
        utils.send_to_simulator = mock.Mock()

    @pytest.mark.parametrize("x, y, brightness", [(1, 1, 4), (2, 3, 6), (4, 4, 9)])
    def test_set_and_get_pixel(self, x, y, brightness):
        self.display.set_pixel(x, y, brightness)
        assert brightness == self.display.get_pixel(x, y)

    @pytest.mark.parametrize("x, y", [(5, 0), (0, -1), (0, 5)])
    def test_get_pixel_error(self, x, y):
        with pytest.raises(ValueError, match=CONSTANTS.INDEX_ERR):
            self.display.get_pixel(x, y)

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
        self.display.set_pixel(2, 3, 7)
        self.display.set_pixel(3, 4, 6)
        self.display.set_pixel(4, 4, 9)
        assert not self.__is_clear()
        self.display.clear()
        assert self.__is_clear()

    def test_on_off(self):
        self.display.on()
        assert self.display.is_on()
        self.display.off()
        assert not self.display.is_on()

    def test_show_one_image(self):
        img = Image()
        img.set_pixel(0, 0, 8)
        img.set_pixel(0, 1, 9)
        img.set_pixel(0, 2, 7)
        img.set_pixel(2, 2, 6)
        self.display.show(img, delay=0)
        assert Image._Image__same_image(img, self.display._Display__image)

    def test_show_different_size_image(self):
        img = Image(3, 7)
        img.set_pixel(1, 1, 9)
        img.set_pixel(2, 6, 9)  # Will not be on display
        expected = Image(5, 5)
        expected.set_pixel(1, 1, 9)
        self.display.show(img, delay=0)
        assert Image._Image__same_image(expected, self.display._Display__image)

    def test_show_smaller_image(self):
        img = Image(2, 2)
        img.set_pixel(1, 1, 9)
        expected = Image(5, 5)
        expected.set_pixel(1, 1, 9)
        self.display.show(img, delay=0)
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
        self.display.show(value, delay=0)
        assert Image._Image__same_image(expected, self.display._Display__image)

    def test_show_char_with_clear(self):
        image = Image(STR_EXCLAMATION_MARK)
        self.display.show(image, delay=0, clear=True)
        assert self.__is_clear()

    def test_show_iterable(self):
        expected = Image(STR_A)
        value = [Image(STR_EXCLAMATION_MARK), "A", "ab"]
        self.display.show(value, delay=0)
        assert Image._Image__same_image(expected, self.display._Display__image)

    def test_show_non_iterable(self):
        with pytest.raises(TypeError):
            self.display.show(TestDisplay())

    def test_scroll(self):
        self.display.scroll("a b")
        self.__is_clear()

    def test_scroll_type_error(self):
        with pytest.raises(TypeError):
            self.display.scroll(["a", 1])

    # Should change these threaded tests to test behaviour in the future
    def test_show_threaded(self):
        threading.Thread = mock.Mock()
        self.display.show("a", delay=0, wait=False)
        threading.Thread.assert_called_once()

    def test_scroll_threaded(self):
        threading.Thread = mock.Mock()
        self.display.scroll("test", delay=0, wait=False)
        threading.Thread.assert_called_once()

    def test_get_array(self):
        self.display.set_pixel(3, 3, 3)
        self.display.off()
        assert self.display._Display__get_array() == [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
        ]

        self.display.on()
        assert self.display._Display__get_array() == [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 3, 0],
            [0, 0, 0, 0, 0],
        ]

    # The second show call should immedaitely stop the first show call.
    # Therefore the final result of display should be 6.
    def test_async_tests(self):
        self.display.show("MMMMMMMMMMMMMM", delay=100, wait=False)
        self.display.show("6", delay=0)
        assert Image._Image__same_image(Image(STR_SIX), self.display._Display__image)

    # Helpers
    def __is_clear(self):
        i = Image(CONSTANTS.BLANK_5X5)
        return Image._Image__same_image(i, self.display._Display__image)

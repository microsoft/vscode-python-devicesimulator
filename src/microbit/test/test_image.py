import pytest

from .. import constants as CONSTANTS
from .. import code_processing_shim
from ..display import Display
from ..image import Image

# TESTING FOR IMAGE CLASS


class TestImage(object):
    def setup_method(self):
        self.image = Image()
        self.image_heart = Image(CONSTANTS.HEART)

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
    @pytest.mark.parametrize("image", [(Image()), (Image(3, 3)), (Image(""))])
    def test_width_and_height(self, image):
        assert image.height() == len(image._Image__LED)
        if len(image._Image__LED) == 0:
            assert image.width() == 0
        else:
            assert image.width() == len(image._Image__LED[0])

        assert image.height() == image.width()

    # BLIT
    @pytest.mark.parametrize(
        "x, y, w, h, x_dest, y_dest, actual",
        [
            (0, 0, 3, 2, 2, 1, Image("00000:00090:00999:00000:00000:")),
            (0, 0, 3, 3, 8, 8, Image("00000:00000:00000:00000:00000:")),
            (3, 0, 3, 3, 0, 0, Image("90000:99000:99000:00000:00000:")),
            (3, 0, 7, 7, 0, 0, Image("90000:99000:99000:90000:00000:")),
        ],
    )
    def test_blit_heart(self, x, y, w, h, x_dest, y_dest, actual):
        result = Image()
        result.blit(self.image_heart, x, y, w, h, x_dest, y_dest)
        assert result._Image__LED == actual._Image__LED

    @pytest.mark.parametrize(
        "x, y, w, h, x_dest, y_dest, actual",
        [
            (1, 1, 2, 4, 3, 3, Image("09090:99999:99999:09999:00999:")),
            (0, 0, 3, 3, 8, 8, Image(CONSTANTS.HEART)),
            (0, 0, 7, 7, 0, 0, Image(CONSTANTS.HEART)),
            (3, 0, 7, 7, 0, 0, Image("90000:99000:99000:90000:00000:")),
        ],
    )
    def test_blit_heart_nonblank(self, x, y, w, h, x_dest, y_dest, actual):
        result = Image(CONSTANTS.HEART)
        src = Image(CONSTANTS.HEART)
        result.blit(src, x, y, w, h, x_dest, y_dest)
        assert result._Image__LED == actual._Image__LED

    # BLIT - VALUEERROR
    @pytest.mark.parametrize(
        "x, y, w, h, x_dest, y_dest", [(5, 6, 2, 4, 3, 3), (5, 0, 3, 3, 8, 8)]
    )
    def test_blit_heart_valueerror(self, x, y, w, h, x_dest, y_dest):
        result = Image(CONSTANTS.HEART)
        with pytest.raises(ValueError, match=CONSTANTS.INDEX_ERR):
            result.blit(self.image_heart, x, y, w, h, x_dest, y_dest)

    # BYTEARRAY
    @pytest.mark.parametrize(
        "image1, image2", [(Image(2, 2, bytearray([4, 4, 4, 4])), Image("44:44"))]
    )
    def test_constructor_bytearray(self, image1, image2):
        assert image1._Image__LED == image2._Image__LED

    # CROP
    @pytest.mark.parametrize(
        "x, y, w, h, actual", [(1, 1, 2, 4, Image("99:99:99:09:"))]
    )
    def test_crop_heart(self, x, y, w, h, actual):
        result = self.image_heart.crop(1, 1, 2, 4)
        assert result._Image__LED == actual._Image__LED

    # FILL
    @pytest.mark.parametrize(
        "target, actual", [(Image("99:99:99:00:"), Image("22:22:22:22:"))]
    )
    def test_fill(self, target, actual):
        target.fill(2)
        assert target._Image__LED == actual._Image__LED

    # INVERT
    @pytest.mark.parametrize(
        "target, actual", [(Image("012:345:678:900:"), Image("987:654:321:099:"))]
    )
    def test_invert(self, target, actual):
        target.invert()
        assert target._Image__LED == actual._Image__LED

    # SHIFTS
    @pytest.mark.parametrize(
        "target, value, actual",
        [
            (Image("012:345:678:900:"), 1, Image("001:034:067:090:")),
            (Image("012:345:678:900:"), 6, Image("000:000:000:000:")),
            (Image("012:345:678:900:"), -1, Image("120:450:780:000:")),
        ],
    )
    def test_shift_right(self, target, value, actual):
        result = target.shift_right(value)
        assert result._Image__LED == actual._Image__LED

    @pytest.mark.parametrize(
        "target, value, actual",
        [
            (Image("012:345:678:900:"), 2, Image("200:500:800:000:")),
            (Image("012:345:678:900:"), 6, Image("000:000:000:000:")),
            (Image("012:345:678:900:"), -2, Image("000:003:006:009:")),
        ],
    )
    def test_shift_left(self, target, value, actual):
        result = target.shift_left(value)
        assert result._Image__LED == actual._Image__LED

    @pytest.mark.parametrize(
        "target, value, actual",
        [
            (Image("012:345:678:900:"), 2, Image("678:900:000:000:")),
            (Image("012:345:678:900:"), 6, Image("000:000:000:000:")),
            (Image("012:345:678:900:"), -2, Image("000:000:012:345:")),
        ],
    )
    def test_shift_up(self, target, value, actual):
        result = target.shift_up(value)
        assert result._Image__LED == actual._Image__LED

    @pytest.mark.parametrize(
        "target, value, actual",
        [
            (Image("012:345:678:900:"), 1, Image("000:012:345:678")),
            (Image("012:345:678:900:"), 6, Image("000:000:000:000:")),
            (Image("012:345:678:900:"), -1, Image("345:678:900:000:")),
        ],
    )
    def test_shift_down(self, target, value, actual):
        result = target.shift_down(value)
        assert result._Image__LED == actual._Image__LED

    # COPY
    @pytest.mark.parametrize("target", [(Image("012:345:678:900:"))])
    def test_copy(self, target):
        result = target.copy()
        assert result._Image__LED == target._Image__LED

    # MULTIPLY
    @pytest.mark.parametrize(
        "target, multiplier, actual",
        [
            (Image("012:345:678:900:"), 2, Image("024:689:999:900:")),
            (Image("012:345:678:900:"), 0, Image("000:000:000:000:")),
        ],
    )
    def test_multiply(self, target, multiplier, actual):
        result = target * multiplier
        assert result._Image__LED == actual._Image__LED

    # MULTIPLY - TYPEERROR
    @pytest.mark.parametrize(
        "target, multiplier",
        [
            (Image("012:345:678:900:"), []),
            (Image("012:345:678:900:"), Image("000:000:000:000:")),
        ],
    )
    def test_multiply_error(self, target, multiplier):

        with pytest.raises(
            TypeError, match=f"can't convert {type(multiplier)} to float"
        ):
            target * multiplier

    # ADD
    @pytest.mark.parametrize(
        "target, value, actual",
        [
            (
                Image("012:345:678:900:"),
                Image("024:689:999:900:"),
                Image("036:999:999:900:"),
            ),
            (
                Image("999:999:999:000:"),
                Image("999:999:999:000:"),
                Image("999:999:999:000:"),
            ),
        ],
    )
    def test_add(self, target, value, actual):
        result = target + value
        assert result._Image__LED == actual._Image__LED

    # ADD - TYPEERRROR
    @pytest.mark.parametrize(
        "target, value, err_message",
        [
            (
                Image("012:345:678:900:"),
                2,
                CONSTANTS.UNSUPPORTED_ADD_TYPE + f"'{type(Image())}', '{type(2)}'",
            ),
            (
                Image("012:345:678:900:"),
                [],
                CONSTANTS.UNSUPPORTED_ADD_TYPE + f"'{type(Image())}', '{type([])}'",
            ),
        ],
    )
    def test_add_typeerror(self, target, value, err_message):
        with pytest.raises(TypeError, match=err_message):
            target + value

    # ADD - VALUEERROR
    @pytest.mark.parametrize(
        "target, value", [(Image(2, 3), Image(3, 3)), (Image(2, 1), Image(0, 0))]
    )
    def test_add_valueerror(self, target, value):
        with pytest.raises(ValueError, match=CONSTANTS.SAME_SIZE_ERR):
            target + value

    # STRING CONSTRUCTOR - UNEVEN WIDTHS

    @pytest.mark.parametrize(
        "initial, actual",
        [
            (Image("0:000:00:0000:"), Image("0000:0000:0000:0000:")),
            (Image("12125:1212:12:1:"), Image("12125:12120:12000:10000:")),
        ],
    )
    def test_uneven_strings(self, initial, actual):
        assert initial._Image__LED == actual._Image__LED

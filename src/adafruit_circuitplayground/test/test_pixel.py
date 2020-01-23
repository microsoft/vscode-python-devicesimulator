import pytest

from ..pixel import Pixel


class TestPixel(object):

    def setup_method(self):
        self.pixel = Pixel(
            {
                'brightness': 1.0,
                'button_a': False,
                'button_b': False,
                'pixels': [(255, 0, 0), (0, 255, 0), (0, 0, 255)],
                'red_led': False,
                'switch': False
            })

    @pytest.mark.parametrize("debug_mode", [True, False])
    def test_set_debug_mode(self, debug_mode):
        self.pixel._Pixel__set_debug_mode(debug_mode)
        assert debug_mode == self.pixel._Pixel__debug_mode
    
    def test_get_item_out_of_bounds(self):
        with pytest.raises(IndexError):
            p = self.pixel[3]

    def test_get_item(self):
        assert (0, 0, 255) == self.pixel[2]

    def test_get_item_splice(self):
        assert [(255, 0, 0), (0, 255, 0)] == self.pixel[0:2]

    def test_set_item(self):
        self.pixel[1] = (50, 50, 50)
        assert (50, 50, 50) == self.pixel[1]

    def test_set_item_splice(self):
        self.pixel[0:1] = [(100, 100, 100), (0, 0, 100)]
        assert (100, 100, 100) == self.pixel[0]
        assert (0, 0, 100) == self.pixel[1]
    
    def test_set_item_out_of_bounds(self):
        with pytest.raises(IndexError):
            self.pixel[3] = (0, 0, 0)
    
    def test_len(self):
        assert 3 == len(self.pixel)
    
    @pytest.mark.parametrize("index, expected", [(0, True), (3, False)])
    def test_valid_index(self, index, expected):
        assert self.pixel._Pixel__valid_index(index) == expected

    def test_fill(self):
        self.pixel.fill((123, 123, 123))
        assert True == all(p == (123, 123, 123) for p in self.pixel._Pixel__state["pixels"])

    @pytest.mark.parametrize("val, expected", 
                            [([3, 4, 5], (3, 4, 5)),
                            (432, (0, 1, 176)),
                            ((1, 2, 3), (1, 2, 3))])
    def test_extract_pixel_values_not_slice(self, val, expected):
        assert expected == self.pixel._Pixel__extract_pixel_value(val)

    @pytest.mark.parametrize("val, expected", 
                            [([[3, 4, 5], [6, 7, 8]], [(3, 4, 5), (6, 7, 8)]),
                            ([444555, 666777], [(6, 200, 139), (10, 44, 153)]),
                            ([(10, 10, 10), (20, 20, 20)], [(10, 10, 10), (20, 20, 20)])])
    def test_extract_pixel_values_slice(self, val, expected):
        assert expected == self.pixel._Pixel__extract_pixel_value(val, is_slice=True)

    @pytest.mark.parametrize("val", [[1, 2, 3, 4], [1, 2], 0.3])
    def test_extract_pixel_values_fail(self, val):
        with pytest.raises(ValueError):
            self.pixel._Pixel__extract_pixel_value(val)

    def test_hex_to_rgb_fail(self):
        with pytest.raises(ValueError):
            self.pixel._Pixel__hex_to_rgb("x")
    
    @pytest.mark.parametrize("hex, expected", 
                            [("0xffffff", (255, 255, 255)),
                            ("0x0", (0, 0, 0)),
                            ("0xff0000", (255, 0, 0)),
                            ("0xabcdef", (171, 205, 239))])
    def test_hex_to_rgb(self, hex, expected):
        assert expected == self.pixel._Pixel__hex_to_rgb(hex)

    @pytest.mark.parametrize("pixValue, expected",
                            [(0, True),
                            (200, True),
                            (255, True),
                            (-1, False),
                            (256, False),
                            ("1", False)])
    def test_valid_rgb_value(self, pixValue, expected):
        assert expected == self.pixel._Pixel__valid_rgb_value(pixValue)

    def test_get_brightness(self):
        self.pixel._Pixel__state['brightness'] = 0.4
        assert 0.4 == self.pixel.brightness
    
    @pytest.mark.parametrize("brightness", [-0.1, 1.1])
    def test_set_brightness_fail(self, brightness):
        with pytest.raises(ValueError):
            self.pixel.brightness = brightness

    @pytest.mark.parametrize("brightness", [0, 1, 0.4, 0.333])
    def test_set_brightness(self, brightness):
        self.pixel.brightness = brightness
        assert True == self.pixel._Pixel__valid_brightness(brightness)
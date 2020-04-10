import pytest
from ..palette import Palette
from .. import constants as CONSTANTS
from ..color_type import _ColorType


class TestPalette(object):
    @pytest.mark.parametrize(
        "color_count, palette_num, val",
        [(11, 5, (255, 255, 255)), (1, 0, (255, 0, 255)), (4, 3, (0, 0, 0))],
    )
    def test_get_and_set_palette(self, color_count, palette_num, val):
        palette = Palette(color_count)
        palette[palette_num] = val
        assert palette._Palette__contents[palette_num] == _ColorType(val)

    @pytest.mark.parametrize("palette_size, palette_index", [(3, 7), (0, 0), (3, 3)])
    def test_get_and_set_palette_err(self, palette_size, palette_index):
        palette = Palette(palette_size)
        with pytest.raises(IndexError, match=CONSTANTS.PALETTE_OUT_OF_RANGE):
            palette[palette_index] = 0

    def test_set_transparency(self):
        palette = Palette(5)
        assert palette._Palette__contents[2].transparent == False

        palette.make_transparent(2)
        assert palette._Palette__contents[2].transparent == True

        palette.make_opaque(2)
        assert palette._Palette__contents[2].transparent == False

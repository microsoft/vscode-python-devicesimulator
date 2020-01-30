import pytest
from ..model.button import Button


class TestButton(object):
    def setup_method(self):
        self.button = Button()

    @pytest.mark.parametrize("pressed", [True, False])
    def test_is_pressed(self, pressed):
        self.button._Button__pressed = pressed
        assert pressed == self.button.is_pressed()

    @pytest.mark.parametrize("was_pressed", [True, False])
    def test_was_pressed(self, was_pressed):
        self.button._Button__prev_pressed = was_pressed
        assert was_pressed == self.button.was_pressed()
        # Button resets prev pressed after was_pressed() is called
        assert not self.button.was_pressed()

    @pytest.mark.parametrize("presses", [0, 2, 4])
    def test_get_presses(self, presses):
        self.button._Button__presses = presses
        assert presses == self.button.get_presses()
        # Presses is reset to 0 after get_presses() is called
        assert 0 == self.button.get_presses()

    def test_press_down(self):
        self.button._Button__press_down()
        assert self.button._Button__presses == 1
        assert self.button._Button__pressed
        self.button._Button__press_down()
        assert self.button._Button__presses == 2
        assert self.button._Button__pressed

    def test_release(self):
        self.button._Button__pressed = True
        self.button._Button__prev_pressed = False
        self.button._Button__release()
        assert not self.button._Button__pressed
        assert self.button._Button__prev_pressed

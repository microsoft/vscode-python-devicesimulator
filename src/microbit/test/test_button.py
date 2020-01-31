import pytest
from ..model.button import Button


class TestButton(object):
    def setup_method(self):
        self.button = Button()

    def test_press_down(self):
        self.button._Button__press_down()
        assert self.button._Button__presses == 1
        assert self.button._Button__pressed
        assert self.button._Button__prev_pressed
        self.button._Button__press_down()
        assert self.button._Button__presses == 2
        assert self.button._Button__pressed
        assert self.button._Button__prev_pressed

    def test_release(self):
        self.button._Button__pressed = True
        self.button._Button__prev_pressed = False
        self.button._Button__release()
        assert not self.button._Button__pressed

    def test_is_pressed(self):
        assert not self.button.is_pressed()
        self.button._Button__press_down()
        assert self.button.is_pressed()

    def test_was_pressed(self):
        assert not self.button.was_pressed()
        self.button._Button__press_down()
        self.button._Button__release()
        assert self.button.was_pressed()
        # Button resets __prev_pressed after was_pressed() is called.
        assert not self.button.was_pressed()

    @pytest.mark.parametrize("presses", [1, 2, 4])
    def test_get_presses(self, presses):
        assert 0 == self.button.get_presses()
        for i in range(presses):
            self.button._Button__press_down()
            self.button._Button__release()
        assert presses == self.button.get_presses()
        # Presses is reset to 0 after get_presses() is called.
        assert 0 == self.button.get_presses()

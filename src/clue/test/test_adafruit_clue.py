import pytest
from ..__model.image import Image

from ..__model import constants as CONSTANTS


class TestImage(object):
    def setup_method(self):
        self.image = Image()
        self.image_heart = Image(CONSTANTS.IMAGE_PATTERNS["HEART"])

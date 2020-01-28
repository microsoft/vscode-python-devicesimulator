from . import microbit_model
from . import image
from . import constants as CONSTANTS

# EXAMPLE
# can be called simply as "show_message("string")"
def show_message(message):
    microbit_model.mb.show_message(message)

# def Image(pattern = CONSTANTS.BLANK):
#     img = image.Image(pattern)
#     assign_constants(img)

def assign_constants(obj):
    obj.BOAT = image.MicrobitImage(CONSTANTS.BOAT)

display = microbit_model.mb.display
Image = image.Image


# define "constants" here
# Image.BOAT = image.Image(CONSTANTS.BOAT)


from . import microbit_model
from . import image
from . import constants as CONSTANTS

microbit = microbit_model.mb
Image = image.Image


# These are methods for image-to-string representation.
def repr(image):

    ret_str = "Image('"
    for index_y in range(0, image.height()):
        ret_str += image.__row_to_str(index_y)

    ret_str = ret_str + "')"

    return ret_str


def str(image):
    if type(image) is Image:
        ret_str = "Image('\n"
        for index_y in range(0, image.height()):
            ret_str += "\t" + image.__row_to_str(index_y) + "\n"

        ret_str = ret_str + "')"

        return ret_str
    else:
        # if not image, call regular str class
        return image.__str__()


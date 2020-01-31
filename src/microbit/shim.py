from .model import microbit_model
from .model import image

microbit = microbit_model.mb
Image = image.Image

# These are methods for image-to-string representation.
def repr(image):
    ret_str = "Image('"
    for index_y in range(0, image.height()):
        ret_str += image.row_to_str(index_y)

    ret_str = ret_str + "')"

    return ret_str


def str(image):
    if isinstance(image, Image):
        ret_str = "Image('\n"
        for index_y in range(0, image.height()):
            ret_str += "\t" + image.row_to_str(index_y) + "\n"

        ret_str = ret_str + "')"

        return ret_str
    else:
        # if not image, call regular str class
        return image.__str__()

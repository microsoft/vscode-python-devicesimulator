from . import microbit_model
from . import image
from . import constants as CONSTANTS

# EXAMPLE
# can be called simply as "show_message("string")"
def show_message(message):
    microbit_model.mb.show_message(message)


display = microbit_model.mb.display

microbit = microbit_model.mb
Image = image.Image

def repr(image):
    
    ret_str = "Image(\'"
    for index_y in range(0,image.height()):
        ret_str += image.row_to_str(index_y)
    
    ret_str = ret_str + "\')"

    return ret_str


def str(image):
    if type(image) is Image:
        ret_str = "Image(\'\n"
        for index_y in range(0,image.height()):
            ret_str += "\t" + image.row_to_str(index_y) + "\n"
        
        ret_str = ret_str + "\')"

        return ret_str
    else:
        # if not image, call regular str class
        return image.__str__()
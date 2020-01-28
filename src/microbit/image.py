from . import microbit_model
from . import constants as CONSTANTS
from . import display


class Image:
    _BOAT = None
    def __init__(self, pattern = CONSTANTS.BLANK, width=5,height=5):
        # State in the Python process
        self.width = width
        self.height = height
        if type(pattern) is str:
            self.LED = self.convert_to_array(pattern)
        else:
            self.LED = pattern

        
    def convert_to_array(self, pattern):
        arr = []
        sub_str = ""
        for elem  in pattern:
            sub_str= sub_str + elem
            if elem == ":":
                arr.append(sub_str)
                sub_str = ""

        
        arr.append(sub_str)
        return arr


    def set_pixel(self,x,y,value):

        sub_arr = self.LED[y]

        new_list = list(sub_arr)
        new_list[x] = value

        self.LED[y] = "".join(new_list)

    
    def get_pixel(self,x,y):
        return self.LED[y][x]
    
    def copy(self):
        return Image(list(self.LED))

    def getvalue(self):
        self._BOAT = Image(CONSTANTS.BOAT)
        return self._BOAT

    BOAT = property(getvalue)

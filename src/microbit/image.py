from . import microbit_model
from . import constants as CONSTANTS
from . import display

class Image:
    def __init__(self, pattern = CONSTANTS.BLANK):
        # State in the Python process
        if type(pattern) is str:
            self.LED = self.convert_to_array(pattern)
        else:
            self.LED = pattern

        
    def convert_to_array(self, pattern):
        arr = []
        sub_arr = []
        for elem in pattern:
            sub_arr.append(elem)
            if elem == ":":
                arr.append(sub_arr)
                sub_arr = []
            arr.append(sub_arr)
        return arr


    def set_pixel(self,x,y,value):
        try:
            self.LED[y][x] = value
        except TypeError:
            print(CONSTANTS.COPY_ERR_MESSAGE)

    
    def get_pixel(self,x,y):
        return self.LED[y][x]
    
    def copy(self):
        return Image(self.LED)
        
    def fill(self,value):
        for y in range(0,self.height):
            for x in range(0,self.width):
                self.LED[y][x] = value

    @property
    def width(self):
        if len(self.LED):
            return len(self.LED[0])
        else:
            return 0

    @width.setter
    def width(self):
        # will name exception later
        raise Exception

    @property
    def height(self):
        return len(self.LED)
    
    @height.setter
    def height(self):
        # will name exception later
        raise Exception

    

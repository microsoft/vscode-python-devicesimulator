from . import microbit_model
from . import constants as CONSTANTS
from . import display

class Image:
    def __init__(self, *args, **kwargs):
        print("args")
        print(args)
        # State in the Python process
        if (len(args)==0): 
            self.LED = CONSTANTS.BLANK
        elif (len(args)==1):
            pattern = args[0]
            if type(pattern) is str:
                self.LED = self.convert_to_array(pattern)
            else:
                self.LED = pattern
        else:
            width = args[0]
            height = args[1]
            self.LED = self.create_leds(width,height)

    

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

    def create_leds(self, w, h):
        arr = []
        for _ in range(0,h):
            sub_arr = []
            for _ in range(0,w):
                sub_arr.append(0)

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
        
    def invert(self,value):
        for y in range(0,self.height):
            for x in range(0,self.width):
                self.set_pixel(x, y, 9-value)
    
    
    def fill(self,value):
        for y in range(0,self.height):
            for x in range(0,self.width):
                self.set_pixel(x, y, value)

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

    def blit(self, src, x, y, w, h, xdest=0, ydest=0):
        for count_y in range(0, h):
            for count_x in range(0, w):
                if (ydest + count_y < self.height and
                    xdest + count_x < self.width and
                    y + count_y < src.height and
                    x + count_x < src.width):
                    transfer_pixel = src.get_pixel(x + count_x, y + count_y)
                    self.set_pixel(xdest + count_x, ydest + count_y, transfer_pixel)

    def crop(self, x, y, w, h):
        res = Image(w, h)
        res.blit(self, x, y, w, h)
        return res

    def shift_vertical(self,n):
        
        res = Image(self.width, self.height)
        if n > 0:
            # up
            res.blit(self, 0, n, self.width, self.height-n, 0, 0)
        else:
            # down
            res.blit(self, 0, 0, self.width, self.height-abs(n), 0, abs(n))
            
        return res

    
    def shift_horizontal(self,n):
        res = Image(self.width, self.height)
        if n > 0:
            # right
            res.blit(self, 0, 0, self.width-n, self.height, n, 0)
        else:
            # left
            res.blit(self, n, 0, self.width-n, self.height, 0, 0)
            
        return res


    def shift_up(self,n):
        return self.shift_vertical(n)

    def shift_down(self,n):
        return self.shift_vertical(n*-1)

    def shift_right(self,n):
        return self.shift_horizontal(n)

    def shift_left(self,n):
        return self.shift_horizontal(n*-1)


    def row_to_str(self, y):
        new_str = ""
        for x in range(0,self.width):
            new_str = new_str + str(self.get_pixel(x,y))
        
        new_str = new_str + ":"

        return new_str


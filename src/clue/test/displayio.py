
def get_index(index,width):
    return index[0] + index[1] * width

class Bitmap:
    def __init__(self, width, height, color_count):
        self.width = width
        self.height = height
        if color_count > 255:
            raise ValueError("Cannot support that many colors")
        self.values = bytearray(width * height)

    def __setitem__(self, index, value):
        if isinstance(index, tuple):
            index = index[0] + index[1] * self.width
        self.values[index] = value

    def __getitem__(self, index):
        if isinstance(index, tuple):
            index = index[0] + index[1] * self.width
        return self.values[index]

    def __len__(self):
        return self.width * self.height
    
    def draw(self,bmp,x,y,w,h,pixel_shader,scale):
        # new_width = self.width*scale
        # new_height = self.height*scale
        # new_values = bytearray(new_width*new_height)
        # print(x)
        # print(y)
        for i in range(h):
            for j in range(w):
                for i_new in range(scale):
                    for j_new in range(scale):
                        try:
                            # print(self[j,i])
                            
                            if (x*scale+j*scale+j_new>0 and y*scale+i*scale+i_new>0):
                                if self[j,i] > 0:
                                    pix = pixel_shader[1]
                                else:
                                    pix = pixel_shader[0]

                                bmp[x*scale+j*scale+j_new,y*scale+i*scale+i_new] = pix
                        except IndexError:
                            # print("indexerr")
                            continue

        # self.width = new_width
        # self.height = new_height
        # self.values = new_values
    


class Group():
    def __init__(self,max_size,scale):
        self.contents = []
        self.max_size = max_size
        self.scale = scale
    
    def append(self,item):
        self.contents.append(item)

    def draw(self,bmp,x,y,scale=None):
        if scale is None:
            scale = self.scale
        for idx,elem in enumerate(self.contents):
            elem.draw(bmp,x,y,self.scale)
            # try:
            #     y = y+elem.tile_height
            # except AttributeError:
            #     y = y+elem.height
    
class GroupItem():
    def draw(self,bmp,x,y,scale):
        pass

class TileGrid(GroupItem):
    def __init__(self,bitmap,pixel_shader,default_tile,tile_width,tile_height,x,y):
        self.bitmap = bitmap
        self.pixel_shader = pixel_shader
        self.default_tile = default_tile

        self.tile_width = tile_width
        self.tile_height = tile_height
        self.x = x
        self.y = y
    
    def draw(self,bmp,x,y,scale):
        # print(self.x+x)
        # print(self.y+y)
        # print()
        # print(self.x)
        # print(self.y)
        self.bitmap.draw(bmp=bmp,x=self.x+x,y=self.y+y,w=self.tile_width,h=self.tile_height,pixel_shader=self.pixel_shader,scale=scale)

class Palette():
    def __init__(self,color_count):
        self.color_count = color_count
        self.contents = []

        for i in range(self.color_count):
            self.contents.append(None)

    def __getitem__(self, index):
        return self.contents[index].get()

    def __setitem__(self, index, value):
        self.contents[index] = ColorType(value)

    def make_transparent(self,index):
        if not self.contents[index]:
            self.contents[index].transparent = True
    
    def make_opaque(self,index):
        if not self.contents[index]:
            self.contents[index].transparent = False


class ColorType():
    def __init__(self,rgb888):
        self.rgb888 = rgb888
        self.transparent = False
    
    def get(self):
        return self.rgb888


    
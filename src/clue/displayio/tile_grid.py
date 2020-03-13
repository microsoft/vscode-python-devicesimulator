from .group_item import GroupItem

class TileGrid(GroupItem):
    def __init__(
        self,
        bitmap,
        pixel_shader,
        default_tile=0,
        tile_width=None,
        tile_height=None,
        x=0,
        y=0,
        position=None,
    ):
        if tile_width is None:
            self.tile_width = bitmap.width
        else:
            self.tile_width = tile_width

        if tile_height is None:
            self.tile_height = bitmap.height
        else:
            self.tile_height = tile_height

        if position and isinstance(position, tuple):
            self.x = position[0]
            self.y = position[1]
        else:
            self.x = x
            self.y = y

        self.bitmap = bitmap
        self.pixel_shader = pixel_shader
        self.default_tile = default_tile

    def draw(self, x, y, scale):
        self.bitmap.draw(
            x=self.x + x,
            y=self.y + y,
            w=self.tile_width,
            h=self.tile_height,
            pixel_shader=self.pixel_shader,
            scale=scale,
        )

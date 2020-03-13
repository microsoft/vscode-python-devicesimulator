class ColorType:
    def __init__(self, rgb888):
        self.rgb888 = rgb888
        self.transparent = False

    def get(self):
        return self.rgb888
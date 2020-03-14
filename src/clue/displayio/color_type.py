class ColorType:
    def __init__(self, rgb888):
        self.rgb888 = rgb888
        self.transparent = False

    def __eq__(self, other):
        return isinstance(other,ColorType) and self.rgb888 == other.rgb888 and self.transparent == other.transparent
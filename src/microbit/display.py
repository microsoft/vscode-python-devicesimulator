# class for microbit led display
class Display:

    def __init__(self):
        # State in the Python process
        self.count = 4

    # SAMPLE FUNCTION
    def scroll(self, message):
        print("scroll!! " + str(self.count))
        self.count = self.count + 1
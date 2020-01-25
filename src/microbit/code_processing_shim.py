from . import microbit_model

# EXAMPLE
# can be called simply as "show_message("string")"
def show_message(message):
    microbit_model.mb.show_message(message)

# EXAMPLE
# can be called with display.scroll("string")
class display:
    @staticmethod
    def scroll(self, message):
        microbit_model.mb.display.scroll(self,message)
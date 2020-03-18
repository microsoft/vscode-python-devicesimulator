# overriden neopixel_write library to write to frontend

# original implementation docs for neopixel_write:
# https://circuitpython.readthedocs.io/en/5.0.x/shared-bindings/neopixel_write/__init__.html


def neopixel_write(gpio, buf):
    """Write buf out on the given DigitalInOut."""
    print(tuple(buf))

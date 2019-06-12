class LED:
    def __init__(self, state):
        self._state = state

    @property
    def red_led(self):
        return self._state['red_led']

    @red_led.setter
    def red_led(self, value):
        if (self.valid_led_value(value)):
            self._state['red_led'] = value
        raise ValueError('The LED value should either be True or False.')
    
    def valid_led_value(self, value):
        return type(value) is bool
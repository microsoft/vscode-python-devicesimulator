class ProducerProperty(property):
    def __get__(self, cls, owner):
        return classmethod(self.fget).__get__(cls, owner)()

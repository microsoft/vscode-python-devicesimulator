class MicrobitModel:
    def __init__(self):
        # State in the Python process
        self.__state = {}
        self.__debug_mode = False
        self.__abs_path_to_code_file = ""


mb = MicrobitModel()

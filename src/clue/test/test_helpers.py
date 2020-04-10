from base_circuitpython import base_cp_constants as CONSTANTS


class Helper:
    def __test_image_equality(self, image_1, image_2):
        for i in range(CONSTANTS.SCREEN_HEIGHT_WIDTH):
            for j in range(CONSTANTS.SCREEN_HEIGHT_WIDTH):
                pixel_1 = image_1[j, i]
                pixel_2 = image_2[j, i]

                if not isinstance(pixel_1, tuple):
                    pixel_1 = self.hex2rgba(pixel_1)

                if not isinstance(pixel_2, tuple):
                    pixel_2 = self.hex2rgba(pixel_2)
                assert pixel_1[0:3] == pixel_2[0:3]

    def hex2rgba(self, curr_colour):

        ret_list = []

        for i in range(3, -1, -1):
            val = (curr_colour >> (2 ** (i + 1))) & 255
            if val == 0:
                ret_list.append(0)
            else:
                ret_list.append(val)

        return tuple(ret_list)


helper = Helper()

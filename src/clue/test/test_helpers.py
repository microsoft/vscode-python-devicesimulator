from . import constants as CONSTANTS


class Helper:
    def __test_image_equality(self, image_1, image_2):
        for i in range(CONSTANTS.SCREEN_HEIGHT_WIDTH):
            for j in range(CONSTANTS.SCREEN_HEIGHT_WIDTH):
                pixel_1 = image_1[j, i]
                pixel_2 = image_2[j, i]
                # if not isinstance(pixel_1, tuple):
                #     pixel_1 = self.__convert_hex_to_rgb(pixel_1)

                # if not isinstance(pixel_2, tuple):
                #     pixel_2 = self.__convert_hex_to_rgb(pixel_2)

                assert pixel_1 == pixel_2

    def __convert_hex_to_rgb(self, val):
        return (
            (val >> 16) & 255,
            (val >> 8) & 255,
            (val) & 255,
        )


helper = Helper()

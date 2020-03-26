from base_circuitpython import base_cp_constants as CONSTANTS


class Helper:
    def __test_image_equality(self, image_1, image_2):
        for i in range(CONSTANTS.SCREEN_HEIGHT_WIDTH):
            for j in range(CONSTANTS.SCREEN_HEIGHT_WIDTH):
                pixel_1 = image_1[j, i]
                pixel_2 = image_2[j, i]
                assert pixel_1 == pixel_2


helper = Helper()

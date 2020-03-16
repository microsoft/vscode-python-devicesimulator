from . import constants as CONSTANTS


class Helper:
    def __test_image_equality(self, image_1, image_2):
        for i in range(CONSTANTS.SCREEN_HEIGHT_WIDTH):
            for j in range(CONSTANTS.SCREEN_HEIGHT_WIDTH):
                assert image_1[j, i] == image_2[j, i]


helper = Helper()

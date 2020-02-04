# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import sys
from . import constants as CONSTANTS


def remove_leading_slashes(string):
    string = string.lstrip("\\/")
    return string


def escape_if_OSX(file_name):
    if sys.platform.startswith(CONSTANTS.MAC_OS):
        file_name = file_name.replace(" ", "%20")
    return file_name

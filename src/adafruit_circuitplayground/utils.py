# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import sys
import json


def show(state):
    message = {'type': 'state', 'data': json.dumps(state)}
    print(json.dumps(message) + '\0', end='', file=sys.__stdout__)
    sys.stdout.flush()


def remove_leading_slashes(string):
    string = string.lstrip('\\/')
    return string

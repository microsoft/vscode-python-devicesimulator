# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import sys
import json
from playsound import playsound


def show(state):
    message = {'type': 'state', 'data': json.dumps(state)}
    print(json.dumps(message) + '\0', end='')
    sys.stdout.flush()


def remove_leading_slashes(string):
    string = string.lstrip('\\/')
    return string


def play_wave_file(file_name):
    abs_path_wav_file = remove_leading_slashes(file_name)
    if sys.implementation.version[0] >= 3:
        if file_name.endswith(".wav"):
            try:
                playsound(file_name)
            except:
                # TODO TASK: 29054 Verfication of a "valid" .wav file
                raise EnvironmentError(
                    "Your .wav file is not suitable for the Circuit Playground Express.")
        else:
            print('type error', flush=True)
            raise TypeError(file_name + " is not a path to a .wav file.")

    else:
        raise NotImplementedError("Please use Python 3 or higher.")

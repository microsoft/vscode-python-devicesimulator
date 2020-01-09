# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

from subprocess import check_output
import string
import os
import sys
import json
import python_constants as CONSTANTS
import uflash
if sys.platform == "win32":
    # pylint: disable=import-error
    import win32api


class Device:
    def __init__(self, file_path, name):
        self._name = name
        self._file_path = file_path
        self.connected = False
        self.error_message = None

    def find_device_directory(self):
        """
        Check if the Circuit Playground Express is available/plugged in
        """
        found_directory = None

        if sys.platform.startswith(CONSTANTS.LINUX_OS) or sys.platform.startswith(CONSTANTS.MAC_OS):
            # Mac or Linux
            mounted = check_output(CONSTANTS.MOUNT_COMMAND).decode(
                CONSTANTS.UTF_FORMAT).split('\n')
            for mount in mounted:
                drive_path = mount.split()[2] if mount else ""
                if drive_path.endswith(CONSTANTS.CPX_DRIVE_NAME):
                    found_directory = drive_path
                    break
        elif sys.platform == CONSTANTS.WINDOWS_OS:
            # Windows
            for drive_letter in string.ascii_uppercase:
                drive_path = "{}:{}".format(drive_letter, os.sep)
                if (os.path.exists(drive_path)):
                    drive_name = win32api.GetVolumeInformation(drive_path)[0]
                    if drive_name == CONSTANTS.CPX_DRIVE_NAME:
                        found_directory = drive_path
                        break
        else:
            raise NotImplementedError(
                CONSTANTS.NOT_SUPPORTED_OS.format(sys.platform))

        if not found_directory:
            self.connected = False
            self.error_message = (CONSTANTS.NO_CPX_DETECTED_ERROR_TITLE,
                                  CONSTANTS.NO_CPX_DETECTED_ERROR_DETAIL.format(sys.platform))
        else:
            self.connected = True
            self.error_message = None
        return found_directory

    def _connectToCpx(self):
        self.find_device_directory()

        if cpx.error_message:
            print("{}:\t{}".format(
                cpx.error_message[0], cpx.error_message[1]), file=sys.stderr, flush=True)
        import shutil
        if cpx.connected:
            dest_path = os.path.join(
                device_directory, self._file_path.rsplit(os.sep, 1)[-1])
            shutil.copyfile(self._file_path, dest_path)
            message = {'type': 'complete'}
        else:
            message = {'type': 'no-device'}
        
        return message

    def _connectToMicrobit(self):
        try:
            uflash.flash(path_to_python=self._file_path)
            message = {'type': 'complete'}
        except:
            message = {'type': 'no-device'}
        
        return message
    
    def deploy(self):
        if self._name == "Microbit":
            return self._connectToMicrobit()
        elif self._name == "Adafruit Playground":
            return self._connectToCpx()
        else:
            return {'type': 'no-device'}

if __name__ == "__main__":
    device = Device(sys.argv[1], sys.argv[2])
    message = device.deploy()
    
    print(json.dumps(message), flush=True)

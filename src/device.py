# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

from subprocess import check_output
import string
import os
import sys
import shutil
import json
import uflash
import python_constants as CONSTANTS

if sys.platform == "win32":
    # pylint: disable=import-error
    import win32api


class Device:
    def __init__(self, name, file_path):
        self.name = name
        self.file_path = file_path
        self.connected = False
        self.error_message = None

    def find_cpx_directory(self):
        """
        Check if the Circuit Playground Express is available/plugged in
        """
        found_directory = None

        if sys.platform.startswith(CONSTANTS.LINUX_OS) or sys.platform.startswith(
            CONSTANTS.MAC_OS
        ):
            # Mac or Linux
            mounted = (
                check_output(CONSTANTS.MOUNT_COMMAND)
                .decode(CONSTANTS.UTF_FORMAT)
                .split("\n")
            )
            for mount in mounted:
                drive_path = mount.split()[2] if mount else ""
                if drive_path.endswith(CONSTANTS.CPX_DRIVE_NAME):
                    found_directory = drive_path
                    break
        elif sys.platform == CONSTANTS.WINDOWS_OS:
            # Windows
            for drive_letter in string.ascii_uppercase:
                drive_path = "{}:{}".format(drive_letter, os.sep)
                if os.path.exists(drive_path):
                    drive_name = win32api.GetVolumeInformation(drive_path)[0]
                    if drive_name == CONSTANTS.CPX_DRIVE_NAME:
                        found_directory = drive_path
                        break
        else:
            raise NotImplementedError(CONSTANTS.NOT_SUPPORTED_OS.format(sys.platform))

        if not found_directory:
            self.connected = False
            self.error_message = (
                CONSTANTS.NO_CPX_DETECTED_ERROR_TITLE,
                CONSTANTS.NO_CPX_DETECTED_ERROR_DETAIL.format(sys.platform),
            )
        else:
            self.connected = True
            self.error_message = None
        return found_directory

    def deployToCPX(self):
        device_directory = self.find_cpx_directory()
        if self.error_message:
            print(
                "{}:\t{}".format(self.error_message[0], self.error_message[1]),
                file=sys.stderr,
                flush=True,
            )
        if self.connected:
            original_file_name = self.file_path.rsplit(os.sep, 1)[-1]
            if original_file_name == "code.py" or original_file_name == "main.py":
                dest_path = os.path.join(device_directory, original_file_name)
            else:
                dest_path = os.path.join(device_directory, "code.py")
            shutil.copyfile(self.file_path, dest_path)
            message = {"type": "complete"}
        else:
            message = {"type": "no-device"}
        return message

    def deployToMicrobit(self):
        # Temporarily redirecting stdout because there are some print statements in uflash library
        fake_stdout = open(os.devnull, "w")
        _stdout = sys.stdout
        sys.stdout = fake_stdout

        try:
            uflash.flash(path_to_python=self.file_path)
            message = {"type": "complete"}
        except RuntimeError:
            message = {"type": "low-python-version"}
        except IOError:
            self.error_message = CONSTANTS.NO_MICROBIT_DETECTED_ERROR_TITLE
            print(
                self.error_message, file=sys.stderr, flush=True,
            )
            message = {"type": "no-device"}

        sys.stdout = _stdout
        return message

    def deploy(self):
        if self.name == CONSTANTS.MICROBIT:
            return self.deployToMicrobit()
        elif self.name == CONSTANTS.CPX:
            return self.deployToCPX()
        else:
            return {"type": "no-device"}


if __name__ == "__main__":
    device = Device(sys.argv[1], sys.argv[2])
    message = device.deploy()
    print(json.dumps(message), flush=True)

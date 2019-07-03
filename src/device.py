from subprocess import check_output
import string
import os
import sys
if sys.platform == "win32":
    import win32api


class Adafruit:
    def __init__(self):
        self.connected = False
        self.error_message = None

    def find_device_directory(self):
        """
        Check if the Circuit Playground Express is available/plugged in
        """
        found_directory = None

        if sys.platform.startswith("linux") or sys.platform.startswith("darwin"):
            # Mac or Linux
            mounted = check_output(['mount']).split('\n')
            for name in mounted:
                print(name)
                if name.endswith("CIRCUITPY"):
                    found_directory = name
        elif sys.platform == "win32":
            for drive_letter in string.ascii_uppercase:
                drive_path = "{}:{}".format(drive_letter, os.sep)
                if (os.path.exists(drive_path)):
                    drive_name = win32api.GetVolumeInformation(drive_path)[0]
                    if drive_name == "CIRCUITPY":
                        found_directory = drive_path
        else:
            raise NotImplementedError(
                'The OS "{}" not supported.'.format(sys.platform))

        if not found_directory:
            self.connected = False
            self.error_message = ("No Circuitplayground Express detected",
                                  "In order to deploy to the device the device must be plugged in via USB")
        else:
            self.connected = True
            self.error_message = None
        return found_directory


if __name__ == "__main__":
    import shutil

    cpx = Adafruit()
    device_directory = cpx.find_device_directory()
    if cpx.error_message:
        print("{}:\t{}".format(cpx.error_message), file=sys.stderr, flush=True)
    if cpx.connected:
        dest_path = os.path.join(
            device_directory, sys.argv[1].rsplit(os.sep, 1)[-1])
        shutil.copyfile(sys.argv[1], dest_path)
        print("Completed", end="", flush=True)

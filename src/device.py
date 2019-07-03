from subprocess import check_output
import string
import os
import sys
if sys.platform == "win32":
    # pylint: disable=import-error
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
            mounted = check_output('mount').decode('utf-8').split('\n')
            for mount in mounted:
                drive_path = mount.split()[2] if mount else ""
                if drive_path.endswith("CIRCUITPY"):
                    found_directory = drive_path
        elif sys.platform == "win32":
            # Windows
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
            self.error_message = ("No Circuit Playground Express detected",
                                  "Could not find drive with name 'CIRCUITPYTHON'. Detected OS: {}".format(sys.platform))
        else:
            self.connected = True
            self.error_message = None
        return found_directory


if __name__ == "__main__":
    import shutil

    cpx = Adafruit()
    device_directory = cpx.find_device_directory()
    if cpx.error_message:
        print("{}:\t{}".format(
            cpx.error_message[0], cpx.error_message[1]), file=sys.stderr, flush=True)
    if cpx.connected:
        dest_path = os.path.join(
            device_directory, sys.argv[1].rsplit(os.sep, 1)[-1])
        shutil.copyfile(sys.argv[1], dest_path)
        print("Completed", end="", flush=True)

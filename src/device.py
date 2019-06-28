import os
import ctypes
from subprocess import check_output


class Adafruit:
    def __init__(self):
        self.connected = True
        self.error_message = None

    def workspace_dir(self):
        """
        Return the default location on the filesystem for opening and closing
        files.
        code from: https://github.com/mu-editor/mu/blob/master/mu/modes/adafruit.py
        """
        device_dir = None
        # Attempts to find the path on the filesystem that represents the
        # plugged in CIRCUITPY board.
        if os.name == 'posix':
            # We're on Linux or OSX
            for mount_command in ['mount', '/sbin/mount']:
                try:
                    mount_output = check_output(mount_command).splitlines()
                    mounted_volumes = [x.split()[2] for x in mount_output]
                    for volume in mounted_volumes:
                        if volume.endswith(b'CIRCUITPY'):
                            device_dir = volume.decode('utf-8')
                except FileNotFoundError:
                    next
        elif os.name == 'nt':
            # We're on Windows.

            def get_volume_name(disk_name):
                """
                Each disk or external device connected to windows has an
                attribute called "volume name". This function returns the
                volume name for the given disk/device.

                Code from http://stackoverflow.com/a/12056414
                """
                vol_name_buf = ctypes.create_unicode_buffer(1024)
                ctypes.windll.kernel32.GetVolumeInformationW(
                    ctypes.c_wchar_p(disk_name), vol_name_buf,
                    ctypes.sizeof(vol_name_buf), None, None, None, None, 0)
                return vol_name_buf.value

            #
            # In certain circumstances, volumes are allocated to USB
            # storage devices which cause a Windows popup to raise if their
            # volume contains no media. Wrapping the check in SetErrorMode
            # with SEM_FAILCRITICALERRORS (1) prevents this popup.
            #
            old_mode = ctypes.windll.kernel32.SetErrorMode(1)
            try:
                for disk in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ':
                    path = '{}:\\'.format(disk)
                    if (os.path.exists(path)):
                        if (get_volume_name(path) == 'CIRCUITPY'):
                            self.configured = True
                            return path

            finally:
                ctypes.windll.kernel32.SetErrorMode(old_mode)
        else:
            # No support for unknown operating systems.
            raise NotImplementedError('OS "{}" not supported.'.format(os.name))

        if device_dir:
            # Found it!
            self.connected = True
            return device_dir
        else:
            wd = None
            if self.connected:
                m = 'Could not find an attached Adafruit CircuitPython'\
                    ' device.'
                info = "In order to deploy to the physical device you must"\
                    " have a formatted device plugged in while in bootloader mode."
                self.error_message = (m, info.format(wd))
                self.connected = False
            return wd


if __name__ == "__main__":
    import shutil
    import sys

    cpx = Adafruit()
    device_directory = cpx.workspace_dir()
    if cpx.error_message:
        print("Error trying to send event to the process : ",
              cpx.error_message, file=sys.stderr, flush=True)
    if cpx.connected:
        dest_path = os.path.join(device_directory, "code.py")
        shutil.copyfile(sys.argv[1], dest_path)
        print("Completed", end="", flush=True)
    else:
        print("Device not found", file=sys.stderr, flush=True)

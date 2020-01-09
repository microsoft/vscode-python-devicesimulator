import sys
import uflash

if sys.platform == "win32":
    # pylint: disable=import-error
    import win32api


if __name__ == "__main__":
    uflash.flash(path_to_python=sys.argv[1])

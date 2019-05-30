import sys
import json

# Read data from stdin


def read_in():
    lines = sys.stdin.readlines()
    # Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])


def main():
    # get our data as an array from read_in()
    # lines = read_in()

    openCmd = {
        "cpx": {
            'pixels': [
                (0, 0, 255),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
            ],
            'button_a': False,
            'button_b': False,
        }
    }
    print(json.dumps(openCmd))


# start process
if __name__ == '__main__':
    main()

# pylint: skip-file
# Remove the above when TTF is actually supported.

import struct


# https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6glyf.html

class TTF:
    def __init__(self, f):
        f.seek(0)
        self.file = f

        self.characters = {}

        def read(format):
            s = struct.calcsize(format)
            return struct.unpack_from(format, f.read(s))

        scalar_type = read(">I")
        numTables, searchRange, entrySelector, rangeShift = read(">HHHH")

        print(numTables)
        table_info = {}
        for _ in range(numTables):
            tag, checkSum, offset, length = read(">4sIII")
            print(tag.decode("utf-8"), hex(checkSum), offset, length)
            table_info[tag] = (offset, length)

        head_offset, head_length = table_info[b"head"]
        f.seek(head_offset)
        version, fontRevision, checkSumAdjustment, magicNumber = read(">IIII")
        flags, unitsPerEm, created, modified = read(">HHQQ")
        xMin, yMin, xMax, yMax = read(">hhhh")
        print(xMin, yMin, xMax, yMax)
        macStyle, lowestRecPPEM, fontDirectionHint = read(">HHh")
        indexToLocFormat, glyphDataFormat = read(">hh")

        glyf_offset, glyf_length = table_info[b"glyf"]
        f.seek(glyf_offset)
        while f.tell() < glyf_offset + glyf_length:
            numberOfContours, xMin, yMin, xMax, yMax = read(">hhhhh")

            if numberOfContours > 0: # Simple
                print(numberOfContours)
                ends = []
                for _ in range(numberOfContours):
                    ends.append(read(">H"))
                instructionLength = read(">h")[0]
                instructions = read(">{}s".format(instructionLength))[0]
                print(instructions)
                break
            else:
                raise RuntimeError("Unsupported font")

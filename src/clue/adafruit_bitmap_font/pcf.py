# pylint: skip-file
# Remove the above when PCF is actually supported.

from .glyph_cache import GlyphCache
import displayio
import struct

_PCF_PROPERTIES = (1<<0)
_PCF_ACCELERATORS = (1<<1)
_PCF_METRICS = (1<<2)
_PCF_BITMAPS = (1<<3)
_PCF_INK_METRICS = (1<<4)
_PCF_BDF_ENCODINGS = (1<<5)
_PCF_SWIDTHS = (1<<6)
_PCF_GLYPH_NAMES = (1<<7)
_PCF_BDF_ACCELERATORS = (1<<8)

_PCF_DEFAULT_FORMAT = 0x00000000
_PCF_INKBOUNDS = 0x00000200
_PCF_ACCEL_W_INKBOUNDS = 0x00000100
_PCF_COMPRESSED_METRICS = 0x00000100

_PCF_GLYPH_PAD_MASK = (3<<0)        # See the bitmap table for explanation */
_PCF_BYTE_MASK = (1<<2)        # If set then Most Sig Byte First */
_PCF_BIT_MASK = (1<<3)        # If set then Most Sig Bit First */
_PCF_SCAN_UNIT_MASK = (3<<4)

# https://fontforge.github.io/en-US/documentation/reference/pcf-format/

class PCF(GlyphCache):
    def __init__(self, f):
        super().__init__()
        self.file = f
        self.name = f
        f.seek(0)
        header, table_count = self.read("<4sI")
        self.tables = {}
        for _ in range(table_count):
            type, format, size, offset = self.read("<IIII")
            self.tables[type] = {"format": format, "size": size, "offset": offset}
            print(type)

    def read(self, format):
        s = struct.calcsize(format)
        return struct.unpack_from(format, self.file.read(s))

    def get_bounding_box(self):
        property_table_offset = self.tables[_PCF_PROPERTIES]["offset"]
        self.file.seek(property_table_offset)
        format, = self.read("<I")

        if format & _PCF_BYTE_MASK == 0:
            raise RuntimeError("Only big endian supported")
        nprops, = self.read(">I")
        self.file.seek(property_table_offset + 8 + 9 * nprops)

        pos = self.file.tell()
        if pos % 4 > 0:
            self.file.read(4 - pos % 4)
        string_size, = self.read(">I")

        strings = self.file.read(string_size)
        string_map = {}
        i = 0
        for s in strings.split(b"\x00"):
            string_map[i] = s
            i += len(s) + 1

        self.file.seek(property_table_offset + 8)
        for _ in range(nprops):
            name_offset, isStringProp, value = self.read(">IBI")

            if isStringProp:
                print(string_map[name_offset], string_map[value])
            else:
                print(string_map[name_offset], value)
        return None

    def load_glyphs(self, code_points):
        metadata = True
        character = False
        code_point = None
        rounded_x = 1
        bytes_per_row = 1
        desired_character = False
        current_info = None
        current_y = 0
        total_remaining = len(code_points)

        x, _, _, _ = self.get_bounding_box()
        # create a scratch bytearray to load pixels into
        scratch_row = memoryview(bytearray((((x-1)//32)+1) * 4))

        self.file.seek(0)
        while True:
            line = self.file.readline()
            if not line:
                break
            if line.startswith(b"CHARS "):
                metadata = False
            elif line.startswith(b"SIZE"):
                _, self.point_size, self.x_resolution, self.y_resolution = line.split()
            elif line.startswith(b"COMMENT"):
                pass
            elif line.startswith(b"STARTCHAR"):
                # print(lineno, line.strip())
                #_, character_name = line.split()
                character = True
            elif line.startswith(b"ENDCHAR"):
                character = False
                if desired_character:
                    self._glyphs[code_point] = current_info
                    if total_remaining == 0:
                        return
                desired_character = False
            elif line.startswith(b"BBX"):
                if desired_character:
                    _, x, y, dx, dy = line.split()
                    x = int(x)
                    y = int(y)
                    dx = int(dx)
                    dy = int(dy)
                    current_info["bounds"] = (x, y, dx, dy)
                    current_info["bitmap"] = displayio.Bitmap(x, y, 2)
            elif line.startswith(b"BITMAP"):
                if desired_character:
                    rounded_x = x // 8
                    if x % 8 > 0:
                        rounded_x += 1
                    bytes_per_row = rounded_x
                    if bytes_per_row % 4 > 0:
                        bytes_per_row += 4 - bytes_per_row % 4
                    current_y = 0
            elif line.startswith(b"ENCODING"):
                _, code_point = line.split()
                code_point = int(code_point)
                if code_point == code_points or code_point in code_points:
                    total_remaining -= 1
                    if code_point not in self._glyphs:
                        desired_character = True
                        current_info = {"bitmap": None, "bounds": None, "shift": None}
            elif line.startswith(b"DWIDTH"):
                if desired_character:
                    _, shift_x, shift_y = line.split()
                    shift_x = int(shift_x)
                    shift_y = int(shift_y)
                    current_info["shift"] = (shift_x, shift_y)
            elif line.startswith(b"SWIDTH"):
                pass
            elif character:
                if desired_character:
                    bits = int(line.strip(), 16)
                    for i in range(rounded_x):
                        val = (bits >> ((rounded_x-i-1)*8)) & 0xFF
                        scratch_row[i] = val
                    current_info["bitmap"]._load_row(current_y, scratch_row[:bytes_per_row])
                    current_y += 1
            elif metadata:
                #print(lineno, line.strip())
                pass

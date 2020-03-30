# import board
# import terminalio

# import displayio
# from adafruit_display_text import label
# import collections
# from PIL import Image


# def create_newline(de, str_list):
#     for string in str_list:
#         de.appendleft(string)

#     over = len(de) - 15
#     if over > 0:
#         for i in range(over):
#             de.pop()


# def show(output_values):

#     # reset bmp_img to all black
#     displayio.img.paste("black", [0, 0, displayio.img.size[0], displayio.img.size[1]])
#     # new_img = Image.new("RGBA", (240,240))

#     splash = displayio.Group(max_size=20, auto_write=False)
#     curr_y = 5 + (16 * (15 - len(output_values)))
#     for o in reversed(output_values):
#         text_area = label.Label(terminalio.FONT, text=o, line_spacing=1.25)
#         text_area.y = curr_y
#         curr_y += 16
#         text_area.x = 15
#         splash.append(text_area)

#     board.DISPLAY.show(splash)


# def add_str_to_terminal(output_values, curr_display_string):

#     line_break_amt = 37
#     newline_expected_val = line_break_amt
#     out_str = ""
#     new_strs = []
#     for idx, d in enumerate(curr_display_string):
#         if d == "\n":
#             newline_expected_val = line_break_amt
#             new_strs.append(out_str)
#             out_str = ""
#             continue
#         elif newline_expected_val == 0:
#             new_strs.append(out_str)
#             out_str = ""
#             newline_expected_val = line_break_amt
#         else:
#             newline_expected_val -= 1
#         out_str += d
#     new_strs.append(out_str)
#     create_newline(output_values, new_strs)
#     show(output_values)


# display_strings = [
#     "HELLO",
#     "HELLO",
#     "test3",
#     "test4",
#     "test5",
#     "test6",
#     "test7",
#     "test8",
#     "test9",
#     "test10",
#     "test11",
#     "test12",
#     "test13",
#     "test14",
#     "test15",
#     "test16",
#     "potato\nyeee",
#     "uwu dcfgvhjbnkml,;.dcfgvhbjnkml,kml,;.dcfgvhbjnkml,h",
#     "owo kml,;.dcfgvhbjnkml,kml,;.dcfgvhbjnkml,",
#     "kyutegvhbjnkml,kml,;.dcfgvhbjn",
#     "animal cgvhbjnkml,kml,;.dcfgvhbjnrossing!!",
#     "uwugvhbjnkml,kml,;.dcf\ngvhbjngvhbjnkml,kml,;.dcfgvhbjngvhbjnkml,kml,;.dcfgvhbjngvhbjnkml,kml,;.dcfgvhbjngvhbjnkml,kml,;.dcfgvhbjn",
#     "owgvhbjnkml,kml,;.dcfgvhbjno",
#     # "kyutgvhbjnkml,kml,;.dcfgvhbjne",
#     # "animal gvhbjnkml,kml,;.dcfgvhbjncrossing!!",
#     # "uwugvhbjnkml\n,kml,;.dcfgvhbjn",
#     # "owogvhb\njnkml,kml,;.dcfgvhbjn",
#     # "kyutgvhbjnkml,kml,;.\ndcfgvhbjne",
#     # "animal crgvhbjnkml,kml,;.dcfgvhbjnossing!!",
#     # "uwugvhbjnkml\n,kml,;.dcfgvhbjn",
#     # "owgvhbjnkml,kml,;.dcfgvhbjno",
#     # "kyugvhbjnkml,kml,;.dcfgvhbjnte",
#     # "animal gvhbjnkml,kml,;.dcfgvhbjncrossing!!",
#     # "uwgvhbjnkml,kml,;.dcfgvhbjnu",
#     # "owo",
#     # "kyute",
#     # "animal crossing!!",
# ]


# # TERMS FOR LINE BREAKS:

# # if you take out all newline characters, the number
# # of characters (n) divided by 60 should give you the number
# # of newlines

# # given an unexpected newline character, the counter resets
# # and the next newline is delayed by as many charactesr as the unexpedcted
# # newline is from a purposely placed newline

# # initializing deque
# output_values = collections.deque()

# for d in display_strings:
#     add_str_to_terminal(output_values, d)
#     # show(output_values)
# while True:
#     pass

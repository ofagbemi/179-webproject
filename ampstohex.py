import ctypes
import sys

def float_to_binary_string(f):
  return bin(ctypes.c_int.from_buffer(ctypes.c_float(f)).value).replace('0b', '')

hex_amps = list()
print 'Getting amplitudes from ' + sys.argv[1]
with open(sys.argv[1]) as amps:
  for line in amps.readlines():
    hex_amps.append(hex(int(float(line) * 16777215)).replace('0x', ''))
    # hex_amps.append(hex(int(float_to_binary_string(float(line)), 2)).replace('0x', ''))

print hex_amps
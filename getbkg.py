import subprocess
import sys
import tempfile

sys.stdout.write('sound file: ')
infile = raw_input()
sys.stdout.write('bpm: ')
bpm = raw_input()
colors = list()
with tempfile.NamedTemporaryFile() as temp:
  proc = subprocess.Popen(['./sound2text', infile, temp.name, bpm],
                           stdout=subprocess.PIPE)
  proc.wait()
  if proc.returncode != 0:
    print 'There was an error. Make sure the provided filename is correct and try again.'
    sys.exit(0)
  
  color_proc = subprocess.Popen(['python', 'ampstohex.py', temp.name])
  color_proc.wait()
  if color_proc.returncode != 0:
    print 'There was an error.'
    sys.exit(0)
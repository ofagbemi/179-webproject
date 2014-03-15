import urllib
import urllib2
import urlparse
import json
import random
import re
import subprocess
import sys
import tempfile
import time

def randomIP():
  return (str(random.randint(0, 255)) + '.' + 
         str(random.randint(0, 255)) + '.' + 
         str(random.randint(0, 255)) + '.' + 
         str(random.randint(0, 255)))

def fixUnicode(w):
  word = w.strip()
  if '\\u' in word:
    chars = re.findall('(?<=\\u)[0-9a-zA-Z]{4}', word)
    unicodeword = ''
    startindex = 0
    for char in chars:
      endindex = startindex + word[startindex:].find('\\u' + char)
      unicodeword += (word[startindex:endindex] + unichr(int(char, 16)))
      temp = startindex
      startindex = endindex + 6
    return unicodeword
  else:
    return word

def getTermsList():
  trendsurl = 'http://hawttrends.appspot.com/api/terms/'
  d = eval(urllib2.urlopen(trendsurl).read())
  terms = list()
  for key in d:
    terms = terms + d[key]
  return terms

class TermResults:
  def __init__(self, term):
    self.term = term
    self.query_url = (
      'https://ajax.googleapis.com/ajax/services/search/images?' +
      'v=1.0&q=' + urllib.quote_plus(self.term.encode('utf8'))
    )
    response = json.loads(urllib2.urlopen(self.query_url).read())
    print self.term + ' (' + str(response['responseStatus']) + "): " +  str(response['responseDetails'])
    if response and response['responseData']:
      full_results = response['responseData']['results']
      self.results = list()
      for full_result in full_results:
        self.results.append(full_result['url'])
    else:
      self.results = None
    
    self.status = response['responseStatus']
    self._current = 0
  
  def get_next_img_url(self):
    ret = self.results[self._current]
    self._current = (self._current + 1) % len(self.results)
    return ret

results = list()
terms = list(set(getTermsList()))
random.shuffle(terms)
serverbreak = 1200
numtries = 0
numtriesallowed = 8
for term in terms:
  numtries = numtries + 1
  try:
    # get fixed term here
    fixed_term = fixUnicode(term)
  except ValueError:
    print 'Couldn\'t parse ' + term + ', sorry!'
    continue
  result = None
  try:
    result = TermResults(fixed_term)
  except urllib2.URLError:
    print 'Error connecting. Trying again soon...'
  while not result or not result.results:
    numtries = numtries + 1
    if numtries > numtriesallowed:
      print 'Skipping ' + fixed_term + ' after ' + str(numtriesallowed) + ' tries, sorry!'
      numtries = 0
      break
    print 'Failed to grab ' + fixed_term
    if result.status == 403:  # wait to retry if we hit a 403
      for i in range(serverbreak):
        sys.stdout.write('Retrying in ' + str(serverbreak - i) + ' seconds')
        sys.stdout.flush()
        time.sleep(1)
        sys.stdout.write('\r')
        sys.stdout.flush()
    try:
      result = TermResults(fixed_term)
    except urllib2.URLError:
      print 'There was an error making a connection. Press enter to try again'
      raw_input()
  numtries = 0
  if not result or not result.results:
    continue
  
  results.append(result)

print 'Got ' + str(len(results)) + ' results'
sys.stdout.write('sound file: ')
infile = raw_input()
sys.stdout.write('bpm: ')
bpm = raw_input()
amps = list()
with tempfile.NamedTemporaryFile() as temp:
  proc = subprocess.Popen(['./sound2text', infile, temp.name, bpm],
                           stdout=subprocess.PIPE)
  proc.wait()
  if proc.returncode != 0:
    print 'There was an error. Make sure the provided filename is correct and try again.'
    sys.exit(0)
  for line in temp:
    amps.append(float(line))

resultssize = len(results)
with open('imagesfixed.html', 'w') as output:
  for factor in amps:
    result = results[int(factor * resultssize)]
    imgurl = result.get_next_img_url()
    htmlstr = '<img class="audio_img" term="' + result.term + '" src="' + imgurl + '">'
    # output.write(htmlstr)
    print urllib.unquote(htmlstr)
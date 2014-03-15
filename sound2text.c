#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <string.h>
#include <inttypes.h>
#include <math.h>
#include <portsf.h>

#define max(x,y) ((x) > (y) ? (x) : (y))

enum {ARG_PROGNAME, ARG_INFILE, ARG_OUTFILE, ARG_BPM, NARGS};

int getPeakValues(float* peaks, int channels, int infile){
  const int kNumFramesInBuffer = 256;
  float frames[kNumFramesInBuffer * sizeof(float) * channels];
  memset(frames, 0, kNumFramesInBuffer * channels * sizeof(float));
  long numFramesRead = psf_sndReadFloatFrames(infile, frames, kNumFramesInBuffer);
  while(numFramesRead > 0){
    long numFloatsInBuffer = numFramesRead * channels;
    for(long i = 0; i < numFloatsInBuffer; i++){
      peaks[i%channels] = max(peaks[i%channels], fabs(frames[i]));
    }
    numFramesRead = psf_sndReadFloatFrames(infile, frames, kNumFramesInBuffer);
  }
  if(psf_sndSeek(infile, 0, PSF_SEEK_SET) < 0){
    fprintf(stderr, "Couldn't rewind the file\n");
    return -1;
  }
  return 0;
}

int main(int argc, char* argv[]){
  int error = 0;
  float* frames = NULL;
  float* outframes = NULL;
  PSF_CHPEAK* peaks = NULL;
  int infile = -1;
  int outfile = -1;
  bool shouldDeleteOutfile = false;
  
  if(argc < NARGS){
    fprintf(stderr, "Too few args to mymain\n  usage: sound2text infile bpm\n");
    return 1;
  }
  
  if(psf_init()){
    fprintf(stderr, "Unable to initialize portsf\n");
    return 1;
  }

  PSF_PROPS props;
  infile = psf_sndOpen(argv[ARG_INFILE], &props, 0);
  if(infile < 0){
    error++;
    goto exit;
  }
  
  peaks = malloc(sizeof(PSF_CHPEAK) * props.chans);
  if(peaks == NULL){
    puts("No memory\n");
    error++;
    goto exit;
  }
  
  float* peak_vals = malloc(sizeof(float) * props.chans);
  getPeakValues(peak_vals, props.chans, infile);
  
  double bpm = atof(argv[ARG_BPM]);
  const long kNumFramesInBuffer = props.srate/(bpm/60.0);
  frames = malloc(kNumFramesInBuffer * sizeof(float) * props.chans);
  if(frames == NULL){
    puts("No memory\n");
    error++;
    goto exit;
  }
  
  FILE* amptmpfile = fopen(argv[ARG_OUTFILE], "w");
  
  fprintf(stderr, "Processing...\n");
  long long totalFramesRead = 0;
  long numFramesRead = psf_sndReadFloatFrames(infile, frames, kNumFramesInBuffer);
  long totalFramesWritten = 0;
  long currentWrittenSize = 1000;
  double* writtenFrames = malloc(sizeof(float) * currentWrittenSize);
  double writePeak = 0.0;
  while(numFramesRead > 0){
    totalFramesRead += numFramesRead;
    long numFloatsInBuffer = numFramesRead * props.chans;
    double val = frames[0]/peak_vals[0];
    if(totalFramesWritten >= currentWrittenSize){
      currentWrittenSize *= 2;
      writtenFrames = realloc(writtenFrames, currentWrittenSize);
    }
    if(fabs(val) > writePeak) writePeak = fabs(val);
    writtenFrames[totalFramesWritten] = val;
    totalFramesWritten++;
    
    fprintf(stderr, "Processed %"PRIi64" frames\r", totalFramesRead);
    numFramesRead = psf_sndReadFloatFrames(infile, frames, kNumFramesInBuffer);
  }
  
  // normalize to 0.5 range then shift over to 0.0 to 1.0 range
  for(long i = 0; i < totalFramesWritten; i++){
    writtenFrames[i] *= 0.5/writePeak;
    writtenFrames[i] += 0.5;
    fprintf(amptmpfile, "%.4f\n", writtenFrames[i]);
  }
  
  if(numFramesRead < 0){
    fprintf(stderr, "Error reading infile. Outfile is incomplete\n");
    error++;
  } else{
    fprintf(stderr, "Done. %"PRIi64" sample frames read and %ld written\n",
           totalFramesRead, totalFramesWritten);
  }
  
  fclose(amptmpfile);
  

  exit:
    if(infile > -1) psf_sndClose(infile);
    if(frames) free(frames);
    if(outframes) free(outframes);
    if(peaks) free(peaks);
  
  psf_finish();
  return error;
}
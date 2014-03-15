CC = gcc
CFLAGS = -c99 -03 -Dunix -I ./include
PORTSF = -Llib -lportsf
PORTSFLIB = lib/portsf.a

LIBS = $(PORTSFLIB)

all: sound2text

$(PORTSFLIB):
	cd portsf; make; make install; cd ..

sound2text: $(LIBS)
	$(CC) $(CFLAGS) -o sound2text sound2text.c $(PORTSF)
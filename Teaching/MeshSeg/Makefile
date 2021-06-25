########################################################################
# This Makefile can be used to execute your program once it is compiled.
# It can contain commands that generate images in your submitted 
# output directory from the ones in your input directory.
########################################################################



########################################################################
# Executable name
########################################################################

EXE=src/lap



########################################################################
# This command tells the make file how to execute src/lap
# to produce output from basic rules.
########################################################################

output/%.off: input/%.off 
	$(EXE) $< -output_mesh $@

output/%.txt: input/%.off input/%.txt 
	$(EXE) input/$*.off -input_function input/$*.txt -output_function $@

output/%.jpg: input/%.off
	$(EXE) input/$*.off -output_image $@ -batch



########################################################################
# "make all" or simply "make" should make all output images
########################################################################

all: \
	$(EXE) \
        output/ico.jpg
	
clean:
	cd src; make clean
	rm -f output/*

$(EXE): src
	cd src; make




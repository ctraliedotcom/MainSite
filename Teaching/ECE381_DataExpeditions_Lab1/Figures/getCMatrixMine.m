%Fs: Sampling rate of audio (cycles/second)
%N: The window size of the short-time Fourier Transform
function [C] = getCMatrixMine(Fs, N)
    NSpec = N/2 + 1;%The number of bins in the spectrogram
    C = zeros(12, NSpec);%Allocate space for the C matrix
    A0 = 440.0/4;%The lowest octave range to search
    FMax = Fs/2;%Maximum frequency supported by this sampling rate
    
    for ii = 1:12%For each note
        row = zeros(1, NSpec);%This row of the C matrix
        halfstep = ii - 1;%Halfstep offsets from the base frequency A0
        fBase = A0*2^(halfstep/12);%The base frequency
        maxOctave = floor(log(FMax/fBase)/log(2));%The maximum octave index
        for octave = 0:maxOctave
            f = fBase*2^octave;
            %Find the fractional bin index "k" of the frequency corresponding
            %to this halfstep and this octave
            k = (f/Fs)*N;
            bump = 0:NSpec-1;
            bump = exp(-15*abs(log(bump/k)/log(2)));
            bump = bump/norm(bump);
            row = row + bump;
        end
        C(ii, :) = row;
    end
end
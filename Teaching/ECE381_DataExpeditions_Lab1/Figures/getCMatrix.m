%Fs: Sampling rate of audio (cycles/second)
%N: The window size of the short-time Fourier Transform
function [C] = getCMatrix(Fs, N)
    NSpec = N/2 + 1;%The number of bins in the spectrogram
    C = zeros(12, NSpec);%Allocate space for the C matrix
    A0 = 440.0/4;%The lowest octave range to search
    FMax = Fs/2;%Maximum frequency supported by this sampling rate
    
    %For each note
        row = zeros(1, NSpec);%This row of the C matrix
        %Compute the base frequency for this note, in relation to A0, save
        %in variable "fBase"
        maxOctave = floor(log(FMax/fBase)/log(2));%The maximum octave index
        %For each octave from 0 to the max octave
            f = fBase*2^octave;
            %Find the fractional bin index "k" of the frequency corresponding
            %to this halfstep and this octave
            
            %Create an exponential gaussian bump around k in the frequency
            %domain
            bump = 0:NSpec-1;
            bump = exp(-15*abs(log(bump/k)/log(2)));
            bump = bump/norm(bump);
            row = row + bump;
        %end for
        C(ii, :) = row;
    %End for
end
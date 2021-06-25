%Load in the audio signal, where X
%is the signal and Fs is the sampling rate
[X, Fs] = audioread('piano-chrom.wav'); 

N = 16384;%Window size of STFT
 
S = spectrogram(X,N);%Compute the spectrogram
S = abs(S);

C = getCMatrixMine(Fs, N);

%Take the local max
% idxbefore = [1 1:size(S, 1)-1];
% idxafter = [2:size(S, 1) size(S, 1)];
% S = S.*(S >= S(idxbefore, :)).*(S >= S(idxafter, :));

Y = C*S;%Perform the multiplication by the chromagram matrix
imagesc(Y);
notes = {'A', 'A^#/B^b', 'B', 'C', 'C^#/D^b', 'D', 'D^#/E^b', 'E', 'F', 'F^#/G^b', 'G', 'G^#/A^b'};
set(gca, 'YTick', 1:12);
set(gca, 'YTickLabel', notes);
[X, Fs] = audioread('piano-shepard.wav');
[Y, COut] = chromagram_P(X, Fs);
fftlen = 2048;
freqs = (1:size(COut, 2))*Fs/fftlen;
imagesc(freqs, 1:12, COut);
xlabel('Frequency (hz)');
ylabel('Note');
title('Chroma Weights Matrix (W)');
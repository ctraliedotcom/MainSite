%Step 1: Generate a sample chirp sound
Fs = 22050;%Sampling rate
T = 1/Fs;%Sampling interval/period
t = 0:T:2;%Two seconds of audio
X = chirp(t,440,2,880);%Increase frequency linearly from 440hz to 880hz (one octave)
sound(X, Fs);%Play the sound

%Step 2: Compute and plot the magnitude of the spectrogram
N = 1024;%The window size
S = spectrogram(X,N);%Compute the spectrogram
S = abs(S);%Take the absolute value and plot
imagesc(S);
xlabel('Short Time Window Index (Tau)');
ylabel('Frequency Bin (k)');
title('Spectrogram of a Chirp');

C = getCMatrixMine(Fs, N);
Y = C*S;
imagesc(Y);
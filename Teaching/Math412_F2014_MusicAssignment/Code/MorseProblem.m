%Compute the feature embeddings of the rock and classical song
XClassical = getDelaySeriesJavascriptPCA('classical.au', 512, 1, 43, 'classical');
JClassical = getMorseFiltered0DDiagrams(XClassical);
XRock = getDelaySeriesJavascriptPCA('rock.au', 512, 1, 43, 'rock');
JRock = getMorseFiltered0DDiagrams(XRock);

%Sort the points in descending order of persistence
JClassical = sort(JClassical(:, 2) - JClassical(:, 1), 'descend');
JRock = sort(JRock(:, 2) - JRock(:, 1), 'descend');

%Plot and compare the sorted persistences
plot(JClassical);
hold on;
plot(JRock);
legend({'Classical', 'Rock'});
xlabel('ith strongest Persistence Point');
ylabel('Persistence');
title('Sorted Persistence for Morse Filtrations');
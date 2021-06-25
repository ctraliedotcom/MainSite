function [DelaySeries] = getDelaySeriesJavascriptPCA( filename, hopSize, skipSize, windowSize, outprefix )
    [DelaySeries, ~, SampleDelays] = getDelaySeriesFeatures( filename, hopSize, skipSize, windowSize );
    
    %Center on mean and scale by the standard deviation of each feature
    DelaySeries = bsxfun(@minus, mean(DelaySeries), DelaySeries);
    DelaySeries = bsxfun(@times, 1./std(DelaySeries), DelaySeries);
    [~, DelaySeriesPCA, latent] = pca(DelaySeries);

    readSuccess = 0;
    while readSuccess == 0
        try
            [X, Fs] = audioread(filename);
            readSuccess = 1;
        catch
            readSuccess = 0;
        end
    end    
    
    SampleDelays = SampleDelays/Fs;
    audiowrite(sprintf('%s.ogg', outprefix), X, Fs);
    fout = fopen(sprintf('%s.txt', outprefix), 'w');
    for ii = 1:size(DelaySeriesPCA, 1)
       fprintf(fout, '%g,%g,%g,%g,', DelaySeriesPCA(ii, 1), DelaySeriesPCA(ii, 2), DelaySeriesPCA(ii, 3), SampleDelays(ii)); 
    end
    fprintf(fout, '%g', sum(latent(1:3))/sum(latent));%Variance explained
    fclose(fout);
end

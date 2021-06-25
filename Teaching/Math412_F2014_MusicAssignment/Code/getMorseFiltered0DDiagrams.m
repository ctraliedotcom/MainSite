function [ J ] = getMorseFiltered0DDiagrams( X )
    %Appproximately sample k uniformly spaced vectors on the
    %unit k-sphere
    %http://mathoverflow.net/questions/24688/efficiently-sampling-points-uniformly-from-the-surface-of-an-n-sphere
    N = size(X, 1);
    k = size(X, 2);
    U = randn(k, k);
    U = U./(repmat(sqrt(sum(U.*U, 1)), [k, 1]));
    J = [];

    for kk = 1:k
        filtDist = X*U(:, kk);
        %Start at the first point touched by the swept hyperplane
        filtDist = filtDist - min(filtDist(:));
        V1 = [(1:N)'; (1:N-1)'];
        V2 = [(1:N)'; (2:N)'];
        D = max(filtDist(V1), filtDist(V2));
        S = [V1 V2 D];
        [~, JNew] = rca1mfscm(S, max(D(:)) + 10);
        J = [J; JNew];
    end
end
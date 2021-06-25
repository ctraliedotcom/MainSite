function [X] = getPureTone(m, Fs, T)
    fBase = 440;
    fac = 2^(m/12);
    f = fBase*fac;
    t = 0:1/Fs:T;
    X = cos(2*pi*f*t);
end
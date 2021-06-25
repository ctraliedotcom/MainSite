function [ colorgradient ] = ColorMagGradient( filename )
im = imread(filename);
[Fx, Fy, MagGradR, EdgeOrient] = CannyGradient(im(:, :, 1), 1);
[Fx, Fy, MagGradG, EdgeOrient] = CannyGradient(im(:, :, 2), 1);
[Fx, Fy, MagGradB, EdgeOrient] = CannyGradient(im(:, :, 3), 1);
colorgradient = im;
maxR = max(max(MagGradR))
maxG = max(max(MagGradG)) 
maxB = max(max(MagGradB))
norm = max([maxR maxG maxB])
norm = 255.0/norm;
colorgradient(:, :, 1) = MagGradR*norm;
colorgradient(:, :, 2) = MagGradG*norm;
colorgradient(:, :, 3) = MagGradB*norm;
end
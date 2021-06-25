f = (1:1000).^1.5;
f = f/max(f)*4;
%g = sin(2*pi*0.01*((1:300)-15));
g = ((1:300) - 150)/300;
g = 1 - g.^2;
%subplot(1, 2, 1)
plot(f);
title('f')
title('Function f')
ylabel('Magnitude')
xlabel('Sample number')
%subplot(1, 2, 2)
plot(g)
title('Function g');
xlabel('Sample number');
ylabel('Magnitude');
h = f;
h(300:599) = g;
plot(h)
xlabel('Sample number');
ylabel('Magnitude');
title('"Pasting" g onto f');
deriv = 0.5*g(3:length(g)) - 0.5*g(1:length(g)-2);
A = diag(-1*ones(1, length(g)-1), -1) + diag(ones(1, length(g)-1), 1);
A(1, :) = [1 zeros(1, length(g)-1)];
A(30, :) = [zeros(1, length(g)-1) 1];
b = [f(300) deriv f(599)]';
subplot(4, 1, 1);
plot(g);
subplot(4, 1, 2);
plot(b);
g = inv(A)*b;
h(300:599) = g;
g(1)
g(300)
h(300)
h(599)
subplot(4, 1, 3);
plot(g)
subplot(4, 1, 4);
plot(h)
th = linspace(0, 2*pi, 13);
th = th(1:12);

notes = {'A', 'A^#/B^b', 'B', 'C', 'C^#/D^b', 'D', 'D^#/E^b', 'E', 'F', 'F^#/G^b', 'G', 'G^#/A^b'};

thfine = linspace(0, 2*pi, 200);
R1 = 1;
R2 = 1;
lag = 0.1;
offset = [0, 0];

clf;
plot(R1*sin(thfine), R1*cos(thfine), 'b');
hold on;
for ii = 1:length(th)
    Dot = [R1*sin(th(ii)) R1*cos(th(ii))];
    scatter(Dot(1), Dot(2), 100, 'fill', 'r');
    Pos = [R2*sin(th(ii)-lag) - offset(1) R2*cos(th(ii)-lag) - offset(2)];
    text(Pos(1), Pos(2), sprintf('%s (%i)', notes{ii}, ii-1));
end

axis equal;
axis square;
xlim([-R2-0.1, R2+0.1]);
ylim([-R2-0.1, R2+0.1]);
set(gca,'xtick',[])
set(gca,'xticklabel',[])
set(gca,'ytick',[])
set(gca,'yticklabel',[])
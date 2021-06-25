for ($i = 1; $i < 400; $i++) {
	`convert $i.bmp $i.jpg`;
	`del $i.bmp`;
}
function createButton(scene, x, y, label, onClick) {
  const width = 200;
  const height = 48;
  const button = scene.add.graphics({ x, y });

  button.fillStyle(0xFFD166, 1);
  button.fillRoundedRect(-width / 2, -height / 2, width, height, 6);
  button.setInteractive({
    hitArea: new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
    hitAreaCallback: Phaser.Geom.Rectangle.Contains,
    useHandCursor: true,
  });

  scene.add.text(x, y, label, {
    color: '#101820',
    fontFamily: 'system-ui, sans-serif',
    fontSize: '18px',
    fontStyle: 'bold',
  }).setOrigin(0.5);

  button.on('pointerup', onClick);
  return button;
}

new Phaser.Game({
  type: Phaser.AUTO,
  canvas: document.getElementById('game-canvas'),
  width: 960,
  height: 540,
  scene: [StartScene, PlayScene, ResultScene],
});

class ResultScene extends Phaser.Scene {
  constructor() {
    super('ResultScene');
  }

  init(data) {
    this.score = data.score ?? 0;
    this.bestScore = data.bestScore ?? this.registry.get('bestScore') ?? 0;
  }

  create() {
    this.cameras.main.setBackgroundColor('#101820');

    this.add.text(480, 180, 'Game Over', {
      color: '#FF5C5C',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '32px',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(480, 250, `점수: ${this.score}`, {
      color: '#D9E1E8',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '18px',
    }).setOrigin(0.5);

    this.add.text(480, 285, `최고 기록: ${this.bestScore}`, {
      color: '#D9E1E8',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '18px',
    }).setOrigin(0.5);

    createButton(this, 480, 390, '다시 하기', () => {
      this.scene.start('PlayScene');
    });
  }
}

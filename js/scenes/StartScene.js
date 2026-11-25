class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#101820');

    this.add.text(480, 180, '탑 정복자', {
      color: '#D9E1E8',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '32px',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    createButton(this, 480, 360, '시작하기', () => {
      this.scene.start('PlayScene');
    });

    this.add.text(480, 450, '왼쪽·오른쪽 방향키로 계단을 오르세요.', {
      color: '#D9E1E8',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px',
    }).setOrigin(0.5);
  }
}

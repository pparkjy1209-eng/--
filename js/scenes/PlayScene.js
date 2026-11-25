class PlayScene extends Phaser.Scene {
  constructor() {
    super('PlayScene');
  }

  init() {
    this.score = 0;
    this.bestScore = this.registry.get('bestScore') ?? 0;
    this.combo = 0;
    this.timeLimit = 1000;
    this.timeRemaining = this.timeLimit;
    this.timerStarted = false;
    this.isGameOver = false;
  }

  create() {
    this.cameras.main.setBackgroundColor('#101820');

    this.player = this.add.rectangle(480, 466, 32, 32, 0x58D6C5);
    this.stairs = [{ x: 480, y: 492 }];
    this.stairShapes = [];
    this.stairDirections = [];

    this.drawStair(this.stairs[0]);

    for (let index = 0; index < 6; index += 1) {
      this.addStair();
    }

    this.scoreText = this.add.text(32, 28, '점수: 0', this.getHudStyle());
    this.bestScoreText = this.add.text(180, 28, `최고 기록: ${this.bestScore}`, this.getHudStyle());
    this.comboText = this.add.text(390, 28, '콤보: 0', this.getHudStyle());

    this.add.rectangle(790, 40, 220, 14, 0xD9E1E8);
    this.timerBar = this.add.rectangle(680, 40, 220, 14, 0xFFD166)
      .setOrigin(0, 0.5);

    this.leftKeyHandler = (event) => {
      if (!event.repeat) {
        this.handleDirection(-1);
      }
    };
    this.rightKeyHandler = (event) => {
      if (!event.repeat) {
        this.handleDirection(1);
      }
    };
    this.input.keyboard.on('keydown-LEFT', this.leftKeyHandler);
    this.input.keyboard.on('keydown-RIGHT', this.rightKeyHandler);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.removeInputHandlers, this);
  }

  update(_time, delta) {
    if (!this.timerStarted || this.isGameOver) {
      return;
    }

    this.timeRemaining = Math.max(0, this.timeRemaining - delta);
    this.timerBar.displayWidth = (this.timeRemaining / this.timeLimit) * 220;

    if (this.timeRemaining === 0) {
      this.endGame();
    }
  }

  getHudStyle() {
    return {
      color: '#FFD166',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '18px',
    };
  }

  startTimer() {
    if (this.timerStarted) {
      return;
    }

    this.timerStarted = true;
  }

  handleDirection(direction) {
    if (this.isGameOver || this.scene.isPaused()) {
      return;
    }

    this.startTimer();

    if (direction !== this.stairDirections[0]) {
      this.endGame();
      return;
    }

    this.moveToNextStair();
    this.updateScore();
    this.resetTimer();
  }

  moveToNextStair() {
    const nextStair = this.stairs[1];

    this.player.setPosition(nextStair.x, nextStair.y - 26);
    this.stairs.shift();
    this.stairDirections.shift();
    this.stairShapes.shift().destroy();
    this.keepPlayerVisible();
    this.addStair();
  }

  keepPlayerVisible() {
    if (this.player.y >= 466) {
      return;
    }

    this.player.y += 48;

    this.stairs.forEach((stair, index) => {
      stair.y += 48;
      this.stairShapes[index].y += 48;
    });
  }

  updateScore() {
    this.score += 1;
    this.combo += 1;
    this.bestScore = Math.max(this.bestScore, this.score);
    this.registry.set('bestScore', this.bestScore);
    this.scoreText.setText(`점수: ${this.score}`);
    this.bestScoreText.setText(`최고 기록: ${this.bestScore}`);
    this.comboText.setText(`콤보: ${this.combo}`);
  }

  resetTimer() {
    this.timeLimit = Math.max(400, 1000 - (Math.floor(this.score / 10) * 100));
    this.timeRemaining = this.timeLimit;
    this.timerBar.displayWidth = 220;
  }

  drawStair(stair) {
    const stairShape = this.add.rectangle(stair.x, stair.y, 88, 20, 0xD9E1E8);

    this.stairShapes.push(stairShape);
  }

  addStair() {
    const previousStair = this.stairs[this.stairs.length - 1];
    const direction = this.getNextDirection(previousStair.x);
    const nextStair = {
      x: previousStair.x + (direction * 88),
      y: previousStair.y - 48,
    };

    this.stairDirections.push(direction);
    this.stairs.push(nextStair);
    this.drawStair(nextStair);
  }

  getNextDirection(previousX) {
    if (previousX <= 132) {
      return 1;
    }

    if (previousX >= 828) {
      return -1;
    }

    return Phaser.Math.Between(0, 1) === 0 ? -1 : 1;
  }

  endGame() {
    if (this.isGameOver) {
      return;
    }

    this.isGameOver = true;
    this.timerStarted = false;
    this.scene.start('ResultScene', {
      score: this.score,
      bestScore: this.bestScore,
    });
  }

  removeInputHandlers() {
    this.input.keyboard.off('keydown-LEFT', this.leftKeyHandler);
    this.input.keyboard.off('keydown-RIGHT', this.rightKeyHandler);
  }
}

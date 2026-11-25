(() => {
  let game = null;
  let isPaused = false;
  let pendingRingerSilent;

  function applyRingerSilent(ringerSilent) {
    if (typeof ringerSilent !== 'boolean') {
      return;
    }

    pendingRingerSilent = ringerSilent;

    if (game && game.sound) {
      game.sound.mute = ringerSilent;
    }
  }

  window.TowerConqueror = {
    start(options = {}) {
      applyRingerSilent(options.ringerSilent);

      if (game) {
        return;
      }

      game = new Phaser.Game({
        type: Phaser.CANVAS,
        canvas: document.getElementById('game-canvas'),
        width: 960,
        height: 540,
        scene: [StartScene, PlayScene, ResultScene],
        callbacks: {
          postBoot(bootedGame) {
            if (typeof pendingRingerSilent === 'boolean' && bootedGame.sound) {
              bootedGame.sound.mute = pendingRingerSilent;
            }

            if (isPaused) {
              window.TowerConqueror.pause();
            }
          },
        },
      });
    },

    pause() {
      if (isPaused) {
        return;
      }

      isPaused = true;

      if (!game) {
        return;
      }

      if (game.input && game.input.keyboard) {
        game.input.keyboard.enabled = false;
      }

      if (game.sound) {
        game.sound.pauseAll();
      }

      if (game.scene && game.scene.isActive('PlayScene')) {
        game.scene.pause('PlayScene');
      }

      game.pause();
    },

    resume(options = {}) {
      applyRingerSilent(options.ringerSilent);

      if (!isPaused) {
        return;
      }

      isPaused = false;

      if (!game) {
        return;
      }

      game.resume();

      if (game.scene && game.scene.isPaused('PlayScene')) {
        game.scene.resume('PlayScene');
      }

      if (game.sound) {
        game.sound.resumeAll();
      }

      if (game.input && game.input.keyboard) {
        game.input.keyboard.enabled = true;
      }
    },
  };

  document.addEventListener('DOMContentLoaded', () => {
    if (!window.__onestoreSdkBootStarted) {
      window.TowerConqueror.start();
    }
  }, { once: true });
})();

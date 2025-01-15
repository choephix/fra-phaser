import { Scene } from 'phaser';

export class SkillButton extends Phaser.GameObjects.Text {
  constructor(scene: Scene, x: number, y: number, skillId: string, icon: string) {
    super(scene, x, y, icon, {
      fill: '#Ff0',
      font: '10em Verdana',
    });

    this.setOrigin(0.5, 0.5);
    this.setInteractive({ useHandCursor: true });

    this.on('pointerdown', () => {
      (this.scene.game.input.events as Phaser.Events.EventEmitter).emit('skill', skillId);
    });
  }

  setState(state: 'available' | 'used') {
    this.scene.tweens.add({
      targets: this,
      // originY: state === 'used' ? -1.0 : 0.5,
      alpha: state === 'used' ? 0.5 : 1,
      scaleX: state === 'used' ? 0.8 : 1,
      scaleY: state === 'used' ? 0.8 : 1,
      duration: 175,
      onUpdate: () => {
        this.updateDisplayOrigin();
      },
    });
  }
}

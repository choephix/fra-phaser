import { App } from 'src/app';
import { SkillBook } from 'src/game/skills';
import { ControllerSprite } from 'src/view/ctrl-view';
import { SkillButton } from './skill-button';
import { GameEvent } from 'src/game/events';

export class UIScene extends Phaser.Scene {
  private tLevel: Phaser.GameObjects.Text;
  private tScore: ScoreText;
  private skillButtons: SkillButton[] = [];

  create() {
    let cam = this.cameras.main;

    this.tLevel = this.add.text(cam.centerX, cam.height * 0.07, '$');
    this.tLevel.setOrigin(0.5);
    this.tLevel.setFontSize(128);
    this.tLevel.setFontFamily('IMPACT');
    this.tLevel.setColor('white');
    this.tLevel.setStroke('#000B', 8);

    this.tScore = new ScoreText(this);
    this.tScore.setPosition(cam.centerX, cam.height * 0.17);
    this.tScore.setStroke('#000B', 8);
    this.tScore.setFontSize(48);
    this.tScore.setOrigin(0.5);
    this.tScore.setFontStyle('bold');
    this.game.events.on('score_change', (score: number) => this.tScore.setValue(score));

    const skills = SkillBook.makeSkillList();
    skills.forEach((skill, index) => {
      const x = (cam.width / (skills.length + 1)) * (1 + index);
      const y = cam.height - 100;

      const button = new SkillButton(this, x, y, index.toString(), skill.icon);
      this.add.existing(button);
      this.skillButtons.push(button);

      App.gameplay.events.on(GameEvent.ANY, () => {
        button.setState(App.gameplay.canUseSkill(skill) ? 'available' : 'used');
        button.alpha = App.gameplay.canUseSkill(skill) ? 1 : 0.5;
      });
    });

    new ControllerSprite(this, App.ctrl);

    this.tScore.text = window.devicePixelRatio.toString();
  }
}

class ScoreText extends Phaser.GameObjects.Text {
  private _value: number = 0;
  public get value(): number {
    return this._value;
  }
  public set value(v: number) {
    this._value = v;
    this.text = v > 0 ? Math.floor(v).toString() : 'O';
    // this.x = this.scene.cameras.main.centerX - this.width * .05
  }

  constructor(scene) {
    super(scene, 0, 0, '', { fill: 'white' });
    this.scene.add.existing(this);
    this.setValue(0);
  }

  setValue(value: number): void {
    this.scene.tweens.add({
      targets: this,
      value: value,
      duration: 330,
    });
  }
}

export class ContinueSplashScene extends Phaser.Scene {
  private title: Phaser.GameObjects.Text;
  preload() {
    console.log('win');
    let cam = this.cameras.main;
    this.title = this.add.text(cam.centerX, cam.centerY, 'NEXT', {});
    this.title.setOrigin(0.5);
    this.title.setFontSize(400);
    this.title.setFontFamily('IMPACT');
    this.title.setColor('white');
    this.title.setStroke('#000B', 12);
    this.title.setAlpha(0.0);

    this.events.on('wake', () => {
      this.tweens.add({
        targets: this.title,
        alpha: 1,
        scale: 1,
        delay: 1000,
        duration: 250,
      });
    });
  }
}

export class GameOverSplashScene extends Phaser.Scene {
  private title: Phaser.GameObjects.Text;
  preload() {
    console.log('sad');
    let cam = this.cameras.main;
    this.title = this.add.text(cam.centerX, cam.centerY, 'GAME\nOVER', {});
    this.title.setOrigin(0.5);
    this.title.setFontSize(400);
    this.title.setFontFamily('IMPACT');
    this.title.setColor('white');
    this.title.setStroke('#000B', 12);
    this.title.setRotation(-0.13);
    this.title.setAlpha(0.0);

    this.events.on('wake', () => {
      this.tweens.add({
        targets: this.title,
        alpha: 1,
        scale: 1,
        delay: 1000,
        duration: 250,
      });
    });
  }
}

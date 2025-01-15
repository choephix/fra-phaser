import { AbstractTouchController } from './ctrl';

export class ControllerSprite extends Phaser.GameObjects.Container {
  c1: Circle;
  c2: Circle;
  c3: Circle;

  constructor(
    scene,
    private ctrl: AbstractTouchController
  ) {
    super(scene);

    scene.add.existing(this);

    this.c1 = this.addCircle('c2');
    this.c2 = this.addCircle('c1');
    this.c3 = this.addCircle('c3').setScale(0.36);
    this.c3.max_alpha = 0.33;
  }

  addCircle(tex: string): Circle {
    let o = new Circle(this.scene, tex, 0);
    this.add(o);
    return o;
  }

  preUpdate() {
    if (this.ctrl.drag) {
      this.x = this.ctrl.drag.x1;
      this.y = this.ctrl.drag.y1;
    }

    this.c1.shown = this.ctrl.active;
    this.c2.shown = this.ctrl.active && !this.ctrl.indelay;
    this.c3.shown = this.ctrl.active && !this.ctrl.indelay;
    this.c1.rotation -= 0.02;
    this.c2.rotation += 0.01;
    this.c3.rotation -= 0.0025;
  }
}

class Circle extends Phaser.GameObjects.Image {
  public shown: boolean = false;
  public max_alpha: number = 1.0;

  constructor(
    scene,
    tex: string,
    private speed: number
  ) {
    super(scene, 0, 0, tex);
    scene.add.existing(this);
    this.setBlendMode(Phaser.BlendModes.ADD);
    this.setScale(0.2);
    this.setAlpha(0.0);
  }

  preUpdate() {
    if (this.shown && this.alpha < this.max_alpha) this.alpha += 0.2 * this.max_alpha;
    if (!this.shown && this.alpha > 0.0) this.alpha -= 0.1 * this.max_alpha;
  }
}

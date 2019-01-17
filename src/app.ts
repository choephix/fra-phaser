/// <reference path="./phaser.d.ts" />
// import './style.css';

import {Skill} from "./game/skills"
import {Game} from "./game/game"

export class App {
  start() {
    console.log(456,new Skill)

    let g = new Game(20,20,20,e=>console.warn(e))
    g.moveTo(g.getTile(1,1))
    g.moveTo(g.getTile(2,2))
    g.moveTo(g.getTile(3,3))
    console.log(g)
  }
}

class GameScene extends Phaser.Scene
{
  preload()
  {
    console.log(new Skill)

    this.load.image('circle', 'assets/circle4 glow.jpg');
    this.load.image('circle2', 'assets/rk.jpg');

    this.load.image('tile', 'assets/emoji/2b1c.png');
    this.load.image('bot', 'assets/emoji/1f989.png');

    this.load.spritesheet( 'gal', 'assets/xplo/explosion (2).png',
      { frameWidth: 128, frameHeight: 128, startFrame:0 }
    )

    this.load.spritesheet(
      'mummy', 'https://labs.phaser.io/assets/sprites/metalslug_mummy37x45.png',
      { frameWidth: 37, frameHeight: 45, endFrame: 17 }
    )
    this.load.image('sky', 'https://labs.phaser.io/assets/skies/lightblue.png');
    this.load.image('logo', 'https://labs.phaser.io/assets/sprites/phaser3-logo.png');
    this.load.image('red', 'https://labs.phaser.io/assets/particles/sparkle1.png');
  }

  geX(v:number) { return 128 + v * 65 }
  geY(v:number) { return 250 + v * 65 }

  create()
  {
    this.add.image(400, 300, 'sky');
    this.add.image(400, 100, 'logo');

    var container = this.add.container(200,200);

    let W = 9
    let H = 9

    for(let iy=0;iy<H;iy++)
      for(let ix=0;ix<W;ix++)
        this.add.sprite( this.geX(ix), this.geY(iy), "tile" ).setScale(.5)

    let ba = [[1,1],[2,3],[7,1],[7,2],[8,4],[5,7],[0,6]]
    for(let b of ba)
      this.add.sprite( this.geX(b[0]), this.geY(b[1]), "bot" ).setScale(.5)
    this.addParticles(this.geX(4),this.geY(4))

    let mummy = this.add.sprite(200, 200, 'mummy')
    this.anims.create({
        key: 'w',
        frames: this.anims.generateFrameNumbers('mummy',{}),
        frameRate: 12,
        repeat: -1
    })
    mummy.anims.load('w');
    mummy.anims.play('w');

    let c
    c = this.add.sprite(this.geX(4),this.geY(4), 'circle')
    c.blendMode = Phaser.BlendModes.ADD;
    c.setScale(.2)
    this.tweens.add({
        targets: c,
        rotation: -Math.PI*2,
        duration: 10000,
        repeat: -1
    });
    console.log(1,1,1,c)

    this.input.on("pointerdown",e=>this.boom(e.x,e.y))
    this.input.on("pointermove",e=>this.boom(e.x,e.y))
  }

  boom(x:number,y:number)
  {
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('gal',{}),
        frameRate: 20,
        repeat: 0
    })
    let walki = this.add.sprite(x, y, 'gal')
    walki.setRotation(2.0*Math.PI*Math.random())
    walki.anims.load('walk');
    walki.anims.play('walk');
    walki.on('animationcomplete', e=>walki.destroy(), this);
  }

  addParticles(x:number,y:number)
  {
    var particles = this.add.particles('red');
    var emitter = particles.createEmitter({ speed: 150, scale: { start: 1, end: 0 } });
    particles.x = x
    particles.y = y
    emitter.blendMode = Phaser.BlendModes.ADD
    emitter.setAlpha(.0175)
  }
}

var config:GameConfig = {
  title: "Furry Robots Attak",
  version: "0.2.0",
  type: Phaser.AUTO,
  parent: "phaser",
  backgroundColor: "#014",
  height: window.innerHeight,
  width: window.innerHeight*3/4,
  // width: window.innerHeight*9/16,
  // width: window.innerWidth,
  zoom: 1,
  scene: new GameScene({})
}
var game:Phaser.Game = new Phaser.Game(config);

console.log(game)
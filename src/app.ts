/// <reference path="../def/phaser.d.ts" />
// import './style.css';

class GameScene extends Phaser.Scene
{
  preload() 
  {
    this.load.image('dumoria', 'https://c.staticblitz.com/assets/client/icons/ui/blue-lightning-b6f0711fda280ec6bd873c9391fc89c4.png');
    
    this.load.image('circle', 'http://localhost:8111/assets/circle4 glow.jpg');
    this.load.image('circle2', 'http://localhost:8111/assets/rk.jpg');

    this.load.image('tile', 'http://localhost:8111/assets/emoji/2b1c.png');
    this.load.image('bot', 'http://localhost:8111/assets/emoji/1f989.png');

    this.load.spritesheet(
      'gal',
      'http://localhost:8111/assets/xplo/explosion (2).png',
      { frameWidth: 128, frameHeight: 128, startFrame:0 }
    )

    this.load.setBaseURL('http://labs.phaser.io');
    this.load.spritesheet(
      'mummy',
      'assets/sprites/metalslug_mummy37x45.png',
      { frameWidth: 37, frameHeight: 45, endFrame: 4 }
    )
    this.load.image('sky', 'assets/skies/lightblue.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('red', 'assets/particles/sparkle1.png');

  }

  geX(v:number) { return 128 + v * 65 }
  geY(v:number) { return 250 + v * 65 }

  create() 
  {
    this.add.image(400, 300, 'sky');
    this.add.sprite(500, 500, 'dumoria').blendMode = Phaser.BlendModes.ADD;

    var container = this.add.container(200,200);

    let W = 9
    let H = 9

    for(let iy=0;iy<H;iy++)
      for(let ix=0;ix<W;ix++)
        this.add.sprite( this.geX(ix), this.geY(iy), "tile" ).setScale(.5)

    let ba = [[1,1],[2,3],[7,1],[7,2],[5,7],[0,6]]
    for(let b of ba)
      this.add.sprite( this.geX(b[0]), this.geY(b[1]), "bot" ).setScale(.5)
    this.addParticles(this.geX(4),this.geY(4))

    // let gun = this.add.sprite(200, 200, 'cocksheet')
    // this.anims.create({
    //     key: 'cock',
    //     frames: this.anims.generateFrameNumbers('cocksheet',{}),
    //     frameRate: 12,
    //     repeat: -1
    // })
    // gun.anims.load('cock');
    // gun.anims.play('cock');

    let walki = this.add.sprite(200, 400, 'gal')
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('gal',{}),
        frameRate: 30,
        repeat: -1
    })
    walki.anims.load('walk');
    walki.anims.play('walk');

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

    this.add.image(400, 100, 'logo');
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

function test():void
{
  alert("ouch!")
}
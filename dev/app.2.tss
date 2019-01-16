/// <reference path="../def/phaser.d.ts" />
// import './style.css';

class GameScene1 extends Phaser.Scene
{
  preload() 
  {
    this.load.image('dumoria', 'https://c.staticblitz.com/assets/client/icons/ui/blue-lightning-b6f0711fda280ec6bd873c9391fc89c4.png');
    
    this.load.image('circle', 'http://localhost:8111/assets/circle4 glow.jpg');

    this.load.spritesheet(
      'cocksheet',
      'https://i.imgur.com/circle4 glow.png',
      { frameWidth: 280, frameHeight: 160, endFrame: 4 }
    )
    
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
    this.load.image('red', 'assets/particles/red.png');

  }

  create() 
  {
    this.add.image(400, 300, 'sky');
    this.add.sprite(500, 500, 'dumoria').blendMode = Phaser.BlendModes.ADD;
    this.add.sprite(500,500, 'circle').blendMode = Phaser.BlendModes.ADD;

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

    var particles = this.add.particles('red');
    var emitter = particles.createEmitter({ speed: 100, scale: { start: 1, end: 0 } });
    particles.x = 300
    particles.y = 300
    emitter.blendMode = Phaser.BlendModes.SCREEN

    var logo = this.add.image(400, 100, 'logo');

    emitter.startFollow(logo);
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
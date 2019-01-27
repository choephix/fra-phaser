/// <reference path="phaser.d.ts" />

import { GameWorld } from "./view/game-world";

export class App 
{
  game: Phaser.Game

  config: GameConfig = {
    title: "Furry Robots Attak",
    version: "0.2.0",
    type: Phaser.AUTO,
    parent: "phaser",
    backgroundColor: "#014",
    width: getDimensions().w,
    height: getDimensions().h,
    resolution: 1.0,
    zoom: 1,
    fps: {},
  }

  start() 
  {
    this.game = new Phaser.Game( this.config )
    this.game.scene.add( 'scene-boot', BootScene, true );
    // this.game.scene.add( 'scene-bg', BackgroundScene, true );
    // phaser.scene.start( 'boot', { b: 1234 } )

    let dimensions = getDimensions()
    let w = dimensions.w
    let h = dimensions.h
    this.game.resize( w, h )
  }
}

class BootScene extends Phaser.Scene
{
  preload()
  {
    let style = {
      fill: "white",
      font: "4.5em Verdana",
      stroke: "#000B",
      strokeThickness: "4",
      textAnchor: "middle",
      dominantBaseline: "middle",
    }
    this.add.text( this.cameras.main.width * .125, 
                   this.cameras.main.height * .90, 
                   "loading...", style )
                  //  .setOrigin( .05, .05 )

    this.load.setBaseURL( "assets/" )

    this.load.image( "sky", "sky-checkers.jpg" )
    this.load.image( 'logo', 'logo.png' )

    this.load.image( 'c1', 'c (1).jpg' )
    this.load.image( 'c2', 'c (2).jpg' )
    this.load.image( 'c3', 'c (3).png' )

    this.load.image( "wave", "wave.png" )
    this.load.spritesheet( 'boom', 'xplo/explosion (2).png', { frameWidth: 128, frameHeight: 128 } )

    this.load.image( 'tile', 'tile3.png' )
    this.load.spritesheet( 'sheet_b', 'fra.png', { frameWidth: 769, frameHeight: 500 } )
  }

  create()
  {
    this.game.scene.add( 'scene-bg', BackgroundScene, true );
    this.game.scene.add( 'scene-world', GameWorldScene, true );
    this.game.scene.add( 'scene-ui', UIScene, true );
    this.game.scene.remove(this)
  }
}

class UIScene extends Phaser.Scene
{
  title: Phaser.GameObjects.Image

  create()
  {
    let dimensions = getDimensions()
    let w = dimensions.w
    let h = dimensions.h
    this.title = this.add.image(0, 0, "logo")
    this.title.x = w * 0.50
    this.title.y = h * 0.08
  }
}

class GameWorldScene extends Phaser.Scene
{
  world: GameWorld

  create_animations()
  {
    this.anims.create( {
      key: "xplode",
      frames: this.anims.generateFrameNumbers( "boom", {} ),
      frameRate: 30,
    } )

    this.anims.create( {
      key: "player-idle", repeat: -1, frameRate: 10,
      frames: this.anims.generateFrameNumbers( "sheet_b", { start: 0, end: 3 } ),
    } )
    this.anims.create( {
      key: "player-fall", repeat: 0, frameRate: 30,
      frames: this.anims.generateFrameNumbers( "sheet_b", { start: 0, end: 11 } ),
    } )
    this.anims.create( {
      key: "bot-idle", repeat: -1, frameRate: 10,
      frames: this.anims.generateFrameNumbers( "sheet_b", { start: 16, end: 19 } ),
    } )
    this.anims.create( {
      key: "bot-fall", repeat: 0, frameRate: 20,
      frames: this.anims.generateFrameNumbers( "sheet_b", { start: 20, end: 29 } ),
    } )
    this.anims.create( {
      key: "bot-freeze", repeat: 0, frameRate: 20,
      frames: this.anims.generateFrameNumbers( "sheet_b", { start: 31, end: 38 } ),
    } )
    this.anims.create( {
      key: "decoy", repeat: -1, frameRate: 10,
      frames: this.anims.generateFrameNumbers( "sheet_b", { start: 12, end: 14 } ),
    } )
  }

  create()
  {
    this.create_animations()

    let dimensions = getDimensions()
    let w = dimensions.w
    let h = dimensions.h

    this.world = new GameWorld( this, getDimensions().w, getDimensions().h, 0.5 * w, 0.50 * h )

    // this.time.timeScale =
    // this.tweens.timeScale =
    // this.anims.globalTimeScale = .333
  }
}

class BackgroundScene extends Phaser.Scene
{
  sky: Phaser.GameObjects.Image

  create()
  {
    let dimensions = getDimensions()
    let w = dimensions.w
    let h = dimensions.h
    this.sky = this.add.image( 0, 0, "sky" )
    this.sky.setOrigin( 0, 0 )
    this.sky.setDisplaySize( w, h )
  }
}

function getDimensions()
{ 
  return { h: window.innerHeight, w: Math.min(window.innerWidth, window.innerHeight * 0.75) }
}

// function* test() {
//   let i = -10
//   while(i<10)
//     yield ++i;
// }
// for ( let ii of test() )
//   console.log(ii)

import { UIScene } from "./scenes/ui";
import { AbstractTouchController } from "./view/ctrl";
import { GameWorld } from "./view/game-world";
import { GameSession } from "./game/game-session";

export class App 
{
  static phaser_game: Phaser.Game
  static gameplay:GameSession
  static ctrl: AbstractTouchController

  config: GameConfig = {
    title: "Furry Robots Attak",
    version: "0.2.98",
    type: Phaser.AUTO,
    parent: "phaser",
    backgroundColor: "#014",
    resolution: window.devicePixelRatio,
    // zoom: 1/window.devicePixelRatio,
  }

  start() 
  {
    let dimensions = this.getDimensions()
    let w = dimensions.w
    let h = dimensions.h
    App.phaser_game = new Phaser.Game( this.config )
    App.phaser_game.resize( w, h )
    App.phaser_game.events.once( 'assets-loaded', () => this.onAssetsLoaded() )
    App.phaser_game.scene.add( 'boot', BootScene );
    App.phaser_game.scene.start( 'boot', { } )
  }

  onAssetsLoaded()
  {
    App.gameplay = new GameSession
    App.ctrl = new AbstractTouchController(
      ( x, y ) => App.phaser_game.input.events.emit( "move", x, y ) )

    App.phaser_game.scene.add( 'bg', BackgroundScene, true );
    App.phaser_game.scene.add( 'world', GameWorldScene, true );
    App.phaser_game.scene.add( 'ui', UIScene, true );
  }

  getDimensions()
  {
    return { 
      h: window.innerHeight, 
      w: Math.min( window.innerWidth, window.innerHeight * 0.75 ) 
    }
  }
}

class BootScene extends Phaser.Scene
{
  preload()
  {
    let style = {
      fill: "white", 
      fontSize: "3vw",
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
    App.phaser_game.events.emit('assets-loaded')
    this.game.scene.remove(this)
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

    let cam = this.cameras.main
    this.world = new GameWorld( this, cam.width, cam.height, cam.centerX, cam.centerY )

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
    let cam = this.cameras.main
    this.sky = this.add.image( 0, 0, "sky" )
    this.sky.setOrigin( 0, 0 )
    this.sky.setDisplaySize( cam.width, cam.height )
  }
}

// function* test() {
//   let i = -10
//   while(i<10)
//     yield ++i;
// }
// for ( let ii of test() )
//   console.log(ii)

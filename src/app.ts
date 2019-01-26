/// <reference path="phaser.d.ts" />

import { GameWorld } from "./view/game-world";

export class App 
{
  start() 
  {
    phaser = new Phaser.Game(config)
    phaser.scene.start('boot',{b:1234})
  }
}

var phaser:Phaser.Game

const config: GameConfig = {
  title: "Furry Robots Attak",
  version: "0.2.0",
  type: Phaser.AUTO,
  parent: "phaser",
  backgroundColor: "#014",
  width: getDimensions().w,
  height: getDimensions().h,
  resolution: 1.0,
  zoom: 1,
  scene: { init : console.log, preload: preload, create: create, update : update },
  fps: {},
}

let sky:Phaser.GameObjects.Image
let title:Phaser.GameObjects.Image
let world: GameWorld

function preload()
{
  this.load.image( 'logo', 'https://labs.phaser.io/assets/sprites/phaser3-logo.png' )
  this.load.image( "sky", "assets/sky-checkers.jpg" )
  this.load.image( 'tile', 'assets/tile3.png' )
  this.load.image( "bot", "assets/emoji/1f989.png" )
  this.load.spritesheet( "player2", "assets/SaraFullSheet.png", { 
    frameWidth: 64, frameHeight: 64, margin:0, spacing:0, startFrame:26, endframe: 8 } )
  this.load.spritesheet( "player", "assets/pikachu.png", { frameWidth: 154, frameHeight: 158, margin:0, spacing:0 } )
  this.load.spritesheet( 'boom', 'assets/xplo/explosion (2).png', { frameWidth: 128, frameHeight: 128 } )
  this.load.image( "wave", "assets/wave.png" )
  this.load.image( 'circle', 'assets/circle-1.jpg' )
  this.load.image( 'c1', 'assets/c (1).jpg' )
  this.load.image( 'c2', 'assets/c (2).jpg' )
  this.load.image( 'c3', 'assets/c (3).png' )
  this.load.spritesheet( 'sheet_b', 'assets/fra.png', { frameWidth: 769, frameHeight: 500 } )
}

function create_animations()
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
    key: "bot-freeze", repeat: 0, frameRate: 10,
    frames: this.anims.generateFrameNumbers( "sheet_b", { start: 31, end: 38 } ),
  } )
}

function create()
{
  create_animations.apply(this, [])

  sky = this.add.image(0, 0, "sky")
  sky.setOrigin(0, 0)

  title = this.add.image(0, 0, "logo")

  let dimensions = getDimensions()
  let w = dimensions.w,
    h = dimensions.h
  phaser.resize(w, h)
  sky.setDisplaySize(w, h)
  title.x = w * 0.5
  title.y = h * 0.1

  world = new GameWorld( this, getDimensions().w, getDimensions().h, 0.5 * w, 0.50 * h )

  // let o = this.add.sprite( .5*w, .5*h, "sheet_b" )
  // o.anims.load("player-idle")
  // o.anims.play("player-idle")
}

function update()
{
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

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
  this.load.setBaseURL("assets/")
  this.load.image( 'logo', 'logo.png' )
  this.load.image( "sky", "sky-checkers.jpg" )
  this.load.image( 'c1', 'c (1).jpg' )
  this.load.image( 'c2', 'c (2).jpg' )
  this.load.image( 'c3', 'c (3).png' )
  
  this.load.image( "wave", "wave.png" )
  this.load.spritesheet( 'boom', 'xplo/explosion (2).png', { frameWidth: 128, frameHeight: 128 } )
  
  this.load.image( 'tile', 'tile3.png' )
  this.load.spritesheet( 'sheet_b', 'fra.png', { frameWidth: 769, frameHeight: 500 } )
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
    key: "bot-freeze", repeat: 0, frameRate: 20,
    frames: this.anims.generateFrameNumbers( "sheet_b", { start: 31, end: 38 } ),
  } )
  this.anims.create( {
    key: "decoy", repeat: -1, frameRate: 10,
    frames: this.anims.generateFrameNumbers( "sheet_b", { start: 12, end: 14 } ),
  } )
}

function create()
{
  create_animations.apply(this, [])
  
  
  let dimensions = getDimensions()
  let w = dimensions.w,
  h = dimensions.h
  phaser.resize(w, h)
  
  sky = this.add.image(0, 0, "sky")
  sky.setOrigin(0, 0)
  sky.setDisplaySize(w, h)

  title = this.add.image(0, 0, "logo")
  title.x = w * 0.50
  title.y = h * 0.08

  world = new GameWorld( this, getDimensions().w, getDimensions().h, 0.5 * w, 0.50 * h )
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

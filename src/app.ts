/// <reference path="phaser.d.ts" />

import {TestGameScene} from "test.scene"
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
  resolution: 1,
  zoom: 1,
  scene: { init : console.log, preload: preload, create: create, update : update },
  // scene: new TestGameScene({}),
}

let sky:Phaser.GameObjects.Image
let title:Phaser.GameObjects.Image
let world: GameWorld

function preload()
{
  this.load.image( 'logo', 'https://labs.phaser.io/assets/sprites/phaser3-logo.png' )
  this.load.image( "sky", "assets/sky-checkers.jpg" )
  this.load.image( 'tile', 'assets/emoji/2b1c.png' )
  this.load.image( "bot", "assets/emoji/1f989.png" )
  this.load.spritesheet( "player2", "assets/SaraFullSheet.png", { 
    frameWidth: 64, frameHeight: 64, margin:0, spacing:0, startFrame:26, endframe: 8 } )
  this.load.spritesheet( "player", "assets/pikachu.png", { frameWidth: 154, frameHeight: 158, margin:0, spacing:0 } )
  this.load.spritesheet( 'boom', 'assets/xplo/explosion (2).png', { frameWidth: 128, frameHeight: 128 } )
  this.load.image( "wave", "assets/wave.png" )
  this.load.image( 'circle', 'assets/circle-1.jpg' )
}

function create()
{
  this.anims.create( {
    key: "player-idle",
    frames: this.anims.generateFrameNumbers( "player", {} ),
    frameRate: 10,
    repeat: -1
  } )
  this.anims.create( {
    key: "xplode",
    frames: this.anims.generateFrameNumbers( "boom", {} ),
    frameRate: 30,
  } )

  sky = this.add.image(0, 0, "sky")
  sky.setOrigin(0, 0)

  title = this.add.image(0, 0, "logo")

  let dimensions = getDimensions()
  let w = dimensions.w,
    h = dimensions.h
  phaser.resize(w, h)
  sky.setDisplaySize(w, h)
  title.x = w * 0.5
  title.y = 160

  world = new GameWorld(this, 0.5 * w, 0.55 * h)

  // this.input.on( "pointerdown", (e,o) => boom( e.x, e.y ) )
  // this.input.on( "pointermove", (e,o) => boom( e.x, e.y ) )
  let scene = this
  function boom( x: number, y: number )
  {
    let boom = scene.add.sprite(x, y, "boom")
    boom.setRotation( 2.0 * Math.PI * Math.random() )
    boom.anims.load( "xplode" )
    boom.anims.play( "xplode" )
    boom.setTint("#369")
    boom.on( 'animationcomplete', () => boom.destroy() );
  }
}

function update()
{
}

function getDimensions()
{ 
  return { h: window.innerHeight, w: Math.min(window.innerWidth, window.innerHeight * 0.75) }
}

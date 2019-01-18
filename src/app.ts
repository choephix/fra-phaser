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
  zoom: 1,
  scene: { init : console.log, preload: preload, create: create, update : update },
  // scene: new TestGameScene({}),
}

let sky:Phaser.GameObjects.Image
let title:Phaser.GameObjects.Image
let world: GameWorld

function preload()
{
  this.load.image( "sky", "assets/sky-checkers.jpg" )
  this.load.image( 'logo', 'https://labs.phaser.io/assets/sprites/phaser3-logo.png' )
  this.load.image( 'tile', 'assets/emoji/2b1c.png' )
  this.load.image( 'bot', 'assets/emoji/1f989.png' )
  this.load.image( 'circle', 'assets/circle4 glow.jpg' )
  this.load.spritesheet( 'boom', 'assets/xplo/explosion (2).png', { frameWidth: 128, frameHeight: 128 } )
}

function create() {
  this.anims.create({
    key: "xplode",
    frames: this.anims.generateFrameNumbers("boom", {}),
    frameRate: 30,
  })

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
  world.initialize()

  this.input.on( "pointerdown", (e,o) => boom( e.x, e.y ) )
  // this.input.on( "pointermove", (e,o) => boom( e.x, e.y ) )
  let scene = this
  function boom( x: number, y: number )
  {
    let boom = scene.add.sprite(x, y, "boom")
    boom.setRotation( 2.0 * Math.PI * Math.random() )
    boom.anims.load( "xplode" )
    boom.anims.play( "xplode" )
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

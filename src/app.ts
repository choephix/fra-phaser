/// <reference path="phaser.d.ts" />

import {TestGameScene} from "test.scene"
import { GameWorld } from "./view/game-world";

export class App 
{
  start() 
  {
    phaser = new Phaser.Game(config)
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
  scene: { preload: preload, create: create, update : update },
  // scene: new TestGameScene({}),
}

let sky:Phaser.GameObjects.Image
let title:Phaser.GameObjects.Image
let world:GameWorld

function preload()
{
  this.load.image( "sky", "assets/sky-checkers.jpg" )
  this.load.image( 'logo', 'https://labs.phaser.io/assets/sprites/phaser3-logo.png' )
  this.load.image( 'tile', 'assets/emoji/2b1c.png' )
  this.load.image( 'bot', 'assets/emoji/1f989.png' )
  this.load.image( 'circle', 'assets/circle4 glow.jpg' );
}

function create()
{
  sky = this.add.image(0, 0, 'sky')
  sky.setOrigin(0,0)
  
  title = this.add.image(0, 0, 'logo')

  let dimensions = getDimensions()
  let w = dimensions.w, h = dimensions.h
  phaser.resize(w, h)
  sky.setDisplaySize(w, h)
  title.x = w * .5
  title.y = 160

  world = new GameWorld( this, .5*w, .5*h )
  world.initialize()
}

function update()
{
}

function getDimensions()
{ 
  return { h: window.innerHeight, w: Math.min(window.innerWidth, window.innerHeight * 0.75) }
}

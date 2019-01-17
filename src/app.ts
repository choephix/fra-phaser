/// <reference path="phaser.d.ts" />

import {Skill} from "./game/skills"
import {Game} from "./game/game"
import {TestGameScene} from "test.scene"

export class App 
{
  start() 
  {
    phaser = new Phaser.Game(config);
    // window.addEventListener('resize', () => onresize());
  }
}

var phaser:Phaser.Game

const config:GameConfig = {
  title: "Furry Robots Attak",
  version: "0.2.0",
  type: Phaser.CANVAS,
  parent: "phaser",
  backgroundColor: "#014",
  height: window.innerHeight,
  width: window.innerWidth,
  zoom: 1,
  scene: {preload:preload,create:create},
  // scene: new TestGameScene({}),  
}

let sky:Phaser.GameObjects.Image
let title:Phaser.GameObjects.Image

function preload()
{
  this.load.image('sky', 'assets/bg.jpg');
  this.load.image('logo', 'https://labs.phaser.io/assets/sprites/phaser3-logo.png');
  this.load.image('tile', 'assets/emoji/2b1c.png');
  this.load.image('bot', 'assets/emoji/1f989.png');
}

function create()
{
  sky = this.add.image(0, 0, 'sky');
  sky.setOrigin(0,0)
  
  title = this.add.image(0, 0, 'logo');

  this.gameScale.setMode('resize');
  onresize()
}

function onresize()
{
  phaser.resize( window.innerWidth, window.innerHeight );
  phaser.scene.resize( window.innerWidth, window.innerHeight )
  sky.setDisplaySize( window.innerWidth, window.innerHeight )
  title.x = window.innerWidth * .5
  title.y = 200
}
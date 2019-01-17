/// <reference path="./phaser.d.ts" />
// import Phaser = require('../def/phaser')
// import * as Phaser from 'phaser';
import {Skill} from "./game/skills"
import * as Phaser from 'phaser'

// declare var Phaser: any;
console.log(Phaser)

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
  scene: {
    preload()
    {
      this.load.image('sky', 'https://labs.phaser.io/assets/skies/lightblue.png');
      console.log( new Skill )
    },  
    create()
    {
      this.add.image(400, 300, 'sky');
    }
  }
}
var game:Phaser.Game = new Phaser.Game(config);
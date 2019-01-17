/// <reference path="./phaser.d.ts" />
// import './style.css';

import {Skill} from "./game/skills"
import {Game} from "./game/game"
import {TestGameScene} from "test.scene"

export class App {
  start() {
    console.log(456,new Skill)
    let g = new Game(20,20,20,e=>console.warn(e))
    g.moveTo(g.getTile(1,1))
    g.moveTo(g.getTile(2,2))
    g.moveTo(g.getTile(3,3))
    console.log(g)
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
  scene: new TestGameScene({})
}
var game:Phaser.Game = new Phaser.Game(config);

console.log(game)
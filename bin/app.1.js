"use strict";
/// <reference path="../def/phaser.d.ts" />
// import './style.css';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GameScene1 = /** @class */ (function (_super) {
    __extends(GameScene1, _super);
    function GameScene1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GameScene1.prototype.preload = function () {
        this.load.image('dumoria', 'https://c.staticblitz.com/assets/client/icons/ui/blue-lightning-b6f0711fda280ec6bd873c9391fc89c4.png');
        this.load.image('circle', 'http://localhost:8111/assets/circle4 glow.jpg');
        this.load.spritesheet('cocksheet', 'https://i.imgur.com/circle4 glow.png', { frameWidth: 280, frameHeight: 160, endFrame: 4 });
        this.load.spritesheet('gal', 'http://localhost:8111/assets/xplo/explosion (2).png', { frameWidth: 128, frameHeight: 128, startFrame: 0 });
        this.load.setBaseURL('http://labs.phaser.io');
        this.load.spritesheet('mummy', 'assets/sprites/metalslug_mummy37x45.png', { frameWidth: 37, frameHeight: 45, endFrame: 4 });
        this.load.image('sky', 'assets/skies/lightblue.png');
        this.load.image('logo', 'assets/sprites/phaser3-logo.png');
        this.load.image('red', 'assets/particles/red.png');
    };
    GameScene1.prototype.create = function () {
        this.add.image(400, 300, 'sky');
        this.add.sprite(500, 500, 'dumoria').blendMode = Phaser.BlendModes.ADD;
        this.add.sprite(500, 500, 'circle').blendMode = Phaser.BlendModes.ADD;
        // let gun = this.add.sprite(200, 200, 'cocksheet')
        // this.anims.create({
        //     key: 'cock',
        //     frames: this.anims.generateFrameNumbers('cocksheet',{}),
        //     frameRate: 12,
        //     repeat: -1
        // })
        // gun.anims.load('cock');
        // gun.anims.play('cock');
        var walki = this.add.sprite(200, 400, 'gal');
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('gal', {}),
            frameRate: 30,
            repeat: -1
        });
        walki.anims.load('walk');
        walki.anims.play('walk');
        var particles = this.add.particles('red');
        var emitter = particles.createEmitter({ speed: 100, scale: { start: 1, end: 0 } });
        particles.x = 300;
        particles.y = 300;
        emitter.blendMode = Phaser.BlendModes.SCREEN;
        var logo = this.add.image(400, 100, 'logo');
        emitter.startFollow(logo);
    };
    return GameScene1;
}(Phaser.Scene));
var config = {
    title: "Furry Robots Attak",
    version: "0.2.0",
    type: Phaser.AUTO,
    parent: "phaser",
    backgroundColor: "#014",
    height: window.innerHeight,
    width: window.innerHeight * 3 / 4,
    // width: window.innerHeight*9/16,
    // width: window.innerWidth,
    zoom: 1,
    scene: new GameScene({})
};
var game = new Phaser.Game(config);
function test() {
    alert("ouch!");
}

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
var GameScene = /** @class */ (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GameScene.prototype.preload = function () {
        this.load.image('dumoria', 'https://c.staticblitz.com/assets/client/icons/ui/blue-lightning-b6f0711fda280ec6bd873c9391fc89c4.png');
        this.load.image('circle', 'http://localhost:8111/assets/circle4 glow.jpg');
        this.load.image('circle2', 'http://localhost:8111/assets/rk.jpg');
        this.load.image('tile', 'http://localhost:8111/assets/emoji/2b1c.png');
        this.load.image('bot', 'http://localhost:8111/assets/emoji/1f989.png');
        this.load.spritesheet('gal', 'http://localhost:8111/assets/xplo/explosion (2).png', { frameWidth: 128, frameHeight: 128, startFrame: 0 });
        this.load.setBaseURL('http://labs.phaser.io');
        this.load.spritesheet('mummy', 'assets/sprites/metalslug_mummy37x45.png', { frameWidth: 37, frameHeight: 45, endFrame: 4 });
        this.load.image('sky', 'assets/skies/lightblue.png');
        this.load.image('logo', 'assets/sprites/phaser3-logo.png');
        this.load.image('red', 'assets/particles/sparkle1.png');
    };
    GameScene.prototype.geX = function (v) { return 128 + v * 65; };
    GameScene.prototype.geY = function (v) { return 250 + v * 65; };
    GameScene.prototype.create = function () {
        this.add.image(400, 300, 'sky');
        this.add.sprite(500, 500, 'dumoria').blendMode = Phaser.BlendModes.ADD;
        var container = this.add.container(200, 200);
        var W = 9;
        var H = 9;
        for (var iy = 0; iy < H; iy++)
            for (var ix = 0; ix < W; ix++)
                this.add.sprite(this.geX(ix), this.geY(iy), "tile").setScale(.5);
        var ba = [[1, 1], [2, 3], [7, 1], [7, 2], [5, 7], [0, 6]];
        for (var _i = 0, ba_1 = ba; _i < ba_1.length; _i++) {
            var b = ba_1[_i];
            this.add.sprite(this.geX(b[0]), this.geY(b[1]), "bot").setScale(.5);
        }
        this.addParticles(this.geX(4), this.geY(4));
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
        var c;
        c = this.add.sprite(this.geX(4), this.geY(4), 'circle');
        c.blendMode = Phaser.BlendModes.ADD;
        c.setScale(.2);
        this.tweens.add({
            targets: c,
            rotation: -Math.PI * 2,
            duration: 10000,
            repeat: -1
        });
        this.add.image(400, 100, 'logo');
    };
    GameScene.prototype.addParticles = function (x, y) {
        var particles = this.add.particles('red');
        var emitter = particles.createEmitter({ speed: 150, scale: { start: 1, end: 0 } });
        particles.x = x;
        particles.y = y;
        emitter.blendMode = Phaser.BlendModes.ADD;
        emitter.setAlpha(.0175);
    };
    return GameScene;
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

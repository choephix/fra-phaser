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
define("game/game", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Game = /** @class */ (function () {
        function Game(W, H, BOTS, raiseEvent) {
            this.W = W;
            this.H = H;
            this.BOTS = BOTS;
            this.raiseEvent = raiseEvent;
            this.tiles = [];
            this.bots = [];
            this.player = null;
            this.frozenTurns = 0;
            this.invulnerableTurns = 0;
            this.auto = false;
            for (var ix = 0; ix < W; ix++)
                for (var iy = 0; iy < H; iy++)
                    this.tiles.push(new Tile(ix, iy));
            var pti = H * Math.floor(.5 * W) + Math.floor(.5 * H);
            var pt = this.tiles[pti];
            this.player = new Player(pt);
            this.bots = [];
            var tiles = this.tiles.filter(function (t) {
                return (t.x > pt.x + 1 || t.x < pt.x - 1)
                    && (t.y > pt.y + 1 || t.y < pt.y - 1);
            });
            for (var ib = 0; ib < BOTS; ib++) {
                if (tiles.length < 1)
                    break;
                var it = Math.floor(tiles.length * Math.random());
                this.bots.push(new Bot(tiles[it]));
                tiles.splice(it, 1);
            }
            this.decoy = new Decoy(pt);
        }
        Object.defineProperty(Game.prototype, "victory", {
            get: function () { return !this.player.dead; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "aliveBots", {
            get: function () { return this.bots.filter(function (bot) { return !bot.dead; }); },
            enumerable: true,
            configurable: true
        });
        Game.prototype.runAuto = function () {
            var _this = this;
            this.auto = true;
            var interval = setInterval(function () {
                if (!_this.over) {
                    _this.endTurn();
                }
                else {
                    console.log("-- end-tick --");
                    clearInterval(interval);
                    _this.auto = false;
                }
            }, 200);
        };
        Game.prototype.moveTo = function (playerTile) {
            var p = this.player;
            p.tile = playerTile ? playerTile : p.tile;
            if (!this.decoy.active)
                this.decoy.tile = p.tile;
        };
        Game.prototype.endTurn = function () {
            var p = this.player;
            var bx, by, t;
            for (var _i = 0, _a = this.bots; _i < _a.length; _i++) {
                var bot = _a[_i];
                if (!this.canMove(bot))
                    continue;
                bx = bot.tile.x;
                by = bot.tile.y;
                t = this.decoy ? this.decoy.tile : p.tile;
                if (t.x > bx)
                    bx++;
                if (t.x < bx)
                    bx--;
                if (t.y > by)
                    by++;
                if (t.y < by)
                    by--;
                bot.tile = this.getTile(bx, by);
            }
            this.recheck();
            /// Clear
            if (!this.over) {
                if (this.frozenTurns > 0)
                    this.frozenTurns--;
                if (this.invulnerableTurns > 0)
                    this.invulnerableTurns--;
                for (var _b = 0, _c = this.bots; _b < _c.length; _b++) {
                    var bot = _c[_b];
                    bot.stunned = false;
                }
                this.raiseEvent("move");
            }
        };
        Game.prototype.recheck = function () {
            var p = this.player;
            var d = this.decoy;
            for (var _i = 0, _a = this.tiles; _i < _a.length; _i++) {
                var tile = _a[_i];
                var bots = this.getBotsOn(tile);
                var bust = bots.length > 1
                    || (bots.length > 0 && tile === p.tile)
                    || (bots.length > 0 && tile === d.tile);
                if (bust) {
                    for (var _b = 0, bots_1 = bots; _b < bots_1.length; _b++) {
                        var bot = bots_1[_b];
                        this.killBot(bot);
                    }
                    if (this.invulnerableTurns < 1 || p.tile !== tile)
                        tile.busted = true;
                }
                if (tile.busted) {
                    for (var _c = 0, _d = this.bots; _c < _d.length; _c++) {
                        var bot = _d[_c];
                        if (!bot.dead && bot.tile === tile)
                            this.killBot(bot);
                    }
                }
            }
            if (d.active && d.tile.busted) {
                this.decoy.active = false;
            }
            if (p.tile.busted) {
                this.player.dead = true;
                this.runAuto();
            }
            if (this.aliveBots.length < 1) {
                this.over = true;
                this.raiseEvent("over");
            }
        };
        Game.prototype.canMove = function (bot) { return this.frozenTurns < 1 && !bot.dead && !bot.stunned; };
        Game.prototype.killBot = function (bot) {
            bot.dead = true;
            if (!this.player.dead)
                this.raiseEvent(this.auto ? "autokill" : "kill");
        };
        Game.prototype.getRandomTile = function () {
            return this.tiles[Math.floor(this.tiles.length * Math.random())];
        };
        Game.prototype.getTile = function (x, y) {
            //if ( x < 0 ) x += this.W
            //if ( y < 0 ) y += this.H
            //if ( x >= this.W ) x -= this.W
            //if ( y >= this.H ) y -= this.H
            for (var _i = 0, _a = this.tiles; _i < _a.length; _i++) {
                var tile = _a[_i];
                if (tile.x === x && tile.y === y)
                    return tile;
            }
            return null;
        };
        Game.prototype.getBotsOn = function (tile) {
            var bots = [];
            for (var _i = 0, _a = this.bots; _i < _a.length; _i++) {
                var bot = _a[_i];
                if (!bot.dead && bot.tile === tile)
                    bots.push(bot);
            }
            return bots;
        };
        return Game;
    }());
    exports.Game = Game;
    var Tile = /** @class */ (function () {
        function Tile(x, y) {
            this.x = x;
            this.y = y;
            this.busted = false;
        }
        return Tile;
    }());
    var Player = /** @class */ (function () {
        function Player(tile) {
            this.tile = tile;
            this.dead = false;
        }
        return Player;
    }());
    var Bot = /** @class */ (function () {
        function Bot(tile) {
            this.tile = tile;
            this.stunned = false;
            this.dead = false;
        }
        return Bot;
    }());
    var Decoy = /** @class */ (function () {
        function Decoy(tile) {
            this.tile = tile;
        }
        return Decoy;
    }());
});
define("game/skills", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Skill = /** @class */ (function () {
        function Skill() {
        }
        return Skill;
    }());
    exports.Skill = Skill;
    var SkillBook = /** @class */ (function () {
        function SkillBook() {
        }
        SkillBook.makeSkillList = function () {
            return [
                {
                    icon: "❔",
                    name: "Random Teleport",
                    hint: "Teleport to any random tile.",
                    infiniteUses: true,
                    func: function (game) { return game.moveTo(game.getRandomTile()); }
                },
                {
                    icon: "🕑",
                    name: "Freeze x2",
                    hint: "Freeze all bots for two turns.",
                    func: function (game) { return game.frozenTurns += 2; }
                },
                {
                    icon: "❄",
                    name: "Stun Nearby",
                    hint: "Stun adjacent bots for one turn (incl. diagonally).",
                    func: function (game) {
                        for (var _i = 0, _a = game.bots; _i < _a.length; _i++) {
                            var bot = _a[_i];
                            if (Math.abs(bot.tile.x - game.player.tile.x) <= 1.0)
                                if (Math.abs(bot.tile.y - game.player.tile.y) <= 1.0)
                                    bot.stunned = true;
                        }
                    }
                },
                {
                    icon: "⛄",
                    name: "Leave Decoy",
                    hint: "On this move, bots will move to your last position, instead of your new one.",
                    func: function (game) { return game.decoy.active = true; }
                },
                {
                    icon: "😎",
                    name: "Fast Forward",
                    hint: "Automatically skip every turn until you win or you die.\n(yields better rewards per kill)",
                    infiniteUses: true,
                    func: function (game) { return game.runAuto(); }
                }
            ];
        };
        return SkillBook;
    }());
    exports.SkillBook = SkillBook;
});
/// <reference path="../def/phaser.d.ts" />
// import './style.css';
define("app", ["require", "exports", "game/skills"], function (require, exports, skills_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = /** @class */ (function () {
        function App() {
        }
        App.prototype.start = function () {
            console.log(456, new skills_1.Skill);
        };
        return App;
    }());
    exports.App = App;
    var GameScene = /** @class */ (function (_super) {
        __extends(GameScene, _super);
        function GameScene() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GameScene.prototype.preload = function () {
            console.log(new skills_1.Skill);
            this.load.image('circle', 'assets/circle4 glow.jpg');
            this.load.image('circle2', 'assets/rk.jpg');
            this.load.image('tile', 'assets/emoji/2b1c.png');
            this.load.image('bot', 'assets/emoji/1f989.png');
            this.load.spritesheet('gal', 'assets/xplo/explosion (2).png', { frameWidth: 128, frameHeight: 128, startFrame: 0 });
            this.load.spritesheet('mummy', 'https://labs.phaser.io/assets/sprites/metalslug_mummy37x45.png', { frameWidth: 37, frameHeight: 45, endFrame: 17 });
            this.load.image('sky', 'https://labs.phaser.io/assets/skies/lightblue.png');
            this.load.image('logo', 'https://labs.phaser.io/assets/sprites/phaser3-logo.png');
            this.load.image('red', 'https://labs.phaser.io/assets/particles/sparkle1.png');
        };
        GameScene.prototype.geX = function (v) { return 128 + v * 65; };
        GameScene.prototype.geY = function (v) { return 250 + v * 65; };
        GameScene.prototype.create = function () {
            this.add.image(400, 300, 'sky');
            var container = this.add.container(200, 200);
            var W = 9;
            var H = 9;
            for (var iy = 0; iy < H; iy++)
                for (var ix = 0; ix < W; ix++)
                    this.add.sprite(this.geX(ix), this.geY(iy), "tile").setScale(.5);
            var ba = [[1, 1], [2, 3], [7, 1], [7, 2], [8, 4], [5, 7], [0, 6]];
            for (var _i = 0, ba_1 = ba; _i < ba_1.length; _i++) {
                var b = ba_1[_i];
                this.add.sprite(this.geX(b[0]), this.geY(b[1]), "bot").setScale(.5);
            }
            this.addParticles(this.geX(4), this.geY(4));
            var mummy = this.add.sprite(200, 200, 'mummy');
            this.anims.create({
                key: 'w',
                frames: this.anims.generateFrameNumbers('mummy', {}),
                frameRate: 12,
                repeat: -1
            });
            mummy.anims.load('w');
            mummy.anims.play('w');
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
});
var GameConsts = /** @class */ (function () {
    function GameConsts() {
    }
    GameConsts.scoreRewards = {
        initial: 0,
        levelClear: 0,
        levelClearPerUnusedSkil: 250,
        move: 0,
        botDeath: 0,
        botDeathAuto: 100
    };
    return GameConsts;
}());
var Rewards = /** @class */ (function () {
    function Rewards() {
    }
    return Rewards;
}());
define("game/game-session", ["require", "exports", "game/game", "./game-consts", "game/skills"], function (require, exports, game_1, game_consts_1, skills_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GameSession = /** @class */ (function () {
        function GameSession() {
        }
        Object.defineProperty(GameSession.prototype, "gameOver", {
            get: function () { return this.currentGame.over && !this.currentGame.player; },
            enumerable: true,
            configurable: true
        });
        GameSession.prototype.reset = function () {
            this.skills = skills_2.SkillBook.makeSkillList();
            this.usedSkills = [];
            this.score = game_consts_1.GameConsts.scoreRewards.initial;
            this.currentStageNumber = 1;
            this.currentGame = this.makeGame();
        };
        GameSession.prototype.next = function () {
            this.usedSkills = [];
            this.score += game_consts_1.GameConsts.scoreRewards.levelClear;
            this.currentStageNumber++;
            this.currentGame = this.makeGame();
        };
        ///
        GameSession.prototype.onGameEvent = function (e) {
            console.log(e);
            switch (e) {
                case "move":
                    this.score += game_consts_1.GameConsts.scoreRewards.move;
                    break;
                case "kill":
                    this.score += game_consts_1.GameConsts.scoreRewards.botDeath;
                    break;
                case "autokill":
                    this.score += game_consts_1.GameConsts.scoreRewards.botDeathAuto;
                    break;
                case "over":
                    this.score += game_consts_1.GameConsts.scoreRewards.levelClear;
                    for (var _i = 0, _a = this.skills; _i < _a.length; _i++) {
                        var skill = _a[_i];
                        if (!skill.infiniteUses)
                            if (this.usedSkills.indexOf(skill) < 0)
                                this.score += game_consts_1.GameConsts.scoreRewards.levelClearPerUnusedSkil;
                    }
                    break;
            }
        };
        GameSession.prototype.useSkill = function (skill) {
            if (this.canUseSkill(skill)) {
                skill.func(this.currentGame);
                this.usedSkills.push(skill);
                //this.coins -= skill.price
                this.currentGame.recheck();
            }
        };
        GameSession.prototype.canUseSkill = function (skill) { return skill.infiniteUses || this.usedSkills.indexOf(skill) < 0; };
        ///
        GameSession.prototype.makeGame = function () {
            var _this = this;
            var params = this.makeGameParams(this.currentStageNumber);
            return new game_1.Game(params.w, params.h, params.bots, function (e) { return _this.onGameEvent(e); });
        };
        GameSession.prototype.makeGameParams = function (lvl) {
            var params = {};
            switch (lvl) {
                case 1:
                    params.w = 9;
                    params.h = 11;
                    break;
                case 2:
                    params.w = 11;
                    params.h = 13;
                    break;
                case 3:
                    params.w = 13;
                    params.h = 15;
                    break;
                case 4:
                    params.w = 15;
                    params.h = 19;
                    break;
                default:
                    params.w = 21;
                    params.h = 25;
                    break;
            }
            switch (lvl) {
                case 1:
                    params.w = 11;
                    params.h = 11;
                    break;
                case 2:
                    params.w = 13;
                    params.h = 13;
                    break;
                case 3:
                    params.w = 15;
                    params.h = 15;
                    break;
                case 4:
                    params.w = 17;
                    params.h = 17;
                    break;
                default:
                    params.w = 21;
                    params.h = 21;
                    break;
            }
            params.bots = params.w + lvl;
            return params;
        };
        return GameSession;
    }());
    exports.GameSession = GameSession;
});

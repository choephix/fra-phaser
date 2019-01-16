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

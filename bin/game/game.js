export class Game {
    constructor(W, H, BOTS, raiseEvent) {
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
        for (let ix = 0; ix < W; ix++)
            for (let iy = 0; iy < H; iy++)
                this.tiles.push(new Tile(ix, iy));
        let pti = H * Math.floor(.5 * W) + Math.floor(.5 * H);
        let pt = this.tiles[pti];
        this.player = new Player(pt);
        this.bots = [];
        let tiles = this.tiles.filter((t) => {
            return (t.x > pt.x + 1 || t.x < pt.x - 1)
                && (t.y > pt.y + 1 || t.y < pt.y - 1);
        });
        for (let ib = 0; ib < BOTS; ib++) {
            if (tiles.length < 1)
                break;
            let it = Math.floor(tiles.length * Math.random());
            this.bots.push(new Bot(tiles[it]));
            tiles.splice(it, 1);
        }
        this.decoy = new Decoy(pt);
    }
    get victory() { return !this.player.dead; }
    get aliveBots() { return this.bots.filter(bot => !bot.dead); }
    runAuto() {
        this.auto = true;
        let interval = setInterval(() => {
            if (!this.over) {
                this.endTurn();
            }
            else {
                console.log("-- end-tick --");
                clearInterval(interval);
                this.auto = false;
            }
        }, 200);
    }
    moveTo(playerTile) {
        let p = this.player;
        p.tile = playerTile ? playerTile : p.tile;
        if (!this.decoy.active)
            this.decoy.tile = p.tile;
    }
    endTurn() {
        let p = this.player;
        let bx, by, t;
        for (let bot of this.bots) {
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
            for (let bot of this.bots)
                bot.stunned = false;
            this.raiseEvent("move");
        }
    }
    recheck() {
        let p = this.player;
        let d = this.decoy;
        for (let tile of this.tiles) {
            let bots = this.getBotsOn(tile);
            let bust = bots.length > 1
                || (bots.length > 0 && tile === p.tile)
                || (bots.length > 0 && tile === d.tile);
            if (bust) {
                for (let bot of bots)
                    this.killBot(bot);
                if (this.invulnerableTurns < 1 || p.tile !== tile)
                    tile.busted = true;
            }
            if (tile.busted) {
                for (let bot of this.bots)
                    if (!bot.dead && bot.tile === tile)
                        this.killBot(bot);
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
    }
    canMove(bot) { return this.frozenTurns < 1 && !bot.dead && !bot.stunned; }
    killBot(bot) {
        bot.dead = true;
        if (!this.player.dead)
            this.raiseEvent(this.auto ? "autokill" : "kill");
    }
    getRandomTile() {
        return this.tiles[Math.floor(this.tiles.length * Math.random())];
    }
    getTile(x, y) {
        //if ( x < 0 ) x += this.W
        //if ( y < 0 ) y += this.H
        //if ( x >= this.W ) x -= this.W
        //if ( y >= this.H ) y -= this.H
        for (let tile of this.tiles)
            if (tile.x === x && tile.y === y)
                return tile;
        return null;
    }
    getBotsOn(tile) {
        let bots = [];
        for (let bot of this.bots)
            if (!bot.dead && bot.tile === tile)
                bots.push(bot);
        return bots;
    }
}
export default Game;
class Tile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.busted = false;
    }
}
class Player {
    constructor(tile) {
        this.tile = tile;
        this.dead = false;
    }
}
class Bot {
    constructor(tile) {
        this.tile = tile;
        this.stunned = false;
        this.dead = false;
    }
}
class Decoy {
    constructor(tile) {
        this.tile = tile;
    }
}

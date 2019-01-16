"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Skill = /** @class */ (function () {
    function Skill() {
    }
    return Skill;
}());
exports.default = Skill;
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

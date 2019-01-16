"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = require("./game");
var game_consts_1 = require("./game-consts");
var skills_1 = require("./skills");
var GameSession = /** @class */ (function () {
    function GameSession() {
    }
    Object.defineProperty(GameSession.prototype, "gameOver", {
        get: function () { return this.currentGame.over && !this.currentGame.player; },
        enumerable: true,
        configurable: true
    });
    GameSession.prototype.reset = function () {
        this.skills = skills_1.SkillBook.makeSkillList();
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

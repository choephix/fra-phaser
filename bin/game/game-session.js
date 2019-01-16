import { Game } from './Game';
import { GameConsts } from './game-consts';
import { SkillBook } from './Skill';
export class GameSession {
    get gameOver() { return this.currentGame.over && !this.currentGame.player; }
    reset() {
        this.skills = SkillBook.makeSkillList();
        this.usedSkills = [];
        this.score = GameConsts.scoreRewards.initial;
        this.currentStageNumber = 1;
        this.currentGame = this.makeGame();
    }
    next() {
        this.usedSkills = [];
        this.score += GameConsts.scoreRewards.levelClear;
        this.currentStageNumber++;
        this.currentGame = this.makeGame();
    }
    ///
    onGameEvent(e) {
        console.log(e);
        switch (e) {
            case "move":
                this.score += GameConsts.scoreRewards.move;
                break;
            case "kill":
                this.score += GameConsts.scoreRewards.botDeath;
                break;
            case "autokill":
                this.score += GameConsts.scoreRewards.botDeathAuto;
                break;
            case "over":
                this.score += GameConsts.scoreRewards.levelClear;
                for (let skill of this.skills)
                    if (!skill.infiniteUses)
                        if (this.usedSkills.indexOf(skill) < 0)
                            this.score += GameConsts.scoreRewards.levelClearPerUnusedSkil;
                break;
        }
    }
    useSkill(skill) {
        if (this.canUseSkill(skill)) {
            skill.func(this.currentGame);
            this.usedSkills.push(skill);
            //this.coins -= skill.price
            this.currentGame.recheck();
        }
    }
    canUseSkill(skill) { return skill.infiniteUses || this.usedSkills.indexOf(skill) < 0; }
    ///
    makeGame() {
        let params = this.makeGameParams(this.currentStageNumber);
        return new Game(params.w, params.h, params.bots, (e) => this.onGameEvent(e));
    }
    makeGameParams(lvl) {
        let params = {};
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
    }
}

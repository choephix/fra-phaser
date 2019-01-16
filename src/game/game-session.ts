import { Game } from './game'
import { GameConsts } from './game-consts'
import { Skill, SkillBook } from './skills'

export class GameSession
{
  public currentGame:Game
  public currentStageNumber:number

  public skills:Skill[]

  public score:number
  public usedSkills:Skill[]
  
  public get gameOver():boolean 
  { return this.currentGame.over && !this.currentGame.player  }

  public reset():void
  {
    this.skills = SkillBook.makeSkillList()

    this.usedSkills = []
    this.score = GameConsts.scoreRewards.initial

    this.currentStageNumber = 1
    this.currentGame = this.makeGame()
  }

  public next():void
  {
    this.usedSkills = []
    this.score += GameConsts.scoreRewards.levelClear
    
    this.currentStageNumber ++
    this.currentGame = this.makeGame()
  }

  ///

  private onGameEvent( e:string )
  { 
      console.log(e)
    switch(e)
    {
      case "move":
        this.score += GameConsts.scoreRewards.move
        break
      case "kill":
        this.score += GameConsts.scoreRewards.botDeath
        break
      case "autokill":
        this.score += GameConsts.scoreRewards.botDeathAuto
        break
      case "over":
        this.score += GameConsts.scoreRewards.levelClear
        for ( let skill of this.skills )
          if ( !skill.infiniteUses )
            if ( this.usedSkills.indexOf( skill ) < 0 )
              this.score += GameConsts.scoreRewards.levelClearPerUnusedSkil
        break
    }
  }

  public useSkill( skill:Skill )
  {
    if ( this.canUseSkill(skill) )
    {
      skill.func( this.currentGame )
      this.usedSkills.push(skill)
      //this.coins -= skill.price
      this.currentGame.recheck()
    }
  }

  public canUseSkill( skill:Skill )
  { return skill.infiniteUses || this.usedSkills.indexOf(skill) < 0 }

  ///

  private makeGame():Game
  {
    let params = this.makeGameParams( this.currentStageNumber )
    return new Game( params.w, params.h, params.bots, 
                     (e) => this.onGameEvent(e) )
  }

  private makeGameParams( lvl:number ):any
  {
    let params:any = {}
    switch ( lvl )
    {
      case 1:  params.w=9; params.h=11; break;
      case 2:  params.w=11; params.h=13; break;
      case 3:  params.w=13; params.h=15; break;
      case 4:  params.w=15; params.h=19; break;
      default: params.w=21; params.h=25; break;
    }
    switch ( lvl )
    {
      case 1:  params.w=11; params.h=11; break;
      case 2:  params.w=13; params.h=13; break;
      case 3:  params.w=15; params.h=15; break;
      case 4:  params.w=17; params.h=17; break;
      default: params.w=21; params.h=21; break;
    }
    params.bots = params.w + lvl
    return params
  }
}
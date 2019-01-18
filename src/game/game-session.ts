import { Game } from './game'
import { GameConsts } from './game-consts'
import { Skill, SkillBook } from './skills'
import { EventBus } from './events';

export class GameSession
{
  public currentGame:Game
  public currentStageNumber:number

  public skills:Skill[]

  public score:number
  public usedSkills:Skill[]

  public events:EventBus = new EventBus
  
  public reset():void
  {
    this.skills = SkillBook.makeSkillList()

    this.usedSkills = []
    this.score = GameConsts.scoreRewards.initial

    this.currentStageNumber = 1
    this.currentGame = this.makeGame()
    this.currentGame.start()
  }

  public next():void
  {
    this.usedSkills = []
    this.score += GameConsts.scoreRewards.levelClear
    
    this.currentStageNumber ++
    this.currentGame = this.makeGame()
    this.currentGame.start()
  }

  ///

  private addEventListeners()
  {
    this.events.on( "any", console.log )
    this.events.on( "over", () => onGameOver() )
    this.events.on( "move", () => this.score += GameConsts.scoreRewards.move )
    this.events.on( "kill", () => this.score += GameConsts.scoreRewards.botDeath )
    this.events.on( "autokill", () => this.score += GameConsts.scoreRewards.botDeathAuto )

    function onGameOver()
    {
      this.score += GameConsts.scoreRewards.levelClear
      for ( let skill of this.skills )
        if ( !skill.infiniteUses )
          if ( this.usedSkills.indexOf( skill ) < 0 )
            this.score += GameConsts.scoreRewards.levelClearPerUnusedSkil
    }
  }

  public useSkill( skill:Skill )
  {
    if ( this.canUseSkill(skill) )
    {
      skill.func( this.currentGame )
      this.usedSkills.push(skill)
      this.events.raise("playerspecial",skill)
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
    let game = new Game( params.w, params.h, params.bots, this.events )
    return game
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

import { Game } from './game'
console.log(this)
export class Skill {
  icon:string
  name:string
  hint?:string
  func:( game:Game )=>void
  infiniteUses?:boolean
}

export class SkillBook
{
  public static makeSkillList():Skill[]
  {
    return [
      { 
        icon:"❔", 
        name:"Random Teleport", 
        hint:"Teleport to any random tile.",
        infiniteUses:true,
        func:( game:Game )=> game.moveTo( game.getRandomTile() )
      },
      { 
        icon:"🕑", 
        name:"Freeze x2", 
        hint:"Freeze all bots for two turns.",
        func:( game:Game )=> game.frozenTurns += 2
      },
      { 
        icon:"❄", 
        name:"Stun Nearby", 
        hint:"Stun adjacent bots for one turn (incl. diagonally).",
        func:( game:Game )=> {            
          for ( let bot of game.bots )
            if ( Math.abs( bot.tile.x - game.player.tile.x ) <= 1.0 )
              if ( Math.abs( bot.tile.y - game.player.tile.y ) <= 1.0 )
                bot.stunned = true
        }
      },
      { 
        icon:"⛄", 
        name:"Leave Decoy", 
        hint:"On this move, bots will move to your last position, instead of your new one.",
        func:( game:Game )=> game.decoy.active = true
      },
      { 
        icon:"😎", 
        name:"Fast Forward", 
        hint:"Automatically skip every turn until you win or you die.\n(yields better rewards per kill)",
        infiniteUses:true,
        func:( game:Game )=> game.runAuto()
      }
    ]
  }
}
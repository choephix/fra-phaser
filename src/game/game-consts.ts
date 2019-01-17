class GameConsts
{
  public static scoreRewards:Rewards = {
    initial: 0,
    levelClear: 0,
    levelClearPerUnusedSkil: 250,
    move: 0,
    botDeath: 0,
    botDeathAuto: 100
  }
}

class Rewards
{
  initial:number
  levelClear:number
  levelClearPerUnusedSkil:number
  move:number
  botDeath:number
  botDeathAuto:number
}
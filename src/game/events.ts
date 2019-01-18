export class EventBus
{
  private handlers:EventHandler[] = []

  public on(type:string,call:Function)
  { this.handlers.push({type:type,func:call}) }
  
  public raise(type:string,...rest)
  {
    for ( let handler of this.handlers )
      if ( handler.type === type || handler.type === "any" )
        handler.func(...rest)
  }
}

class EventHandler { type:string; func:Function }

const EVENTS = [
  "gamestart",
  "gameover",
  "change",
  "botspawn",      // to
  "botmove",       // from, to
  "botdie",        // collision/fall
  "playerspawn",   // to
  "playermove",    // from, to
  "playerspecial", // skill
  "playerdie",     // collision/fall
  "tilebust",      // tile
]


// export class Events
// {
//   public static readonly GAME_START:string = "gamestart"
//   public static readonly GAME_OVER:string = "gamestart"
//   public static readonly TURN_END:string = "gamestart"
//   public static readonly BOT_MOVE:string = "gamestart"
//   public static readonly BOT_DEAD:string = "gamestart"
//   public static readonly PLAYER_MOVE:string = "gamestart"
//   public static readonly GAME_START:string = "gamestart"
// }
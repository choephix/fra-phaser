export class EventBus implements IEventDispatcher
{
  private handlers: { type: string; func: Function }[] = []

  public on(type:string,call:Function)
  { this.handlers.push({type:type,func:call}) }
  
  public raise( type:string, ...rest:any )
  {
    console.log(type,...rest)
    for ( let handler of this.handlers )
      if ( handler.type === type )
        handler.func(...rest)
      else
      if ( handler.type === "any")
        handler.func( type, ...rest )
  }
}
export interface IEventDispatcher { raise( type:string, ...rest:any ):void; }

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

export class EventBus implements IEventDispatcher
{
  private handlers: { type: GameEvent; func: Function }[] = []

  public on(type:GameEvent,call:Function)
  { this.handlers.push({type:type,func:call}) }
  
  public raise( type: GameEvent, ...rest:any )
  {
    // console.log(type,...rest)
    for ( let handler of this.handlers )
      if ( handler.type === type )
        handler.func(...rest)
      else
      if ( handler.type === GameEvent.ANY )
        handler.func( type, ...rest )
  }
}
export interface IEventDispatcher { raise( type: GameEvent, ...rest:any ):void; }

export enum GameEvent
{
  ANY,
  GAMESTART,
  GAMEOVER,
  CHANGE,
  BOTSPAWN,      // to
  BOTMOVE,       // from, to
  BOTDIE,        // collision/fall
  PLAYERSPAWN,   // to
  PLAYERMOVE,    // from, to
  PLAYERSPECIAL, // skill
  PLAYERDIE,     // collision/fall
  TILEBUST,      // tile
}

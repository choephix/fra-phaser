import Game from "src/game/game";

export class DebugKeyboardController
{
  constructor( private game:Game )
  {
    document.addEventListener( "keydown", e => onKeyDown.apply( game, [ e ] ) )

    function onKeyDown( e: KeyboardEvent )
    {
      if ( e.code === "KeyK" )
      {
        for ( let i in game.bots )
        {
          game.killBot( game.bots[ i ], true )
          game.bots[ i ].tile.busted = true
        }
        game.recheck()
      }
      if ( e.code === "KeyF" ) document.documentElement.requestFullscreen()
    }
  }
}

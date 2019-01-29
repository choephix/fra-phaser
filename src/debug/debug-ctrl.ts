import { App } from "src/app";

export class DebugKeyboardController
{
  constructor()
  {
    document.addEventListener( "keydown", e => onKeyDown( e ) )

    function onKeyDown( e: KeyboardEvent )
    {
      if ( e.code === "KeyK" )
      {
        let game = App.gameplay.currentGame

        for ( let i in game.bots )
        {
          game.killBot( game.bots[ i ], true )
          game.bots[ i ].tile.busted = true
        }
        game.recheck()
      }
      if ( e.code === "KeyF" ) 
        document.documentElement.requestFullscreen()
    }
  }
}

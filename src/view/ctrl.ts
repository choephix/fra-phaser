import { GameWorld } from "./game-world";

export class TouchController
{
  drag: Drag

  constructor( public onChoice: ( dx: number, dy: number ) => void ) { }

  log( ...rest ) { console.log( ...rest ) }

  start( x, y )
  {
    //if ( !this.drag )
    {
      this.drag = new Drag
      this.drag.x1 = this.drag.x2 = x
      this.drag.y1 = this.drag.y2 = y
      this.drag.begintime = Date.now()
    }
  }

  move( x, y )
  {
    if ( this.drag )
    {
      this.drag.x2 = x
      this.drag.y2 = y
    }
  }

  end()
  {
    if ( this.active && ( !this.stay || !this.indelay ) )
    {
      if ( this.stay )
      {
        this.onChoice( 0, 0 )
      }
      else
      {
        let xy = this.drag.moveXY
        this.onChoice( xy[ 0 ], xy[ 1 ] )
      }
    }

    this.drag = null
  }

  /// VISUALS & INPUT

  R_STAY: number = 30
  R_CANCEL: number = 1330
  get stay(): boolean { return this.drag.length <= this.R_STAY }
  get cancel(): boolean { return this.drag.length > this.R_CANCEL }
  get indelay(): boolean { return Date.now() - this.drag.begintime < 60 }
  get timedout(): boolean { return false && Date.now() - this.drag.begintime > 1000 }
  get active(): boolean { return this.drag && !this.cancel && !this.timedout }
  get tranformAttribute(): string
  {
    let fi = this.stay ? 0 : this.drag.moveAngle
    return 'translate(' + this.drag.x1 + ',' + this.drag.y1 + ') rotate(' + fi + ')'
  }
}
class Drag
{
  public x1: number
  public y1: number
  public x2: number
  public y2: number
  public begintime: number

  public get length(): number
  {
    let dx = Math.abs( this.x2 - this.x1 )
    let dy = Math.abs( this.y2 - this.y1 )
    return Math.sqrt( dx * dx + dy * dy )
  }

  public get moveAngle(): number
  {
    let dX = this.x2 - this.x1
    let dY = this.y2 - this.y1
    let rad = Math.atan2( dY, dX )
    let deg = rad * ( 180 / Math.PI )
    deg += 180
    deg += 22.5
    deg -= deg % 45
    deg -= 180
    return deg
  }

  public get moveXY(): number[]
  {
    switch ( this.moveAngle )
    {
      case 0: return [ 1, 0 ]
      case 45: return [ 1, 1 ]
      case 90: return [ 0, 1 ]
      case 135: return [ -1, 1 ]
      case 180: return [ -1, 0 ]
      case -180: return [ -1, 0 ]
      case -135: return [ -1, -1 ]
      case -90: return [ 0, -1 ]
      case -45: return [ 1, -1 ]
    }
    return [ 0, 0 ]
  }
}

export class KeyboardController
{
  constructor ( private world:GameWorld )
  {
    document.addEventListener( "keydown", e => onKeyDown.apply( world, [e] ) )

    function onKeyDown( e: KeyboardEvent )
    {
      if ( this.game && !this.game.over )
      {
        if ( e.code === "KeyQ" || e.code === "Numpad7" ) this.moveMayBe( -1, -1 )
        if ( e.code === "KeyW" || e.code === "Numpad8" ) this.moveMayBe( 0, -1 )
        if ( e.code === "KeyE" || e.code === "Numpad9" ) this.moveMayBe( 1, -1 )
        if ( e.code === "KeyA" || e.code === "Numpad4" ) this.moveMayBe( -1, 0 )
        if ( e.code === "KeyS" || e.code === "Numpad5" ) this.moveMayBe( 0, 0 )
        if ( e.code === "KeyD" || e.code === "Numpad6" ) this.moveMayBe( 1, 0 )
        if ( e.code === "KeyZ" || e.code === "Numpad1" ) this.moveMayBe( -1, 1 )
        if ( e.code === "KeyX" || e.code === "Numpad2" ) this.moveMayBe( 0, 1 )
        if ( e.code === "KeyC" || e.code === "Numpad3" ) this.moveMayBe( 1, 1 )
        if ( e.code === "Backquote" || e.code === "NumpadAdd" ) this.useSkill( this.session.skills[ 0 ] )
        if ( e.code === "Digit1" || e.code === "NumpadDivide" ) this.useSkill( this.session.skills[ 1 ] )
        if ( e.code === "Digit2" || e.code === "NumpadMultiply" ) this.useSkill( this.session.skills[ 2 ] )
        if ( e.code === "Digit3" || e.code === "NumpadSubtract" ) this.useSkill( this.session.skills[ 3 ] )
        if ( e.code === "Enter" || e.code === "NumpadEnter" ) this.useSkill( this.session.skills[ 4 ] )
        if ( e.code === "KeyF" ) document.documentElement.requestFullscreen()
      }
      else
        this.initNextStage()
    }
  }
}

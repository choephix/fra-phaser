export class TouchControllerSetup
{

}

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

  end( e )
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
  R_CANCEL: number = 330
  get stay(): boolean { return this.drag.length <= this.R_STAY }
  get cancel(): boolean { return this.drag.length > this.R_CANCEL }
  get indelay(): boolean { return Date.now() - this.drag.begintime < 100 }
  get active(): boolean { return this.drag && !this.cancel }
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

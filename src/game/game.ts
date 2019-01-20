import { IEventDispatcher, GameEvent } from "./events";

export class Game 
{
  public tiles:Tile[] = []
  public bots:Bot[] = []
  public player:Player = null

  public decoy:Decoy
  public frozenTurns:number = 0
  public auto:boolean = false

  public over:boolean
  public get victory():boolean { return !this.player.dead }
  public get aliveBots():Bot[] { return this.bots.filter(bot=>!bot.dead) }

  constructor( public W: number, public H: number, public BOTS: number, public events:IEventDispatcher )
  {
    for ( let ix = 0; ix < W; ix++ )
      for ( let iy = 0; iy < H; iy++ )
        this.tiles.push( new Tile(ix,iy) )

    let pti = H*Math.floor(.5*W)+Math.floor(.5*H)
    let pt = this.tiles[pti]
    this.player = new Player( pt )

    this.bots = []
    let tiles = this.tiles.filter( (t)=>{
      return ( t.x > pt.x + 1 || t.x < pt.x - 1 )
          && ( t.y > pt.y + 1 || t.y < pt.y - 1 )
    } )
    for ( let ib = 0; ib < BOTS; ib++ )
    {
      if ( tiles.length < 1 )
        break;
      let it = Math.floor( tiles.length * Math.random() )    
      this.bots.push( new Bot( tiles[it] ) )
      tiles.splice( it, 1 )
    }

    this.decoy = new Decoy( pt )
  }

  public start()
  {
    this.events.raise( GameEvent.GAMESTART )
    this.recheck()
  }

  public runAuto()
  {
    this.auto = true
    let interval = setInterval( () => 
    {
      if ( !this.over )
      {
        this.endTurn()     
      }
      else
      {
        console.log("-- end-tick --") 
        clearInterval( interval )
        this.auto = false
      }
    }, 200 )
  }

  public moveTo( playerTile:Tile )
  {
    let p = this.player 
    p.tile = playerTile ? playerTile : p.tile   

    if ( !this.decoy.active )
      this.decoy.tile = p.tile
  }

  public endTurn()
  {
    let p = this.player 
    let bx, by, t:Tile
    for ( let bot of this.bots )
    {
      if ( !this.canMove( bot ) )
        continue
      bx = bot.tile.x
      by = bot.tile.y
      t = this.decoy ? this.decoy.tile : p.tile
      if ( t.x > bx ) bx++
      if ( t.x < bx ) bx--
      if ( t.y > by ) by++
      if ( t.y < by ) by--
      bot.tile = this.getTile( bx, by )
      this.events.raise( GameEvent.BOTMOVE )
    }

    this.recheck()

    /// Clear
    if ( !this.over )
    {
      if ( this.frozenTurns > 0 )
        this.frozenTurns--
      for ( let bot of this.bots )
        bot.stunned = false
      this.events.raise( GameEvent.PLAYERMOVE )
    }
  }

  public recheck()
  {
    let p = this.player    
    let d = this.decoy

    for ( let tile of this.tiles )
    {
      if ( !tile.busted )
      {
        let bots:Bot[] = this.getBotsOn( tile )
        let bust = bots.length > 1 
                || ( bots.length > 0 && tile === p.tile )
                || ( bots.length > 0 && tile === d.tile )
        if ( bust )
        {
          for ( let bot of bots )
            this.killBot( bot, true )
          tile.busted = true
          this.events.raise( GameEvent.TILEBUST, tile )
        }
      }
      if ( tile.busted )
      {
        for ( let bot of this.bots )
          if ( !bot.dead && bot.tile === tile )
            this.killBot( bot, false )
      }
    }

    if ( d.active && d.tile.busted )
    {
      this.decoy.active = false
    }
    if ( p.tile.busted )
    {
      this.player.dead = true
      this.runAuto()
    }
    if ( this.aliveBots.length < 1 )
    {
      this.over = true
      this.events.raise( GameEvent.GAMEOVER )
    }

    this.events.raise( GameEvent.CHANGE )
  }

  public canMove( bot:Bot )
  { return this.frozenTurns < 1 && !bot.dead && !bot.stunned }

  public killBot( bot:Bot, collision:boolean )
  {
    if ( bot.dead )
      return
    bot.dead = true
    if ( !this.player.dead )
      this.events.raise( GameEvent.BOTDIE, bot, collision, this.auto )
  }

  public getRandomTile()
  {
    return this.tiles[ Math.floor( this.tiles.length * Math.random() ) ]
  }

  public getTile( x: number, y: number )
  {
    //if ( x < 0 ) x += this.W
    //if ( y < 0 ) y += this.H
    //if ( x >= this.W ) x -= this.W
    //if ( y >= this.H ) y -= this.H
    for ( let tile of this.tiles )
      if ( tile.x === x && tile.y === y )
        return tile
    return null
  }

  public getBotsOn( tile:Tile ):Bot[]
  {
    let bots:Bot[] = []
    for ( let bot of this.bots )
      if ( !bot.dead && bot.tile === tile )
        bots.push( bot )
    return bots
  }
}

class Tile
{
  busted:boolean = false
  constructor ( public x:number, public y:number ) {}
}

class Player {
  dead:boolean = false
  constructor ( public tile:Tile ) {}
}
class Bot {
  stunned:boolean = false
  dead:boolean = false
  constructor ( public tile:Tile ) {}
}
class Decoy {
  active:boolean
  constructor ( public tile:Tile ) {}
}

export default Game;

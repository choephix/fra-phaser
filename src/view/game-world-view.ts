import { Game, Tile, Bot, Player, Decoy } from "../game/game";
import { GameWorldEffects } from "./effects";

export class GameWorldView extends Phaser.GameObjects.Container
{
  TILESIZE: number = 70

  public game: Game
  
  public tiles:TileSprite[] = []
  public bots:BotSprite[] = []
  public player:PlayerSprite
  public decoy:DecoySprite

  public quake:number = 0

  public get viewW() { return this.TILESIZE * this.game.W }
  public get viewH() { return this.TILESIZE * this.game.H }
 
  public getTileX( v ) { return this.TILESIZE * ( v - this.game.W * 0.5 + .5 ) }
  public getTileY( v ) { return this.TILESIZE * ( v - this.game.H * 0.5 + .5 ) }
  public getActorX( v ) { return this.getTileX( v ) }
  public getActorY( v ) { return this.getTileY( v ) - 10 }

  constructor ( scene, private originalX, private originalY )
  {
    super(scene,originalX,originalY)
  }

  preUpdate( time, delta )
  {
    if ( !this.game )
      return
      
    if ( this.quake > .01 )
    {
      this.x = this.originalX + Phaser.Math.FloatBetween( -this.quake, this.quake )
      this.y = this.originalY + Phaser.Math.FloatBetween( -this.quake, this.quake )
      this.quake *= .85
    }
    else
    {
      this.x = this.originalX
      this.y = this.originalY
    }

    if ( this.decoy.visible != this.game.decoy.active )
    {
      this.decoy.visible = this.game.decoy.active
      this.decoy.x = this.getActorX(this.game.decoy.tile.x)
      this.decoy.y = this.getActorX(this.game.decoy.tile.y)
    }
  }

  add( child: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[] ): Phaser.GameObjects.Container
  {
    this.scene.add.existing( <Phaser.GameObjects.GameObject>child )
    return super.add(child)
  }

  addBackground()
  {
    return
    let c
    c = this.scene.add.image( 0, 0, "circle" )
      .setBlendMode( Phaser.BlendModes.ADD )
      .setScale( .5 )
    this.add( c )
    this.scene.tweens.add( {
      targets: c,
      rotation: -Math.PI * 2,
      duration: 50000,
      repeat: -1
    } )
    c = this.scene.add.image( 0, 0, "circle" )
      .setBlendMode( Phaser.BlendModes.ADD )
      .setScale( 1.5 )
      .setAlpha( .05 )
    this.add( c )
    this.scene.tweens.add( {
      targets: c,
      rotation: -Math.PI * 2,
      duration: 150000,
      repeat: -1
    } )
  }

  //

  purgeAllThings()
  {
    this.removeAll( true )
    this.tiles = []
    this.bots = []
    this.player = null
    this.decoy = null
  }

  addTile( model:Tile )   
  { 
    let o = new TileSprite( this.scene, model )
           .setPosition( this.getTileX(model.x), this.getTileY(model.y) )
    this.add( o )
    this.tiles.push( o )
  }
  addBot( model:Bot ) 
  {
    let o = new BotSprite( this.scene, model )
      .setPosition( this.getActorX( model.tile.x ), this.getActorY( model.tile.y ) )
    this.add( o )
    this.bots.push( o )
  }
  addPlayer( model:Player ) 
  {
    this.player = new PlayerSprite( this.scene, model )
    this.player.setPosition( this.getActorX( model.tile.x ), this.getActorY( model.tile.y ) )
    this.add( this.player )

    this.decoy = new DecoySprite( this.scene, this.game.decoy )
    this.decoy.setPosition( this.getActorX( model.tile.x ), this.getActorY( model.tile.y ) )
    this.add( this.decoy )
  }
}

class TileSprite extends Phaser.GameObjects.Image
{
  busted:boolean
  constructor( scene: Phaser.Scene, public model:Tile )
  {
    super( scene, 0, 0, "tile" )
    this.setScale( Phaser.Math.FloatBetween( .54, .56 ) )
    this.setRotation( Phaser.Math.FloatBetween( -.05, .05 ) )

    let odd = ( model.x + model.y ) % 2 === 0

    if ( odd )
    {
      let h = Phaser.Math.FloatBetween( .05, .07 )+.5
      let s = Phaser.Math.FloatBetween( .48, .66 )
      let l = Phaser.Math.FloatBetween( .62, .72 )
      this.setTint( Phaser.Display.Color.HSLToColor(h,s,l).color )
    }
    else
    {
      let h = Phaser.Math.FloatBetween( .09, .11 )+.4
      let s = Phaser.Math.FloatBetween( .44, .72 )
      let l = Phaser.Math.FloatBetween( .77, .82 )
      this.setTint( Phaser.Display.Color.HSLToColor(h,s,l).color )
    }
  }
}

class BotSprite extends Phaser.GameObjects.Sprite
{
  dead: boolean
  frozen: boolean
  exploded:boolean
  // targetX:number = 0
  // targetY:number = 0
  constructor( scene: Phaser.Scene, public model:Bot )
  {
    super( scene, 0, 0, "sheet_b" )
    this.setScale( 0.175 )
    this.setOrigin( .4, .45 )
    this.setState_IDLE()
  }
  public setState_IDLE()
  {
    this.dead = false
    this.frozen = false
    this.anims.play( "bot-idle", true, Math.floor( Math.random() * 4 ) )
  }
  public setState_FALL()
  {
    this.dead = true
    this.anims.play( "bot-fall" )
    this.once( "animationcomplete", () => this.visible = false )
    GameWorldEffects.shockwave( {
      x: this.x, y: this.y,
      scale: 0.75,
      alpha: 0.10,
      delay: 150, 
      scene: this.scene,
      container: this.parentContainer
    } )
  }
  public setState_BOOM()
  {
    this.dead = true
    this.visible = false
    GameWorldEffects.shockwave( {
      x: this.x, y: this.y,
      scale: 2.0,
      alpha: 0.25, 
      scene: this.scene,
      container: this.parentContainer
    } )
    GameWorldEffects.boom( {
      x: this.x, y: this.y,
      scene: this.scene,
      container: this.parentContainer
    } )
  }
  public setState_FROZEN()
  {
    this.frozen = true
    return this.anims.play( "bot-freeze" )
  }
  // preUpdate()
  // {
  //   this.x += ( this.targetX - this.x ) * .3
  //   this.y += ( this.targetY - this.y ) * .3
  // }
}

class PlayerSprite extends Phaser.GameObjects.Sprite
{
  dead: boolean
  constructor( scene: Phaser.Scene, public model:Player )
  {
    super( scene, 0, 0, "sheet_b" )
    this.setScale( 0.25 )
    this.setOrigin(.4,.5)
    this.setState_IDLE()
  }
  public setState_IDLE()
  {
    this.anims.play( "player-idle" )
  }
  public setState_FALL()
  {
    this.dead = true
    this.anims.play( "player-fall" )
    this.once("animationcomplete",()=>this.visible=false)
  }
}

class DecoySprite extends Phaser.GameObjects.Sprite
{
  active: boolean
  constructor( scene: Phaser.Scene, public model:Decoy )
  {
    super( scene, 0, 0, "sheet_b" )
    this.setScale( 0.15 )
    this.setOrigin( .4, .55 )
    // this.setFrame( 30 )
    this.anims.play( "decoy" )
  }
}

import { Game, Tile, Bot, Player, Decoy } from "../game/game";

export class GameWorldView extends Phaser.GameObjects.Container
{
  TILESIZE: number = 70

  public game: Game
  
  public tiles:TileSprite[] = []
  public bots:BotSprite[] = []
  public player:PlayerSprite
  public decoy:DecoySprite

  public get viewW() { return this.TILESIZE * this.game.W }
  public get viewH() { return this.TILESIZE * this.game.H }
 
  public getTileX( v ) { return this.TILESIZE * ( v - this.game.W * 0.5 + .5 ) }
  public getTileY( v ) { return this.TILESIZE * ( v - this.game.H * 0.5 + .5 ) }
  public getActorX( v ) { return this.getTileX( v ) }
  public getActorY( v ) { return this.getTileY( v ) - 10 }

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
    let o = new PlayerSprite( this.scene, model )
      .setPosition( this.getActorX( model.tile.x ), this.getActorY( model.tile.y ) )
    this.add( o )
    this.player = o
    this.player.setState_IDLE()
  }

  // ANI

  shockwave( x, y, size )
  {
    let wave = this.scene.add.sprite( this.getTileX( x ), this.getTileY( y ), "wave" )
      .setRotation( 2.0 * Math.PI * Math.random() )
      .setScale( .1 * size )
      .setAlpha( .25 )
    this.scene.tweens.add( {
      targets: wave,
      onComplete: () => wave.destroy(),
      scaleX: size,
      scaleY: size,
      alpha: 0,
      ease: 'Circ.easeOut',
      duration: 300
    } )
    this.add( wave )
  }

  boom( x, y )
  {
    let boom = this.scene.add.sprite( this.getTileX( x ), this.getTileY( y ), "boom" )
    boom.setRotation( 2.0 * Math.PI * Math.random() )
    boom.setScale( 1.0 )
    boom.anims.load( "xplode" )
    boom.anims.play( "xplode" )
    boom.on( 'animationcomplete', () => boom.destroy() );
    this.add( boom )
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

class BotSprite extends Phaser.GameObjects.Image
{
  dead: boolean
  frozen: boolean
  exploded:boolean
  // targetX:number = 0
  // targetY:number = 0
  constructor( scene: Phaser.Scene, public model:Bot )
  {
    super( scene, 0, 0, "bot" )
    this.setScale( .6 )
      .setTint( Phaser.Display.Color.HSLToColor(
        Phaser.Math.FloatBetween( 0, 1 ),
        Math.random() * .25,
        Phaser.Math.FloatBetween( .85, 1 ) ).color )
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
    super( scene, 0, 0, "player" )
    this.setScale( 0.6 )
  }
  
  public setState_IDLE()
  {
    this.anims.load( "player-idle" )
    this.anims.play( "player-idle" )
    return this
  }
}

class DecoySprite extends Phaser.GameObjects.Sprite
{
  active: boolean
  constructor( scene: Phaser.Scene, public model:Decoy )
  {
    super( scene, 0, 0, "player" )
  }
}

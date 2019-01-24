import { Game, Tile, Bot, Player } from "../game/game";

export class GameWorldView extends Phaser.GameObjects.Container
{
  TILESIZE: number = 70

  public game: Game
  public things: any[] = []

  get viewW() { return this.TILESIZE * this.game.W }
  get viewH() { return this.TILESIZE * this.game.H }

  getTileX( v ) { return this.TILESIZE * ( v - this.game.W * 0.5 + .5 ) }
  getTileY( v ) { return this.TILESIZE * ( v - this.game.H * 0.5 + .5 ) }
  getActorX( v ) { return this.getTileX( v ) - 20 }
  getActorY( v ) { return this.getTileY( v ) - 20 }

  addBackground()
  {
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
    for ( let thing of this.things )
      thing.view.destroy()
    this.things.length = 0
  }

  addTile( model:Tile )   { this.addThing( new TileSprite( this.scene, ( model.x + model.y ) % 2 === 0 ), model ) }
  addBot( model:Bot ) { this.addThing( new BotSprite( this.scene ), model ) }
  addPlayer( model:Player ) 
  {
    let player:PlayerSprite = new PlayerSprite( this.scene )
    this.addThing( player, model )
    player.setState_IDLE()
  }
  addThing( view: Phaser.GameObjects.GameObject, model: any )
  {
    this.add( view )
    this.things.push( { view: view, model: model } )
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
  constructor( scene: Phaser.Scene, odd:boolean )
  {
    super( scene, 0, 0, "tile" )
    this.setScale( Phaser.Math.FloatBetween( .54, .56 ) )
    this.setRotation( Phaser.Math.FloatBetween( -.05, .05 ) )

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
  constructor( scene: Phaser.Scene )
  {
    super( scene, 0, 0, "bot" )
    this.setScale( .6 )
      .setTint( Phaser.Display.Color.HSLToColor(
        Phaser.Math.FloatBetween( 0, 1 ),
        Math.random() * .25,
        Phaser.Math.FloatBetween( .85, 1 ) ).color )
  }
}

class PlayerSprite extends Phaser.GameObjects.Sprite
{
  dead: boolean
  constructor( scene: Phaser.Scene )
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
  dead: boolean
  constructor( scene: Phaser.Scene )
  {
    super( scene, 0, 0, "player" )
    this.setScale( 0.6 )
    this.anims.load( "player-idle" )
  }

  public setState_IDLE()
  {
    this.anims.play( "player-idle" )
    return this
  }

  setActive( value: boolean )
  {
    console.log( "hi" )
    return super.setActive( value )
  }
}

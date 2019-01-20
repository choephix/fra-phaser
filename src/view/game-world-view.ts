import { Game } from "../game/game";

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

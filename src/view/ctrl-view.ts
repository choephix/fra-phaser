import { TouchController } from "./ctrl";

export class ControllerSprite extends Phaser.GameObjects.Container
{
  c1: Phaser.GameObjects.Image
  c2: Phaser.GameObjects.Image
  c3: Phaser.GameObjects.Image

  constructor( scene, private ctrl:TouchController )
  {
    super(scene)

    scene.add.existing( this )

    this.c1 = this.addCircle( "c2" )
    this.c2 = this.addCircle( "c1" )
    this.c3 = this.addCircle( "c3" ).setScale(.36).setAlpha(.3)
  }

  addCircle( tex: string )
  {
    let o = this.scene.add.image( 0, 0, tex )
    o.setBlendMode( Phaser.BlendModes.ADD )
    o.setScale( .2 )
    this.add( o )
    return o
  }

  preUpdate()
  {
    if ( this.ctrl.drag )
    {
      this.x = this.ctrl.drag.x1
      this.y = this.ctrl.drag.y1
    }

    this.c1.visible = this.ctrl.active
    this.c2.visible = this.ctrl.active && !this.ctrl.indelay
    this.c3.visible = this.ctrl.active && !this.ctrl.indelay
    this.c1.rotation -= .02
    this.c2.rotation += .01
    this.c3.rotation -= .0025
  }
}

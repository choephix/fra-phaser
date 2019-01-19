import { Skill, SkillBook } from "../game/skills"
import { Game } from "../game/game"
import { GameSession } from "../game/game-session"
import { TouchController } from "./ctrl";
import { GameEvent } from "src/game/events";

export class GameWorld extends Phaser.GameObjects.Container
{
  session: GameSession
  ctrl: TouchController
  
  get game(): Game { return this.session ? this.session.currentGame : null }

  private things:any[] = []
  private zone: Phaser.GameObjects.Image 

  public initialize()
  {
    this.scene.add.existing(this)

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

    document.addEventListener( "keydown", e => this.onKeyDown(e))

    this.ctrl = new TouchController( ( x, y ) => this.moveMayBe(x,y) )

    this.zone = this.scene.add.image( 0, 0, "tile" )
    this.zone
      .setAlpha(.1)
      .setTintFill(0x0)
      .setScale( 7, 7)
      .setInteractive( { useHandCursor: true } )
      .on( "pointerdown", e => this.ctrl.start( e.x, e.y ) )
      .on( "pointermove", e => this.ctrl.move( e.x, e.y ) )
      .on( "pointerup", e => this.ctrl.end() )
      .on( "pointerdown", e => { if ( this.game.over ) this.initNextStage() } )
    this.add( this.zone )

    this.session = new GameSession
    this.session.events.on( GameEvent.GAMESTART, () => this.buildWorld() )
    this.session.events.on( GameEvent.CHANGE, () => this.onAnyChange() )
    this.session.events.on( GameEvent.BOTDIE, (bot,collision) => 
    {
      if ( collision )
      {
        let x = ( bot.tile.x - this.game.W * 0.5 + .5 ) * 70 + Phaser.Math.FloatBetween(-25,25)
        let y = ( bot.tile.y - this.game.H * 0.5 + .5 ) * 70 + Phaser.Math.FloatBetween(-25,25)
        let boom = this.scene.add.sprite( x, y, "boom" )
        boom.setRotation( 2.0 * Math.PI * Math.random() )
        boom.setScale(1.5)
        boom.anims.load( "xplode" )
        boom.anims.play( "xplode" )
        boom.on( 'animationcomplete', () => boom.destroy() );
        this.add(boom)
      }
    } )
    this.session.reset()

    let skills = SkillBook.makeSkillList()
    for ( let i in skills )
    {
      let label = skills[ i ].icon + " " + skills[ i ].name
      let button: any = this.scene.add.text( 50, 100 + 25 * i, label, { fill: '#Ff0' } )
        .setInteractive( { useHandCursor: true } )
        .on( 'pointerdown', () => this.useSkill( this.session.skills[ i ] ) )
        .on( 'pointerover', () => button.setStyle( { fill: "#FFF" } ) )
        .on( 'pointerout', () => button.setStyle( { fill: "#Ff0" } ) )
    }
  }

  onAnyChange()
  {
    console.log("CHANGEEE!")

    for ( let o of this.things )
    {
      let x = o.model.hasOwnProperty( 'x' ) ? o.model.x : o.model.tile.x
      let y = o.model.hasOwnProperty( 'y' ) ? o.model.y : o.model.tile.y
      x = ( x - this.game.W * 0.5 + .5 ) * 70 + Phaser.Math.FloatBetween(-1,1)
      y = ( y - this.game.H * 0.5 + .5 ) * 70 + Phaser.Math.FloatBetween(-1,1)

      let fall = o.model.dead || o.model.busted

      this.scene.tweens.add({
        targets: o.view,
        x: x,
        y: y + ( fall ? 150 : 0 ),
        alpha: fall ? 0 : ( o.model.frozen ? .25 : 17 ),
        duration: 150
      })
    }
  }
  
  addThing( view:Phaser.GameObjects.GameObject, model:any )
  {
    this.add( view )
    this.things.push( {view:view,model:model})
  }

  initNextStage()
  {
    if ( !this.game || !this.game.over )
      return
    if ( this.game.victory )
      this.session.next()
    else
      this.session.reset()
  }

  buildWorld()
  {
    for (let thing of this.things) thing.view.destroy()

    let g = this.session.currentGame

    for ( let model of g.tiles )
      this.addThing( this.scene.add.image( 0, 0, 'tile' )
                    .setScale( .55 )
                    .setRotation(Phaser.Math.FloatBetween(-.05,.05))
                    .setTint( Phaser.Display.Color.HSLToColor(
                                .1, Math.random()*.25, 
                                Phaser.Math.FloatBetween(.85, 1) ).color )
                    , model )

    for ( let model of g.bots )
      this.addThing( this.scene.add.image( 0, 0, 'bot' )
                    .setScale( .6 )
                    .setTint( Phaser.Display.Color.HSLToColor( 
                                Phaser.Math.FloatBetween( 0, 1 ), 
                                Math.random() * .25,
                                Phaser.Math.FloatBetween( .85, 1 ) ).color )
                    , model )

    let p = this.scene.add
      .sprite(0, 0, "player")
      .setScale(0.6)
      // .setTint(0x00ffff)
    p.anims.load( "player-idle" )
    p.anims.play( "player-idle" )
    this.addThing( p, g.player )

    this.zone.setSize( this.game.W * 70, this.game.H * 70 )
            

    let scale = window.innerWidth / ( this.game.W * 70 + 200 )
    console.log( window.innerWidth, this.game.W * 70 )
    this.setScale( scale )
  }

  useSkill( skill:Skill )
  {
    this.session.useSkill( skill )
  }

  moveMayBe( dx: number, dy: number )
  {
    if ( this.game.over )
      return
    let x = this.game.player.tile.x
    let y = this.game.player.tile.y
    let next = this.game.getTile( x + dx, y + dy )
    if ( next )
    {
      this.game.moveTo( next )
      this.game.endTurn()
    }
  }

  ///

  onKeyDown( e: KeyboardEvent )
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
      if ( e.code === "KeyC" || e.code === "Numpad3" ) this.moveMayBe(1, 1)
      if ( e.code === "Backquote" || e.code === "NumpadAdd" )      this.useSkill( this.session.skills[ 0 ] )
      if ( e.code === "Digit1"    || e.code === "NumpadDivide" )   this.useSkill( this.session.skills[ 1 ] )
      if ( e.code === "Digit2"    || e.code === "NumpadMultiply" ) this.useSkill( this.session.skills[ 2 ] )
      if ( e.code === "Digit3"    || e.code === "NumpadSubtract" ) this.useSkill( this.session.skills[ 3 ] )
      if ( e.code === "Enter"     || e.code === "NumpadEnter" )    this.useSkill( this.session.skills[ 4 ] )
      if ( e.code === "KeyF" ) document.documentElement.requestFullscreen()
    }
    else
      this.initNextStage()
  }
}

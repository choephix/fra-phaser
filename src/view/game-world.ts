import { Skill, SkillBook } from "../game/skills"
import { Game } from "../game/game"
import { GameSession } from "../game/game-session"
import { TouchController } from "./ctrl";
import { GameEvent } from "src/game/events";
import { GameWorldView } from "./game-world-view";
import { ControllerSprite } from "./ctrl-view";

export class GameWorld
{
  session: GameSession
  ctrl: TouchController

  view: GameWorldView
  ctrlSprite:ControllerSprite

  get game(): Game { return this.session ? this.session.currentGame : null }

  private zone: Phaser.GameObjects.Image

  constructor( public scene:Phaser.Scene, private stageWidth:number, x:number, y:number )
  {
    this.view = new GameWorldView( this.scene, x, y )
    this.view.addBackground()
    this.scene.add.existing( this.view )

    this.ctrl = new TouchController( ( x, y ) => this.moveMayBe( x, y ) )

    this.zone = this.scene.add.image( 0, 0, "tile" )
    this.zone
      .setAlpha( .01 )
      // .setTintFill( 0x0 )
      .setScale( 7, 7 )
      .setInteractive( { useHandCursor: true } )
      .on( "pointerdown", e => this.ctrl.start( e.x, e.y ) )
      .on( "pointermove", e => this.ctrl.move( e.x, e.y ) )
      .on( "pointerup", e => this.ctrl.end() )
      .on( "pointerdown", e => { if ( this.game.over ) this.initNextStage() } )
    this.view.add( this.zone )

    this.session = new GameSession
    this.session.events.on( GameEvent.GAMESTART, () => this.buildWorld() )
    this.session.events.on( GameEvent.CHANGE, () => this.onAnyChange() )
    this.session.events.on( GameEvent.BOTDIE, (bot,collision) => 
    {
      
      this.scene.time.delayedCall(150+Math.random()*100, () => {
        if ( collision )
        {
          let x = bot.tile.x + Phaser.Math.FloatBetween( -.5, .5 )
          let y = bot.tile.y + Phaser.Math.FloatBetween( -.5, .5 )
          this.view.shockwave( x, y, 2.0 )
          this.view.boom( x,y )
        }
        else
        {
          let x = bot.tile.x
          let y = bot.tile.y
          this.view.shockwave( x, y, 0.5 )
        }
      }, [], this )
    } )
    this.session.reset()

    let skills = SkillBook.makeSkillList()
    for ( let si in skills )
    {
      let label = skills[ si ].icon + " " + skills[ si ].name
      let button:Phaser.GameObjects.Text;
      let x = 50, y = 100 + si * 25
      button = this.scene.add.text( x, y, label, { fill: '#Ff0' } )
      button.setInteractive( { useHandCursor: true } )
      button.on( 'pointerdown', () => this.useSkill( this.session.skills[ si ] ) )
            .on( 'pointerover', () => button.setStyle( { fill: "#FFF" } ) )
            .on( 'pointerout', () => button.setStyle( { fill: "#Ff0" } ) )
    }

    this.ctrlSprite = new ControllerSprite( this.scene, this.ctrl )
  }

  onAnyChange()
  {
    let tweens = this.scene.tweens
    let view = this.view
    function tweenMove( thing, x, y, delay = 0 )
    {
      return tweens.add( {
        targets: thing,
        x: view.getActorX( x ),
        y: view.getActorY( y ),
        delay: delay,
        duration: 100
      } )
    }
    function tweenFadeOut( thing, delay = 0 )
    {
      return tweens.add( {
        targets: thing,
        alpha: 0,
        delay: delay,
        duration: 100
      } )
    }
    function tweenFall( thing, delay=0 )
    {
      return tweens.add( {
        targets: thing,
        y: "+=100",
        alpha: 0,
        delay: delay,
        duration: 200,
      } )
    }
    function dist( a, b ):number
    {
      return Math.max( Math.abs(a.x-b.x), Math.abs(a.y-b.y) )
    }

    tweenMove( this.view.player, this.game.player.tile.x, this.game.player.tile.y )
    if ( this.game.player.dead && !this.view.player.dead )
      tweenFadeOut( this.view.player )

    let pt = this.game.player.tile

    for ( let bot of this.view.bots )
    {
      let bt = bot.model.tile
      let delay = 100 + dist(pt,bt) * 50 + Math.random() * 50
      this.scene.time.delayedCall( delay, () =>
      {
        tweenMove( bot, bot.model.tile.x, bot.model.tile.y )
        if ( bot.model.dead && !bot.dead )
        {
          bot.dead = true
          this.scene.time.delayedCall( 100, () => tweenFall( bot ), null, this )
        }
      }, null, this )
    }

    for ( let tile of this.view.tiles )
    {
      if ( tile.model.busted && !tile.busted )
      {
        tile.busted = true
        let delay = 150 + dist( pt, tile.model ) * 50
        tweenFall( tile, delay )
      }
    }
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
    this.view.purgeAllThings()
    this.view.game = this.game


    this.zone = this.scene.add.image( 0, 0, "tile" )
    this.zone
      .setAlpha( .01 )
      // .setTintFill( 0x0 )
      .setScale( 7, 7 )
      .setInteractive( { useHandCursor: true } )
      .on( "pointerdown", e => this.ctrl.start( e.x, e.y ) )
      .on( "pointermove", e => this.ctrl.move( e.x, e.y ) )
      .on( "pointerup", e => this.ctrl.end() )
      .on( "pointerdown", e => { if ( this.game.over ) this.initNextStage() } )
    this.view.add( this.zone )

    this.view.addBackground()

    let g = this.session.currentGame

    for ( let model of g.tiles )
      this.view.addTile( model )

    for ( let model of g.bots )
      this.view.addBot( model )

    this.view.addPlayer( g.player )

    this.zone.setSize( this.game.W * 70, this.game.H * 70 )

    let scale = this.stageWidth / ( this.game.W * 70 + 200 )
    this.view.setScale( scale )
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
}

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
  private tScore: Phaser.GameObjects.Text

  constructor( public scene: Phaser.Scene, private stageWidth: number, private stageHeight: number, x:number, y:number )
  {
    let ts_style = { 
      fill: "white", 
      font: "7.5em Verdana",
      stroke: "#000B",
      strokeThickness: "8",
      textAnchor: "middle",
      dominantBaseline: "middle",
    }
    this.tScore = this.scene.add.text( stageWidth * .5, stageHeight * .15, "-", ts_style )
    this.tScore.setOrigin( .05, .05 )

    this.zone = this.scene.add.image( x, y, "c1" )
    this.zone
      .setAlpha( .01 )
      .setScale( 1.2, .8 )
      .setInteractive( { useHandCursor: true } )
      .on( "pointerdown", e => this.ctrl.start( e.x, e.y ) )
      .on( "pointermove", e => this.ctrl.move( e.x, e.y ) )
      .on( "pointerup",   e => this.ctrl.end() )
      .on( "pointerdown", e => { if ( this.game.over ) this.initNextStage() } )

    this.view = new GameWorldView( this.scene, x, y )
    this.view.addBackground()
    this.scene.add.existing( this.view )

    this.ctrl = new TouchController( ( x, y ) => this.moveMayBe( x, y ) )

    this.session = new GameSession
    this.session.events.on( GameEvent.GAMESTART, () => this.buildWorld() )
    this.session.events.on( GameEvent.CHANGE, () => this.onAnyChange() )
    this.session.reset()

    let skills = SkillBook.makeSkillList()
    for ( let si in skills )
    {
      let label = skills[ si ].icon
      let button:Phaser.GameObjects.Text;
      let x = ( stageWidth / ( skills.length+1) ) * ( 1 + parseInt(si) )
      let y = stageHeight - 100
      button = this.scene.add.text( x, y, label, { fill: '#Ff0', font: '10em Verdana' } ).setOrigin(0.5,0.5)
      button.setInteractive( { useHandCursor: true } )
      button.on( 'pointerdown', () => this.useSkill( this.session.skills[ si ] ) )
    }

    this.ctrlSprite = new ControllerSprite( this.scene, this.ctrl )
  }

  onTurnEnd()
  {

  }

  onAnyChange()
  {
    let tweens = this.scene.tweens
    let view = this.view
    function tweenMove( thing, x, y, delay = 0 )
    {
      let randX = Phaser.Math.FloatBetween( -6, 6 )
      let randY = Phaser.Math.FloatBetween( -4, 8 )
      x = view.getActorX( x )+randX
      y = view.getActorY( y )+randY
      if ( dist(thing,{x:x,y:y}) < 20 )
        return
      // thing.anims.play()
      return tweens.add( {
        targets: thing,
        x: x, y: y, 
        delay: delay,
        duration: 100,
        // onComplete:()=>{
        //   if ( thing.anims.currentAnim.key.includes('idle') )
        //     thing.anims.stop()
        // }
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
      this.view.player.setState_FALL()

    let pt = this.game.player.tile

    for ( let bot of this.view.bots )
    {
      if ( bot.model.dead && bot.dead )
        continue

      let bt = bot.model.tile
      let delay = 100 + dist(pt,bt) * 50 + Math.random() * 50
      this.scene.time.delayedCall( delay, () =>
      {
        let freeze = bot.model.stunned || this.game.frozenTurns > 0

        if ( !bot.frozen && freeze )
          bot.setState_FROZEN()

        if ( bot.frozen && !freeze )
            bot.setState_IDLE()

        tweenMove( bot, bot.model.tile.x, bot.model.tile.y )
        if ( bot.model.dead && !bot.dead )
        {
          bot.dead = true
          bot.setState_FALL()
          this.scene.time.delayedCall( 100, () => {
            let x = bot.model.tile.x
            let y = bot.model.tile.y
            if ( bot.model.exploded )
            {
              x += Phaser.Math.FloatBetween( -.5, .5 )
              y += Phaser.Math.FloatBetween( -.5, .5 )
              this.view.shockwave( x, y, 2.0 )
              this.view.boom( x,y )
              this.view.quake = 4
            }
            else
            {
              this.view.shockwave( x, y, 0.75, .075 )
            }
          }, null, this )
        }
      }, null, this )
    }

    for ( let tile of this.view.tiles )
    {
      if ( tile.model.busted && !tile.busted )
      {
        tile.busted = true
        let delay = 200 + dist( pt, tile.model ) * 50
        tweenFall( tile, delay )
      }
    }

    this.tScore.text = this.session.score.toString()
    // this.tScore.setOrigin( .05, .05 )
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
    this.view.addBackground()

    let g = this.session.currentGame

    for ( let model of g.tiles )
      this.view.addTile( model )

    for ( let model of g.bots )
      this.view.addBot( model )

    this.view.addPlayer( g.player )

    this.zone.setSize( this.game.W * 70, this.game.H * 70 )

    let scale = this.stageWidth / ( this.game.W * 70 + 105 )
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

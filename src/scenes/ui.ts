import { App } from "src/app";
import { SkillBook } from "src/game/skills";
import { ControllerSprite } from "src/view/ctrl-view";

export class UIScene extends Phaser.Scene
{
  private tLevel: Phaser.GameObjects.Text
  private tScore: ScoreText

  create()
  {
    let cam = this.cameras.main

    this.tLevel = this.add.text( cam.centerX, cam.height * .07, "L" )
    this.tLevel.setOrigin(0.5)
    this.tLevel.setFontSize(128)
    this.tLevel.setFontFamily("IMPACT")
    this.tLevel.setColor("white")
    this.tLevel.setStroke("#000B", 8)

    this.tScore = new ScoreText( this )
    this.tScore.setPosition( cam.centerX, cam.height * .17 )
    this.tScore.setStroke( "#000B", 8 )
    this.tScore.setFontSize( 48 )
    this.tScore.setOrigin( 0.5 )
    this.tScore.setFontStyle("bold")
    this.game.events.on( "score_change", ( score: number ) => this.tScore.setValue( score ) )

    let skills = SkillBook.makeSkillList()
    for ( let si in skills )
    {
      let label = skills[ si ].icon
      let button: Phaser.GameObjects.Text;
      let x = ( cam.width / ( skills.length + 1 ) ) * ( 1 + parseInt( si ) )
      let y = cam.height - 100
      button = this.add.text( x, y, label, { fill: '#Ff0', font: '10em Verdana' } ).setOrigin( 0.5, 0.5 )
      button.setInteractive( { useHandCursor: true } )
      button.on( 'pointerdown', () => this.game.input.events.emit( "skill", si ) )
    }

    new ControllerSprite( this, App.ctrl )

    this.tScore.text = window.devicePixelRatio.toString()
  }
}

class ScoreText extends Phaser.GameObjects.Text
{
  private _value:number = 0
  public get value(): number { return this._value }
  public set value( v: number )
  {
    this._value = v
    this.text = v > 0 ? Math.floor( v ).toString() : 'O'
    // this.x = this.scene.cameras.main.centerX - this.width * .05
  }
  
  constructor( scene )
  {
    super( scene, 0, 0, "", { fill: "white" } )
    this.scene.add.existing( this )
    this.setValue( 0 )
  }

  setValue( value:number ):void
  {
    this.scene.tweens.add( { 
      targets: this, 
      value: value, 
      duration: 330,
    } )
  }
}

export class ContinueSplashScene extends Phaser.Scene
{
  create()
  {
  }
}

export class GameOverSplashScene extends Phaser.Scene
{
  private tScore: Phaser.GameObjects.Text

  create()
  {
  }
}

import { App } from "src/app";
import { SkillBook } from "src/game/skills";
import { ControllerSprite } from "src/view/ctrl-view";

export class UIScene extends Phaser.Scene
{
  private title: Phaser.GameObjects.Image
  private tScore: ScoreText

  create()
  {
    let cam = this.cameras.main

    this.title = this.add.image( 0, 0, "logo" )
    this.title.x = cam.centerX
    this.title.y = cam.height * 0.08

    this.tScore = new ScoreText( this )
    this.tScore.setPosition( cam.centerX, cam.height * .15 )
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
    this.text = Math.floor( v ).toString()
    this.x = this.scene.cameras.main.centerX - this.width * .05
  }
  
  constructor( scene )
  {
    super( scene, 0, 0, "", {
      fill: "white",
      font: "7.5em Verdana",
      stroke: "#000B",
      strokeThickness: "8",
      textAnchor: "middle",
      dominantBaseline: "middle",
    } )
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

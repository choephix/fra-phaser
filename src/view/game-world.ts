import { App, BackgroundScene } from 'src/app';
import { DebugKeyboardController } from 'src/debug/debug-ctrl';
import { GameEvent } from 'src/game/events';
import { Game } from '../game/game';
import { GameSession } from '../game/game-session';
import { GameWorldView } from './game-world-view';
import { GameWorldEffects } from './effects';

export class GameWorld {
  // session: GameSession

  view: GameWorldView;

  get session(): GameSession {
    return App.gameplay;
  }
  get game(): Game {
    return this.session ? this.session.currentGame : null;
  }

  get touch_zome() {
    return (<BackgroundScene>this.scene.scene.get('bg')).img;
  }

  constructor(
    public scene: Phaser.Scene,
    private stageWidth: number,
    private stageHeight: number,
    x: number,
    y: number
  ) {
    this.touch_zome
      .setInteractive({ cursor: 'move' })
      .on('pointerdown', e => {
        if (this.session.ingame) App.ctrl.start(e.x, e.y);
      })
      .on('pointermove', e => App.ctrl.move(e.x, e.y))
      .on('pointerup', e => App.ctrl.end());
    this.touch_zome.on('pointerdown', e => {
      if (this.game.over) this.initNextStage();
    });

    this.view = new GameWorldView(this.scene, x, y);
    this.view.addBackground();
    this.scene.add.existing(this.view);

    // this.session = new GameSession
    App.gameplay.events.on(GameEvent.GAMESTART, () => this.buildWorld());
    App.gameplay.events.on(GameEvent.CHANGE, () => this.onAnyChange());
    App.gameplay.events.on(GameEvent.DECOYDIE, d =>
      GameWorldEffects.poof({
        x: this.view.decoy.x,
        y: this.view.decoy.y,
        // scale: 1.0,
        // alpha: .75,
        // delay: 250,
        scene: this.scene,
        container: this.view,
      })
    );
    // this.session.reset()

    this.scene.game.input.events.on('move', (x, y) => this.moveMayBe(x, y));
    this.scene.game.input.events.on('skill', (index: number) =>
      this.session.useSkill(this.session.skills[index])
    );
  }

  onTurnEnd() {}

  onAnyChange() {
    let tweens = this.scene.tweens;
    let view = this.view;
    function tweenMove(thing, x, y, delay = 0) {
      let randX = Phaser.Math.FloatBetween(-6, 6);
      let randY = Phaser.Math.FloatBetween(-4, 8);
      x = view.getActorX(x) + randX;
      y = view.getActorY(y) + randY;
      if (dist(thing, { x: x, y: y }) < 20) return;
      // thing.anims.play()
      return tweens.add({
        targets: thing,
        x: x,
        y: y,
        delay: delay,
        duration: 100,
        // onComplete:()=>{
        //   if ( thing.anims.currentAnim.key.includes('idle') )
        //     thing.anims.stop()
        // }
      });
    }
    function tweenFall(thing, delay = 0) {
      return tweens.add({
        targets: thing,
        y: '+=100',
        alpha: 0,
        delay: delay,
        duration: 200,
      });
    }
    function dist(a, b): number {
      return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
    }

    tweenMove(this.view.player, this.game.player.tile.x, this.game.player.tile.y);
    if (this.game.player.dead && !this.view.player.dead) this.view.player.setState_FALL();

    let pt = this.game.decoy.active ? this.game.decoy.tile : this.game.player.tile;

    for (let bot of this.view.bots) {
      if (bot.model.dead && bot.dead) continue;

      let bt = bot.model.tile;
      let delay = 100 + dist(pt, bt) * 60 + Math.random() * 40;
      this.scene.time.delayedCall(
        delay,
        () => {
          let freeze = bot.model.stunned || this.game.frozenTurns > 0;

          if (!bot.frozen && freeze) bot.setState_FROZEN();

          if (bot.frozen && !freeze) bot.setState_IDLE();

          tweenMove(bot, bot.model.tile.x, bot.model.tile.y);
          if (bot.model.dead && !bot.dead) {
            bot.dead = true;
            let x = bot.model.tile.x;
            let y = bot.model.tile.y;
            this.scene.time.delayedCall(
              100,
              () => {
                if (bot.model.exploded) {
                  tweens.killTweensOf(bot);
                  bot.setState_BOOM();
                  this.view.quake += 2;
                } else {
                  bot.setState_FALL();
                }
              },
              null,
              this
            );
          }
        },
        null,
        this
      );
    }

    for (let tile of this.view.tiles) {
      if (tile.model.busted && !tile.busted) {
        tile.busted = true;
        let delay = 200 + dist(pt, tile.model) * 50;
        tweenFall(tile, delay);
      }
    }

    this.scene.game.events.emit('score_change', this.session.score);
  }

  initNextStage() {
    if (!this.game || !this.game.over) return;
    if (this.game.victory) this.session.next();
    else this.session.reset();
  }

  buildWorld() {
    this.view.purgeAllThings();
    this.view.game = this.game;
    this.view.addBackground();

    let g = this.session.currentGame;

    for (let model of g.tiles) this.view.addTile(model);

    for (let model of g.bots) this.view.addBot(model);

    this.view.addPlayer(g.player);

    let scale = this.stageWidth / (this.game.W * 70 + 105);
    this.view.setScale(scale);
  }

  moveMayBe(dx: number, dy: number) {
    if (this.game.over) return;
    let x = this.game.player.tile.x;
    let y = this.game.player.tile.y;
    let next = this.game.getTile(x + dx, y + dy);
    if (next) {
      this.game.moveTo(next);
      this.game.endTurn();
    }
  }
}

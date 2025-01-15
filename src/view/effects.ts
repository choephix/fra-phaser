export class GameWorldEffects {
  public static shockwave(params: {
    x;
    y;
    scale;
    alpha;
    scene;
    delay?;
    container?;
  }) {
    let wave = params.scene.add
      .sprite(params.x, params.y, "wave")
      .setRotation(2.0 * Math.PI * Math.random())
      .setScale(0.05 * params.scale)
      .setAlpha(params.alpha);
    params.scene.tweens.add({
      targets: wave,
      onComplete: () => wave.destroy(),
      scaleX: params.scale,
      scaleY: params.scale,
      alpha: 0,
      ease: "Quad.easeOut",
      delay: params.delay,
      duration: 500,
    });
    if (params.container) params.container.add(wave);
  }

  public static boom(params: { x; y; scene; container? }) {
    let boom = params.scene.add.sprite(params.x, params.y, "boom");
    boom.setRotation(2.0 * Math.PI * Math.random());
    boom.setScale(1.0);
    boom.anims.load("boom");
    boom.anims.play("boom");
    boom.on("animationcomplete", () => boom.destroy());
    if (params.container) params.container.add(boom);
  }

  public static poof(params: { x; y; scene; container? }) {
    let boom: Phaser.GameObjects.Sprite = params.scene.add.sprite(
      params.x,
      params.y,
      "poof",
    );
    // boom.setRotation( 2.0 * Math.PI * Math.random() )
    boom.setScale(2.0);
    boom.setTintFill(0xffffff);
    boom.anims.load("poof");
    boom.anims.play("poof");
    boom.on("animationcomplete", () => boom.destroy());
    if (params.container) params.container.add(boom);
  }
}

import Phaser from "phaser";
import { processPlatformCollision } from "../fn/collision";

export class LootItem extends Phaser.Physics.Arcade.Sprite {
  private itemBody!: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, ground: Phaser.Physics.Arcade.StaticGroup[]) {
    super(scene, x, y, texture);
    scene.physics.world.enable(this);
    scene.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setCollideWorldBounds(true);
    body.onWorldBounds = true;

    body.setAllowGravity(true);
    body.setVelocityY(-400)
    this.itemBody = body

    // Listen for collision with the ground
    this.scene.physics.add.collider(this, ground, this.onTouchGround, processPlatformCollision, this); // assuming 'scene.ground' is your ground layer

    // Set any specific physics or display properties
    this.setInteractive();  // Make it interactive if needed
  }

  public static preload(load: Phaser.Loader.LoaderPlugin) {
    load.image('lootTexture', 'images/mesobag.png');
  }

  onTouchGround(): void {
    // Disable further collisions, gravity and start bobbing
    this.itemBody.setAllowGravity(false);
    this.itemBody.setVelocityY(0); // Stop any downward motion
    this.createBobbingEffect();
  }

  createBobbingEffect(): void {
    this.scene.tweens.add({
      targets: this,
      y: this.y - 10,  // Move up by 10 pixels
      ease: 'Sine.inOut',  // Smooth sine wave motion
      duration: 1000,  // 1000 milliseconds for one cycle
      yoyo: true,  // Move back to original position
      repeat: -1  // Repeat forever
    });
  }
}


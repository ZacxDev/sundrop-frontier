import Phaser from 'phaser';
import { LootItem } from './LootItem';

export class Enemy extends Phaser.GameObjects.Sprite {
  speed: number;
  private stunned: boolean = false;
  private healthBarBackground!: Phaser.GameObjects.Graphics;
  private healthBarFill!: Phaser.GameObjects.Graphics;
  private totalHealth!: number;
  private currentHealth!: number;
  private entityBody!: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody;
  private onDie: (e: Enemy) => void;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, speed: number, health: number, onDie: (e: Enemy) => void) {
    super(scene, x, y, texture);
    this.speed = speed;
    scene.physics.world.enable(this);
    this.setData('type', 'enemy')
    this.onDie = onDie

    if (!this.body) {
      console.error('missing body')
      return
    }

    const body = this.body as Phaser.Physics.Arcade.Body
    this.entityBody = body

    // Enable physics on the enemy
    scene.physics.world.enable(this);
    body.setVelocityX(this.speed); // Move right initially

    // Set the enemy to be collidable with the world bounds and to check for world bounds collision
    body.setCollideWorldBounds(true);
    body.onWorldBounds = true;

    this.totalHealth = health;
    this.currentHealth = health;

    // Create health bar
    this.healthBarBackground = scene.add.graphics();
    this.healthBarFill = scene.add.graphics();
    this.updateHealthBar();

    scene.add.existing(this);
  }

  public static preload(load: Phaser.Loader.LoaderPlugin) {
    load.image('enemy', 'images/green-snail-sprite.png');
  }

  update() {
    if (!this.body) {
      console.error('missing body')
      return
    }

    const body = this.body as Phaser.Physics.Arcade.Body
    // Change direction upon hitting the world's edge
    if (body.blocked.right || body.blocked.left) {
      this.speed = -this.speed;
      body.setVelocityX(this.speed);
    }
  }

  takeDamage(damage: number): void {
    const body = this.body as Phaser.Physics.Arcade.Body

    this.currentHealth -= damage;

    body.setVelocityX(100 * (this.flipX ? 1 : -1)); // Knockback effect

    this.stunned = true;
    this.scene.time.delayedCall(200, () => this.stunned = false, [], this); // Stun for 200ms

    this.updateHealthBar();

    if (this.currentHealth <= 0) {
      this.die();
    }
  }

  updateHealthBar(): void {
    // Clear the old graphics
    this.healthBarBackground.clear();
    this.healthBarFill.clear();

    // Position the health bar above the enemy
    const barWidth = 40;
    const barHeight = 5;

    // Draw the background
    this.healthBarBackground.fillStyle(0xffffff); // black
    this.healthBarBackground.fillRect(-1, -1, barWidth + 2, barHeight + 2);

    // Draw the fill
    const healthPercentage = Math.max(this.currentHealth / this.totalHealth, 0);
    this.healthBarFill.fillStyle(0xff0000); // red
    this.healthBarFill.fillRect(0, 0, barWidth * healthPercentage, barHeight);
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    this.updateHealthBarPosition();
  }

  updateHealthBarPosition(): void {
    // Update the health bar position to follow the enemy
    const offsetX = 0;
    const offsetY = -this.entityBody.height;

    this.healthBarBackground.x = this.x + offsetX;
    this.healthBarBackground.y = this.y + offsetY;
    this.healthBarFill.x = this.x + offsetX;
    this.healthBarFill.y = this.y + offsetY;
  }

  die(): void {
    // Remove enemy sprite after death
    this.healthBarBackground.destroy();  // Assuming there's a health bar
    this.healthBarFill.destroy();
    //this.disableBody(true, true);

    // Delay the spawning of a LootItem
    this.scene.time.delayedCall(200, () => {
      this.onDie(this)
      this.destroy()
    }, [], this);
  }
}


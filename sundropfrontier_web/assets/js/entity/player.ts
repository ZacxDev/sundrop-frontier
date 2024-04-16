import Phaser from "phaser";
import { Enemy } from "./enemy";

interface CustomCursorKeys {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
}

const playerMaxInAirVelocity = 250
const playerInAirAcceleration = 10
const playerJumpXVelocityPenaltyMultiplier = 0.75
const playerJumpYInitialVelocity = -930

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors: CustomCursorKeys;
  private spaceBar: Phaser.Input.Keyboard.Key;
  private attackKey: Phaser.Input.Keyboard.Key;
  private lastAttackTime: number = 0;
  private attackCooldown: number = 300;
  private playerBody!: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, cursors: CustomCursorKeys, spaceBar: Phaser.Input.Keyboard.Key, attackKey: Phaser.Input.Keyboard.Key) {
    super(scene, x, y, texture);
    scene.physics.world.enable(this);
    scene.add.existing(this);

    this.cursors = cursors;
    this.spaceBar = spaceBar;
    this.attackKey = attackKey;

    this.setBounce(0, 0.2);

    const body = this.body as Phaser.Physics.Arcade.Body
    if (this.body) {
      this.playerBody = body
      this.playerBody.setCollideWorldBounds(true);
      this.playerBody.onWorldBounds = true;
    }
  }

  update(): void {
    if (this.playerBody.touching.down) {
      this.setVelocityX(0);
      this.handleGroundMovement();
    } else {
      this.handleAirMovement();
    }

    if (Phaser.Input.Keyboard.JustDown(this.spaceBar) && this.playerBody.touching.down) {
      this.jump();
    }

    if (Phaser.Input.Keyboard.JustDown(this.attackKey) && this.scene.time.now > this.lastAttackTime + this.attackCooldown) {
      this.attack();
    }
  }

  private handleGroundMovement(): void {
    if (this.cursors.left.isDown) {
      this.setVelocityX(-320);
      this.flipX = true;
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(320);
      this.flipX = false;
    }
  }

  private handleAirMovement(): void {
    const playerVelX = this.playerBody.velocity.x;
    if (this.cursors.left.isDown) {
      this.setVelocityX(Math.max(playerVelX - playerInAirAcceleration, -playerMaxInAirVelocity));
      this.flipX = true;
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(Math.min(playerVelX + playerInAirAcceleration, playerMaxInAirVelocity));
      this.flipX = false;
    }
  }

  private jump(): void {
    this.setVelocityY(playerJumpYInitialVelocity);
    this.setTexture('playerJumping');
    if (this.playerBody.velocity.x !== 0) {
      this.setVelocityX(this.playerBody.velocity.x * playerJumpXVelocityPenaltyMultiplier);
    }
  }

  private attack(): void {
    //this.play('attackAnimation'); // Make sure this animation is loaded and created
    this.lastAttackTime = this.scene.time.now;

    // Check for enemies in range and in front
    const hitRange = 50; // pixels
    const hitDirection = this.flipX ? -1 : 1; // Determines the direction to check based on facing
    const enemies = this.scene.physics.overlapRect(this.x + hitDirection * hitRange, this.y, hitRange, this.height);

    enemies.forEach(s => {
      if (s.gameObject.getData('type') === 'enemy') {
        const enemy = s.gameObject as Enemy
        enemy.takeDamage(40); // Example damage value
      }
    });
  }
}


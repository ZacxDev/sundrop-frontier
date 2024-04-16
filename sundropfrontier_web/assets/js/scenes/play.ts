import Phaser from "phaser";
import { Enemy } from "../entity/enemy"; // Update the path as needed
import { Player } from "../entity/player";
import { Inventory } from "../state/inventory";
import { LootItem } from "../entity/LootItem";
import { processPlatformCollision } from "../fn/collision";

interface CustomCursorKeys {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
}

export class PlayGameScene extends Phaser.Scene {
  private player!: Player;
  private enemy!: Enemy;
  private inventory!: Inventory;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private keyE!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'PlayGameScene' });
  }

  preload() {
    this.load.image('background', 'images/background.webp');
    this.load.image('player', 'images/test-sprite.png');
    this.load.image('playerJumping', 'images/test-sprite.png');
    this.load.image('platform', 'images/grass-tile-0.png');
    this.load.image('ground', 'images/grass-tile-0.png');

    Enemy.preload(this.load)
    LootItem.preload(this.load)
  }

  create() {
    const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;

    if (!this.input.keyboard) {
      throw new Error('no keyboard')
    }

    this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    const cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as CustomCursorKeys;

    const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    const ctrlKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL)

    this.player = new Player(this, 400, 300, 'player', cursors, spaceKey, ctrlKey);

    this.inventory = new Inventory(this.scene, this.keyE);

    // Platforms
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, 'platform').setScale(2).refreshBody();
    this.platforms.create(500, 668, 'platform').setScale(2).refreshBody();
    this.platforms.create(600, 768, 'platform').setScale(2).refreshBody();
    this.platforms.create(700, 900, 'platform').setScale(2).refreshBody();

    // Colliders
    this.physics.add.collider(this.player, this.platforms, undefined, processPlatformCollision);

    // ground
    /*
    let ground = this.physics.add.staticGroup();
    let groundSprite = ground.create(0, (this.game.config.height as number) - 20, 'ground').setOrigin(0, 1).refreshBody();
    groundSprite.displayWidth = this.game.config.width;
    groundSprite.refreshBody()
    */

    const gameWidth = this.sys.game.config.width as number;
    const gameHeight = this.sys.game.config.height as number;
    const ground = this.add.tileSprite(0, gameHeight - 50, gameWidth, 28, 'ground').setOrigin(0, 0);
    this.physics.add.existing(ground, true);

    // Enable collision between the player and the ground
    this.physics.add.collider(this.player, ground);

    // Enable collision detection with the world bounds
    this.physics.world.setBoundsCollision(true, true, true, true);

    new LootItem(this, 1000, 800, 'lootTexture', [ground, this.platforms]);

    this.enemy = new Enemy(this, 100, 100, 'enemy', 100, 100, (e) => {
      new LootItem(this, e.x, e.y - 50, 'lootTexture', [ground, this.platforms]);
    });
    this.physics.add.collider(this.enemy, ground);
    this.physics.add.collider(this.enemy, this.platforms, undefined, processPlatformCollision);

  }

  update() {
    this.player.update();
    //this.enemy.update();
    this.inventory.update();
  }
}


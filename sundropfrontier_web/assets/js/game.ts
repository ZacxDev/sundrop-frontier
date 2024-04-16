import Phaser from "phaser";
import { PlayGameScene } from "./scenes/play";
import { InventoryScene } from "./scenes/inventory";

export const WORLD_WIDTH = 1440
export const WORLD_HEIGHT = 1080

var config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: WORLD_WIDTH,
  height: WORLD_HEIGHT,
  scene: [PlayGameScene, InventoryScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 2500, x: 0 },
      debug: false
    }
  },
};

var game = new Phaser.Game(config);

window.onkeydown = function (key) {
  if (key.ctrlKey == true) {
    key.preventDefault()
  }
};


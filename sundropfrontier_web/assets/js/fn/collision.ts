import Phaser from "phaser";

export const processPlatformCollision: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = function (obj, platform) {
  const entity = obj as Phaser.Physics.Arcade.Sprite;
  if (!entity.body) {
    return false;
  }

  const plat = platform as Phaser.Physics.Arcade.Sprite;
  if (!plat.body) {
    return false;
  }

  if (entity.body.velocity.y > 0 && entity.y + entity.height / 2 < plat.y) {
    return true; // Only allow collision when player is falling down onto the platform
  }
  return false; // No collision otherwise
};


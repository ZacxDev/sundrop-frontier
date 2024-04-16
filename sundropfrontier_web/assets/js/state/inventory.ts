import Phaser from "phaser";

export class Inventory {
  private scene: Phaser.Scenes.ScenePlugin;
  private visible: boolean = false;
  private keyE!: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scenes.ScenePlugin, keyE: Phaser.Input.Keyboard.Key) {
    this.scene = scene;
    this.keyE = keyE
  }

  update(): void {
    if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
      this.toggle();
    }
  }

  toggle(): void {
    if (this.visible) {
      this.scene.stop('InventoryScene');
    } else {
      const inventoryItems = this.getItems();
      this.scene.launch('InventoryScene', inventoryItems);
    }
    this.visible = !this.visible;
  }

  private getItems(): InventoryItem[] {
    return [
      { title: "Sword", quantity: 1, description: "A sharp blade." },
      { title: "Potion", quantity: 5, description: "Heals 20 HP." }
      // More items...
    ];
  }
}

interface InventoryItem {
  title: string;
  quantity: number;
  description: string;
}


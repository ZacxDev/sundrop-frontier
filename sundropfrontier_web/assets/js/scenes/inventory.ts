import Phaser from "phaser";

type InventoryItem = {
  title: string;
  description: string;
  quantity: number;
}

export class InventoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'InventoryScene' });
    }

    create(inventoryItems: InventoryItem[]) {
        // Semi-transparent overlay
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.5).setOrigin(0);

        const startX = 100;
        const startY = 100;
        const itemWidth = 100;
        const itemHeight = 50;

        // Display inventory items in a grid
        inventoryItems.forEach((item, index) => {
            const x = startX + (index % 5) * (itemWidth + 10); // 5 items per row
            const y = startY + Math.floor(index / 5) * (itemHeight + 10);

            // Item background
            this.add.rectangle(x, y, itemWidth, itemHeight, 0xffffff).setOrigin(0);

            // Item title and quantity
            this.add.text(x + 5, y + 5, `${item.title} (${item.quantity})`, {
                fontSize: '16px',
                color: '#000'
            });
        });

    }
}


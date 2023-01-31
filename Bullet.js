class Bullet extends PIXI.Container {
  constructor(tankRotation) {
    super();
    this.speed = 25;
    this.dead = false;
    this.enemy;
    this.tankRotation = tankRotation;
    this.createChildren();
  }

  createChildren() {
    const circle = new PIXI.Graphics();
    circle.lineStyle(0);
    circle.beginFill(0xde3249, 1);
    circle.drawCircle(0, 0, 5);
    circle.endFill();
    this.addChild(circle);
  }

  bulletsColission() {
    if (this.y - this.height < this.parent.y) {
      this.dead = true;
    }
    if (this.y + this.height > 800) {
      this.dead = true;
    }
    if (this.x - this.width < this.parent.x) {
      this.dead = true;
    }
    if (this.x + this.width > 1024) {
      this.dead = true;
    }
  }

  onTick() {
    this.position.x += Math.sin(this.tankRotation) * this.speed;
    this.position.y -= Math.cos(this.tankRotation) * this.speed;
    this.bulletsColission();
  }
}

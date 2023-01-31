class Enemy extends PIXI.Container {
  constructor(mainTankPosition) {
    super();
    this.mainTankPosition = mainTankPosition;
    this.enemyBody = null;
    this.enemyTower = null;
    this.rightToLeft = true;

    this.createChildren();
  }

  createChildren() {
    const bodyTexture = new PIXI.Texture(
      PIXI.Loader.shared.resources['enemyBody'].texture
    );

    bodyTexture.frame = new PIXI.Rectangle(0, 0, 128, 128);
    this.enemyBody = new PIXI.Sprite(bodyTexture);
    this.enemyBody.anchor.set(0.5);

    const towerTexture = new PIXI.Texture(
      PIXI.Loader.shared.resources['enemyTower'].texture
    );

    towerTexture.frame = new PIXI.Rectangle(0, 0, 128, 128);
    this.enemyTower = new PIXI.Sprite(towerTexture);
    this.enemyTower.anchor.set(0.5);

    this.addChild(this.enemyBody, this.enemyTower);
  }

  move(leftWall = 0, rightWall = 1024) {
    const speed = 4;
    if (this.rightToLeft === true) {
      this.x -= speed;
      this.enemyBody.rotation = (3 * Math.PI) / 2;
      if (this.x - this.width / 2 < leftWall) {
        this.rightToLeft = !this.rightToLeft;
      }
    }
    if (this.rightToLeft === false) {
      this.x += speed;
      this.enemyBody.rotation = Math.PI / 2;
      if (this.x + this.width / 2 > rightWall) {
        this.rightToLeft = !this.rightToLeft;
      }
    }
  }

  toAim() {
    const dist_X = this.mainTankPosition.x - this.position.x;
    const dist_Y = this.mainTankPosition.y - this.position.y;
    const angle = Math.atan2(dist_Y, dist_X);
    this.enemyTower.rotation = angle + Math.PI / 2;
  }

  onHit() {
    console.log('hit');
    this.visible = false;
  }

  onTick() {
    if (!this.visible) return;
    this.move();
    this.toAim();
  }
}

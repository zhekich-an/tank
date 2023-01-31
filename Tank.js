class Tank extends PIXI.Container {
  constructor() {
    super();
    this.body = null;
    this.tower = null;
    this.createChildren();
    this.subscribe();
  }

  createChildren() {
    this.body = new PIXI.Sprite(PIXI.Loader.shared.resources['body'].texture);
    this.body.anchor.set(0.5);

    const towersTexture = [];
    const posOfImages = [0, 128, 256, 384, 512, 640, 768, 896];
    for (let i = 0; i < posOfImages.length; i++) {
      const towerTexture = new PIXI.Texture(
        PIXI.Loader.shared.resources['tower'].texture
      );
      towerTexture.frame = new PIXI.Rectangle(posOfImages[i], 0, 128, 128);
      towersTexture.push(towerTexture);
    }
    this.tower = new PIXI.AnimatedSprite(towersTexture);
    this.tower.loop = false;
    this.tower.anchor.set(0.5);

    this.addChild(this.body, this.tower);

    this.tower.onComplete = () => this.afterShot();
  }

  subscribe() {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyZ') this.rotateTower('left');
      if (e.code === 'KeyC') this.rotateTower('right');
      if (e.code === 'KeyX') this.rotateTower('startPos');

      if (e.code === 'ArrowUp') this.move('up');
      if (e.code === 'ArrowDown') this.move('down');
      if (e.code === 'ArrowLeft') this.move('left');
      if (e.code === 'ArrowRight') this.move('right');

      if (e.code === 'Space') this.shot();
    });
  }

  rotateTower(direction) {
    if (direction === 'left') this.tower.rotation += -0.1;
    if (direction === 'right') this.tower.rotation += 0.1;
    if (direction === 'startPos') this.tower.rotation = this.body.rotation;
  }

  move(direction) {
    const speed = 10;
    const rotateTower = this.tower.rotation === this.body.rotation;
    if (direction === 'up') {
      this.body.rotation = 0;
      this.position.y -= speed;
    }
    if (direction === 'down') {
      this.body.rotation = Math.PI;
      this.position.y += speed;
    }
    if (direction === 'left') {
      this.body.rotation = (3 * Math.PI) / 2;
      this.position.x -= speed;
    }
    if (direction === 'right') {
      this.body.rotation = Math.PI / 2;
      this.position.x += speed;
    }

    if (rotateTower) this.tower.rotation = this.body.rotation;

    this.wallsColission(this, {
      x: 0,
      y: 0,
      width: 1024,
      height: 800,
    });
  }

  wallsColission(tank, container) {
    if (tank.y - tank.height / 2 < container.y) {
      tank.y = container.y + tank.height / 2;
    }

    if (tank.y + tank.height / 2 > container.height) {
      tank.y = container.height - tank.height / 2;
    }

    if (tank.x - tank.width / 2 < container.x) {
      tank.x = container.x + tank.width / 2;
    }

    if (tank.x + tank.width / 2 > container.width) {
      tank.x = container.width - tank.width / 2;
    }
  }

  shot() {
    if (this.tower.playing) return;
    this.tower.gotoAndPlay(0);
  }

  afterShot() {
    this.emit('generate-bullet');
  }

  onTick(delta) {}
}

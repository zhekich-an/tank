class Game {
  constructor() {
    this.app = null;
    this.tank = null;
    this.enemy = null;
    this.bullets = [];
    this.createGame();
  }

  createGame() {
    this.app = new PIXI.Application({
      width: 1024,
      height: 800,
      antialias: true,
      transparent: false,
      resolution: 1,
      backgroundColor: 0xc2c2c2,
    });

    document.body.appendChild(this.app.view);

    PIXI.Loader.shared
      .add('body', 'assets/Purple/Bodies/body_tracks.png')
      .add('tower', 'assets/Purple/Weapons/turret_01_mk1.png')
      .add('enemyBody', 'assets/Red/Bodies/body_halftrack.png')
      .add('enemyTower', 'assets/Red/Weapons/turret_01_mk2.png')
      .load(() => this.onLoad());
  }

  onLoad() {
    this.createChild();
    this.subscribe();
    this.app.ticker.add((delta) => this.onTick(delta));
  }

  createChild() {
    this.tank = this.app.stage.addChild(new Tank());
    this.tank.position.set(512, 400);

    this.enemy = this.app.stage.addChild(new Enemy(this.tank.position));
    this.enemy.position.set(512, 200);

    const line = this.app.stage.addChild(new PIXI.Graphics());

    line.lineStyle({ width: 20, color: 0x7d7d7d, alpha: 1 });
    line.moveTo(0, 5);
    line.lineTo(1019, 5);
    line.lineTo(1019, 795);
    line.lineTo(5, 795);
    line.lineTo(5, 5);
  }

  subscribe() {
    this.tank.on('generate-bullet', this.onShot, this);
  }

  onShot() {
    const bullet = this.app.stage.addChildAt(
      new Bullet(this.tank.tower.rotation),
      0
    );
    bullet.position.set(this.tank.x, this.tank.y);
    this.bullets.push(bullet);
    console.log(this.bullets);
  }

  collision() {
    this.bullets.forEach((element) => {
      const vx = this.enemy.position.x - element.position.x;
      const vy = this.enemy.position.y - element.position.y;
      if (Math.abs(vx) < this.enemy.width / 4) {
        if (Math.abs(vy) < this.enemy.height / 4) {
          this.enemy.onHit();
          element.dead = true;
        }
      }
    });
  }

  onTick(delta) {
    this.collision();
    this.tank.onTick(delta);
    this.enemy.onTick(delta);
    this.bullets = this.bullets.filter((element) => {
      element.onTick(delta);
      if (element.dead) {
        this.app.stage.removeChild(element);
      }
      return !element.dead;
    });
  }
}

const game = new Game();

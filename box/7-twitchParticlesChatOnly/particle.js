class Particle {
  constructor(x, y, m, c) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(5);
    this.acc = createVector(0, 0);
    this.mass = m;
    this.color = c;
    this.r = sqrt(this.mass) * 2;
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  show() {
    noStroke();
    this.color ? fill(this.color) : fill(this.pos.x/2, this.mass, this.pos.y/2);
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }
}
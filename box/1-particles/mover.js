class Mover {
  constructor(x, y, m) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(5);
    this.acc = createVector(0, 0);
    this.mass = m;
    this.r = sqrt(this.mass) * 4;
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass * 2.5);
    this.acc.add(f);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  show() {
    noStroke();
    fill(this.pos.x*360/windowWidth, this.mass*360, this.pos.y*360/windowHeight);
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }
}
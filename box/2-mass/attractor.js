class Attractor {
  
  constructor(x,y,m) {
    this.pos = createVector(x,y);
    this.mass = m;
    this.r = sqrt(this.mass)*2;
  }
  
  attract(mover) {
    let force = p5.Vector.sub(this.pos, mover.pos);
    let distanceSq = constrain(force.magSq(), 100, 1000);
    let G = 10;
    let strength = G * (this.mass * mover.mass) / distanceSq;
    force.setMag(strength);
    mover.applyForce(force);
  }
  
  
  show() {
    noStroke();
    fill(0,0,50,50);
    ellipse(this.pos.x, this.pos.y, this.r*2);    
  }
}
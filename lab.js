/* eslint-disable no-undef, no-unused-vars */

let numBalls = 100;
let spring = 0;
let gravity = 1;
let balls = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < numBalls; i++) {
    balls[i] = new Ball(
      random(10),
      random(10),
      random(30, 70),
      i,
      balls
    );
  }
  noStroke();
}

function draw() {
  background(0);
  textSize(100);
  text('Lab', width/2-100, height/2-100);
  fill(0, 102, 153);
  balls.forEach(ball => {
    ball.collide();
    ball.move();
    ball.display();
  });
}

class Ball {
  constructor(xin, yin, din, idin, oin) {
    this.x = xin;
    this.y = yin;
    this.vx = 0;
    this.vy = 0;
    this.diameter = din;
    this.id = idin;
    this.others = oin;
    this.color = [0, 0, 255, 255];
    this.friction = 0.1;
  }

  collide() {
    for (let i = this.id + 1; i < numBalls; i++) {
      let dx = this.others[i].x - this.x;
      let dy = this.others[i].y - this.y;
      let distance = sqrt(dx * dx + dy * dy);
      let minDist = this.others[i].diameter / 2 + this.diameter / 2;
      if (distance < minDist) {
        let angle = atan2(dy, dx);
        let targetX = this.x + cos(angle) * minDist;
        let targetY = this.y + sin(angle) * minDist;
        let ax = (targetX - this.others[i].x) * random(0.2, 1);
        let ay = (targetY - this.others[i].y) * random(0.2, 1);
        this.vx -= ax;
        this.vy -= ay;
        this.others[i].vx += ax;
        this.others[i].vy += ay;

        this.diameter+=1
        this.others[i].diameter-=1
      }
    }
  }

  move() {
    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;
    if (this.x + this.diameter / 2 > width) {
      this.x = width - this.diameter / 2;
      this.vx *= this.friction;
    } else if (this.x - this.diameter / 2 < 0) {
      this.x = this.diameter / 2;
      this.vx *= this.friction;
    }
    if (this.y + this.diameter / 2 > height) {
      this.y = height - this.diameter / 2;
      this.vy *= this.friction;
    } else if (this.y - this.diameter / 2 < 0) {
      this.y = this.diameter / 2;
      this.vy *= this.friction;
    }
    if(this.diameter <= 1){
      this.diameter = 1
      this.color[0]+=10
    }
    if(this.diameter > 50){
      this.diameter = 20
      this.color[2]-=10
      this.color[1]+=10
      //this.friction=+0.1
    }
  }

  display() {
    fill(...this.color);
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }
}


function mousePressed() {
  numBalls++;
  balls.push(new Ball(mouseX, mouseY, random(30, 70), numBalls, balls));
}


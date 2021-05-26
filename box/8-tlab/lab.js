/* eslint-disable no-undef, no-unused-vars */

let spring = 0
let gravity = 1
let balls = []
let up
let collides = 0
let level = [true]
let cycle = 0

// Query params
const params = new URLSearchParams(location.search)
const chan = params.get('chan')
let size = params.get('size') || 10

function setup() {
  createCanvas(windowWidth, windowHeight)
  for (let i = 0; i < balls.length; i++) {
    balls[i] = new Ball(
      random(10),
      random(10),
      random(30, 70),
      i,
      balls
    )
  }
  noStroke()
  chat(chan)
}

function draw() {
  background(0)
  textSize(100)
  text('Lab', width/2-100, height/2-100)
  textSize(10)
  text('Endless game', width/2-10, height/2-90)
  textSize(20)
  text(`Gravity : ${gravity.toFixed(1)}`,30,30)
  if(level[1]) text(`Collides : ${collides}`,30,60)
  if(level[2]) text(`Cycle : ${cycle}`,30,90)
  fill(0, 102, 153)
  balls.forEach(ball => {
    ball.collide()
    ball.move()
    ball.display()
  })
}

class Ball {
  constructor(xin, yin, din, idin, oin, c) {
    this.x = xin
    this.y = yin
    this.vx = 0
    this.vy = 0
    this.diameter = din
    this.id = idin
    this.others = oin
    this.color = c || [0, 0, 255, 255]
    this.friction = 0.1
    if(balls.length === 0) {
      cycle++
    }
  }

  collide() {
    for (let i = this.id + 1; i < balls.length; i++) {
      let dx = this.others[i].x - this.x
      let dy = this.others[i].y - this.y
      let distance = sqrt(dx * dx + dy * dy)
      let minDist = this.others[i].diameter / 2 + this.diameter / 2
      if (distance < minDist) {
        let angle = atan2(dy, dx)
        let targetX = this.x + cos(angle) * minDist
        let targetY = this.y + sin(angle) * minDist
        let ax = (targetX - this.others[i].x) * random(0.2, 1)
        let ay = (targetY - this.others[i].y) * random(0.2, 1)
        this.vx -= ax
        this.vy -= ay
        this.others[i].vx += ax
        this.others[i].vy += ay

        this.diameter+=1
        this.others[i].diameter-=1
        if(collides>= 10000){
          level[2]=true
          this.others[i].color[3]--
          if(this.others[i].color[3] === 0) {
            balls.splice(i, 1)
          }
        }
      }
    }
  }

  move() {
    this.vy += gravity
    this.x += this.vx
    this.y += this.vy
    if (this.x + this.diameter / 2 > width) {
      this.x = width - this.diameter / 2
      this.vx *= this.friction
    } else if (this.x - this.diameter / 2 < 0) {
      this.x = this.diameter / 2
      this.vx *= this.friction
    }
    if (this.y + this.diameter / 2 > height) {
      this.y = height - this.diameter / 2
      this.vy *= this.friction
    } else if (this.y - this.diameter / 2 < 0) {
      this.y = this.diameter / 2
      this.vy *= this.friction
    }
    if(this.diameter <= 1){
      this.diameter = 1
      //this.color[0]+=10
    }
    if(this.diameter > 50){
      this.diameter = 20
      //this.color[2]-=10
      //this.color[1]+=10
      if(gravity>1){
        up = true
      }else if(gravity<-1) {
        up = false
        level[1]=true
      }
      up ? gravity-=0.1 : gravity+=0.1
      collides++
    }
  }

  display() {
    fill(this.color)
    ellipse(this.x, this.y, this.diameter, this.diameter)
  }
}


function mousePressed() {
  balls.push(new Ball(mouseX, mouseY, random(30, 70), balls.length, balls))
}

function hexToRgb(hex) {
  if(!hex) return
  hex = hex.replace('#', '')
  const bigint = parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return [r, g, b, 255]
}

function chat(key) {
  const client = new tmi.Client({
    channels: [ key ]
  })
  client.connect()
  client.on('message', (channel, tags, message, self) => {
    balls.push(new Ball(width/2, height/2, random(30, 70), balls.length, balls, hexToRgb(tags['color'])))
  })
}

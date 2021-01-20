/* eslint-disable no-undef, no-unused-vars */
let blue, white, grey, cube, bgb

function setup() {
  createCanvas(windowWidth, windowHeight)
  blue=color(0,102,153)
  white=color(200,200,300)
  grey=color(50,100,30)
  bgb = 120
  Cube = function () {
    this.r = 1
    this.g = 100
    this.b = 1
    this.ySpeed = 1
    this.xSpeed = 1
    this.size = 30
    this.x = 0
    this.y = 0
    this.charge = true
    this.move = () => {
      this.x += this.xSpeed
      if (this.charge) {
        this.y += this.ySpeed
      } else {
        this.y -= this.ySpeed
      }
      if (this.x > windowWidth + this.size) {
        this.x = 0 - this.size
      } if (this.y > windowHeight + this.size) {
        this.y = 0 - this.size
      } if (this.x < 0 - this.size) {
        this.x = windowWidth
      } if (this.y < 0 - this.size) {
        this.y = windowHeight
      }
    }
    this.display = () => {
      rect(this.x, this.y, this.size, this.size)
      fill(cube.r, cube.g, cube.b)
      this.move()
    }
    this.spin = () => {
      this.charge = !this.charge
    }
    return this
  }
  cube = Cube()
}

function mouseClicked() {
  //cube.spin()
  bgb = random(255)
  this.r = random(255)
  this.xSpeed = (mouseX - windowWidth / 2) / 10
  this.ySpeed = (mouseY - windowHeight / 2) / 10
}

function draw() {
  background(120, 120, bgb, 10)
  cube.display()
  rect(windowWidth/2 - 1, windowHeight / 2 - 1, 3, 3)
}

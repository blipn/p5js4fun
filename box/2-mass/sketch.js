const time = []
time.movers = []
time.attractors = []

function setup() {
  createCanvas(windowWidth, windowHeight)
  attractors.push(new Attractor(width / 2, height / 2, 10))
  for (let i = 0; i < 200; i++) {
    let x = random(width/2.2, width/1.8)
    let y = random(height/2.2, height/1.8)
    let m = random(0.1, 1)
    time.movers[i] = new Mover(x, y, m)
  }
  background(0)
}

function draw() {
  background(0,0,0,255)
  for (let mover of time.movers) {
    mover.update()
    mover.show()
    attractors.forEach(a => a.attract(mover))
  }
  attractors.forEach(a => a.show())

  saveFrame()
  if (mouseIsPressed) {
    shift(2)
  }
}

// for time

function saveFrame() {
  this.time.push(frame)
}

function shift(count) {
  this.time.splice(-1, count)
}
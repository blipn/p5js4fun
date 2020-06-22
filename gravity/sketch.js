let movers = [];
let attractors = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  attractors.push(new Attractor(width / 2, height / 2, 10));
  for (let i = 0; i < 500; i++) {
    let x = random(width/2.2, width/1.8);
    let y = random(height/2.2, height/1.8);
    let m = random(0.1, 1);
    movers[i] = new Mover(x, y, m);
  }
  background(0);
}

function draw() {
  background(0,0,0,40);
  for (let mover of movers) {
    mover.update();
    mover.show();
    attractors.forEach(a => a.attract(mover))
  }
  if (mouseIsPressed) {
    attractors[1] = new Attractor(mouseX, mouseY, 8)
  }
  attractors.forEach(a => a.show())
}
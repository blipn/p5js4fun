let movers = [];
let attractors = [];
let reflect = 50

function setup() {
  createCanvas(windowWidth, windowHeight);
  attractors.push(new Attractor(width / 2, height / 2, 10));
  for (let i = 0; i < 1000; i++) {
    let x = random(width/2.0001, width/1.999);
    let y = random(height/2.0001, height/1.999);
    let m = random(0.1, 0.2);
    movers[i] = new Mover(x, y, m);
  }
  background(0);
}

function draw() {
  background(0,0,0,reflect);
  for (let mover of movers) {
    mover.update();
    mover.show();
    attractors.forEach(a => a.attract(mover))
  }
  if (mouseIsPressed) {
    attractors[0] = new Attractor(mouseX, mouseY, 10)
  }
  // attractors.forEach(a => a.show())
}
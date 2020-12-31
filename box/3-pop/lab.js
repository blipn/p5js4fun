/* eslint-disable no-undef, no-unused-vars */
let blue, white, grey

function setup() {
  createCanvas(windowWidth, windowHeight)
  blue=color(0,102,153)
  white=color(200,200,300)
  grey=color(50,100,30)
}

function draw() {
  let cx = width/2
  let cy = height/2
  background(0)

  
  cx = cx-200+(deltaTime*5)
  cy = cy+(deltaTime*5*(Math.random()/5)/2)

  for (let i = -5; i < 5; i++) {
    rect(cx+i*6+i,cy+i*6+i,6,-(6+i*60))
    rect(cx+i*6+i+200,cy+i*6+i,6,(6+i*50))
  }
  fill(1/deltaTime*3000,10,10)

  noStroke()
  ellipse(cx+100,cy,100)
  fill(white)
  

  textSize(200)
  text('Lab', cx-60, height/2-100)
  textSize(40)
  text('Endless Game', width/2-80, height/2-50)
  fill(0,1/deltaTime*2000,1/deltaTime*3000)
}

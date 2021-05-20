let particles = []
let attractors = []
let alpha = 0
let defaultMsgColor = 'grey'

// Settings (ex: ?chan=someone&size=20&bg=255)
let bgColor = 0 // background greyscale (0-255) - ?bg
let size = 12 // message size - ?size
let max = 1 // max particle size - ?max
let min = 0.1 // min particle size - ?min
let timeout = 60 // particle timeout - ?t
let maxParticles = 1000 // max ammount of particles (+1000 could lag) - ?p
let aFactor = 10 // alpha factor - ?a

// Elements
const loginForm = document.getElementById('login')
const output = document.getElementById('output')

// Query params
const params = new URLSearchParams(location.search)
bgColor = parseInt(params.get('bg')) || bgColor
size = parseInt(params.get('size')) || size
max = parseInt(params.get('max')) || max
min = parseInt(params.get('min')) || min
timeout = parseInt(params.get('t')) || timeout
maxParticles = parseInt(params.get('p')) || maxParticles
aFactor = parseFloat(params.get('a')) || aFactor
const chan = params.get('chan')
if(chan) {
  loginForm.style.display = 'none'
  chat({user_login: chan})
}

// Functions
function setup() {
  createCanvas(windowWidth, windowHeight)
  attractors.push(new Attractor(width / 2, height / 2, 6))
  for (let i = 0; i < 1; i++) {
    popOne()
  }
  background(0)
}

function draw() {
  if(alpha < 255) {alpha += aFactor / 1000 * (particles.length)}
  background(bgColor,alpha)
  for (let particle of particles) {
    particle.update()
    particle.show()
    attractors.forEach(a => a.attract(particle))
  }
  if (mouseIsPressed) {
    attractors[1] = new Attractor(mouseX, mouseY, 6)
  }
  // attractors.forEach(a => a.show())
}

function popOne(mass, color) {
  if(particles.length >= maxParticles) return
  let x = random(width/2.2, width/1.8)
  let y = random(height/2.2, height/1.8)
  let m = mass || random(min, max)
  particles.push(new Particle(x, y, m, color))
  alpha =  255 / (particles.length * 50) 
}

function removeOne() {
  particles.splice(0,1)
}
loginForm.onsubmit = (event) => {
  event.preventDefault()
  const inputs = loginForm.elements
  const settings = {}
  Array.from(inputs).forEach((item)=>{
      if(item.type === 'submit') {
        item.disabled = true
      } else if (item.nodeName === 'INPUT') {
        settings[item.name] = item.value
      }
  })
  chat(settings)
}

function chat(settings) {
  const client = new tmi.Client({
    channels: [ settings.user_login ]
  })
  client.connect()
  client.on('message', (channel, tags, message, self) => {
    console.log(tags)
    console.log(`${tags['display-name']}: ${message}`)
    popOne(null, tags['color'])

    textSize(size)
    fill(tags['color'] || defaultMsgColor)
    text(`${tags['display-name']}: ${message}`, random(10, width/2), random(10, height-10))

    setTimeout(()=>{
      removeOne()
    }, timeout * 1000)    
  })
}

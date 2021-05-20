let movers = []
let attractors = []
let alpha = 0
let defaultMsgColor = 'grey'
const maxMovers = 1000

// Settings (ex: ?chan=someone&size=20&bg=255)
let bgColor = 0 // background greyscale (0-255) - ?bg
let size = 12 // message size - ?size
let max = 1 // max particle size - ?max
let min = 0.1 // min particle size - ?min

// Elements
const loginForm = document.getElementById('login')
const output = document.getElementById('output')

// Query params
const params = new URLSearchParams(location.search)
bgColor = parseInt(params.get('bg')) || bgColor
size = parseInt(params.get('size')) || size
max = parseInt(params.get('max')) || max
min = parseInt(params.get('min')) || min
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
  if(alpha < 255) {alpha += 0.002 * (movers.length)}
  background(bgColor,alpha)
  for (let mover of movers) {
    mover.update()
    mover.show()
    attractors.forEach(a => a.attract(mover))
  }
  if (mouseIsPressed) {
    attractors[1] = new Attractor(mouseX, mouseY, 6)
  }
  // attractors.forEach(a => a.show())
}

function popOne(mass, color) {
  if(movers.length >= maxMovers) return
  let x = random(width/2.2, width/1.8)
  let y = random(height/2.2, height/1.8)
  let m = mass || random(min, max)
  movers.push(new Mover(x, y, m, color))
  alpha =  255 / (movers.length * 50) 
}

function removeOne() {
  movers.splice(0,1)
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
    }, 60000)    
  })
}

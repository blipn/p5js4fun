let movers = []
let attractors = []
let reflect = 0
const maxMovers = 1000

function setup() {
  createCanvas(windowWidth, windowHeight)
  attractors.push(new Attractor(width / 2, height / 2, 10))
  for (let i = 0; i < 1; i++) {
    popOne()
  }
  background(0)
}

function draw() {
  background(0,0,0,reflect)
  for (let mover of movers) {
    mover.update()
    mover.show()
    attractors.forEach(a => a.attract(mover))
  }
  // if (mouseIsPressed) {
  //   attractors[1] = new Attractor(mouseX, mouseY, 2)
  // }
  attractors.forEach(a => a.show())
}

function popOne(mass, color) {
  if(movers.length >= maxMovers) return
  let x = random(width/2.2, width/1.8)
  let y = random(height/2.2, height/1.8)
  let m = mass || random(0.1, 1)
  movers.push(new Mover(x, y, m, color))
  reflect = (movers.length + 10) / 5
}

function removeOne() {
  movers.splice(0,1)
  reflect = (movers.length + 2) / 5
}

const loginForm = document.getElementById('login')
const output = document.getElementById('output')
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

  const client = new tmi.Client({
    channels: [ settings.user_login ]
  })
  client.connect()
  client.on('message', (channel, tags, message, self) => {
    console.log(tags)
    console.log(`${tags['display-name']}: ${message}`)
    if(message === '!more') {
      popOne(random(1, 8), tags['color'])
    } else if(message === '!less') {
      removeOne()
    } else {
      reflect += 10
    }
  })

  run(settings, (chan)=>{
    output.innerText = `${chan.user_name} : ${chan.viewer_count}`
    console.log(chan)
  })
}

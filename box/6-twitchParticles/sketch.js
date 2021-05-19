let movers = [];
let attractors = [];
let reflect = 0
const maxMovers = 1000

function setup() {
  createCanvas(windowWidth, windowHeight);
  attractors.push(new Attractor(width / 2, height / 2, 10));
  for (let i = 0; i < 1; i++) {
    popOne()
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
    attractors[1] = new Attractor(mouseX, mouseY, 2)
  }
  attractors.forEach(a => a.show())
}

function popOne() {
  if(movers.length >= maxMovers) return
  let x = random(width/2.2, width/1.8);
  let y = random(height/2.2, height/1.8);
  let m = random(0.1, 1);
  movers.push(new Mover(x, y, m));
  reflect = movers.length / 5
}

function removeOne() {
  movers.splice(0,1)
  reflect = movers.length / 5
}

const loginForm = document.getElementById('login')
loginForm.onsubmit = (event) => {
  event.preventDefault()
  const inputs = loginForm.elements
  const settings = {}
  Array.from(inputs).forEach((item)=>{
      if(item.nodeName === 'INPUT' && item.type !== 'submit') {
        settings[item.name] = item.value
      }
  })
  run(settings)
}

// TWITCH LOGIN 
function run(s) {
  fetch(`https://id.twitch.tv/oauth2/token?client_id=${s.client_id}&client_secret=${s.client_secret}&grant_type=client_credentials`, {
    method: 'post',
  }).then(function(response) {
    return response.json()
  }).then(function(data) {
    console.log(data)

    // GET STREAMS
    var myHeaders = new Headers()
    myHeaders.append("Client-ID", s.client_id)
    myHeaders.append("Authorization", `Bearer ${data.access_token}`)
    var myInit = { method: 'GET',
                  headers: myHeaders,
                  mode: 'cors',
                  cache: 'default' }

    fetch(s.user_login ? `https://api.twitch.tv/helix/streams?user_login=${s.user_login}` : 'https://api.twitch.tv/helix/streams',myInit)
    .then(function(response) {
      return response.json()
    })
    .then(function(json) {
      const chan = json.data[0]
      console.log(chan.user_login)
      console.log(chan.title)
      console.log(chan.id)
      console.log(chan.game_name)
      console.log(chan.viewer_count)

      while(movers.length < maxMovers && chan.viewer_count > movers.length) {
        popOne()
      }

      // LET's update viewers
      setInterval(()=>{
        fetch(`https://api.twitch.tv/helix/streams?user_login=${s.user_login || chan.user_login}`,myInit)
        .then(function(response) {
          return response.json()
        })
        .then(function(json) {
          const viewers = json.data[0].viewer_count
          console.log(viewers)
          while(movers.length < maxMovers && viewers > movers.length) {
            popOne()
          }
          while(movers.length >= 1 && viewers < movers.length) {
            removeOne()
          }
        })
      }, 30000) // 30s refresh

    })

  })
}


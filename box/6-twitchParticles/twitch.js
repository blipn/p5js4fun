function run(s, done) {
    // LOGIN 
    fetch(`https://id.twitch.tv/oauth2/token?client_id=${s.client_id}&client_secret=${s.client_secret}&grant_type=client_credentials`, {
      method: 'post',
    }).then((response) => {
      return response.json()
    }).then((data) => {
      console.log(data)
  
      // GET STREAM
      var myHeaders = new Headers()
      myHeaders.append("Client-ID", s.client_id)
      myHeaders.append("Authorization", `Bearer ${data.access_token}`)
      var myInit = { method: 'GET',
                    headers: myHeaders,
                    mode: 'cors',
                    cache: 'default' }
  
      fetch(s.user_login ? `https://api.twitch.tv/helix/streams?user_login=${s.user_login}` : 'https://api.twitch.tv/helix/streams',myInit)
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        while(movers.length < maxMovers && json.data[0].viewer_count > movers.length) {
          popOne()
        }
        done(json.data[0])
  
        // LET's update viewers
        setInterval(()=>{
          fetch(`https://api.twitch.tv/helix/streams?user_login=${s.user_login || chan.user_login}`,myInit)
          .then((response) => {
            return response.json()
          })
          .then((json) => {
            const viewers = json.data[0].viewer_count
            console.log(viewers)
            while(movers.length < maxMovers && viewers > movers.length) {
              popOne()
            }
            while(movers.length >= 1 && viewers < movers.length) {
              removeOne()
            }
            done(json.data[0])
          })
        }, 30000) // 30s refresh
  
      })
  
    })
  }
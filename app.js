const fs = require('fs');
const http = require('http');

let endpoint = 'http://192.168.1.71:3003/Dealers'

function changeEndpoint () {
  const actualHours = new Date().getHours()
  // if ( actualHours >= 14 ) endpoint = 'http://sadpagos.ddns.net:3003/Dealers'
  endpoint = actualHours >= 14
    ? 'http://sadpagos.ddns.net:3003/Dealers'
    : 'http://192.168.1.71:3003/Dealers'
}

changeEndpoint()

var request = () => http.get(endpoint, (resp) => {
  let data = '';
  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    // console.log(JSON.parse(data));
    changeEndpoint()
    let data = { "date": (new Date).toString(), "online": true, endpoint }
    fs.appendFile('onlineOffline.json', JSON.stringify(data) + '\n', 'utf8', (err) => {
      if (err) throw err;
    })
  });
  
}).on("error", (err) => {
  changeEndpoint()
  let data = { "online": false, "date": (new Date).toString(), endpoint }
  fs.appendFile('onlineOffline.json', JSON.stringify(data) + '\n', 'utf8', (err) => {
    if (err) throw err;
  })
})

setInterval ( request, 600000 );

var ifs = require('os').networkInterfaces();
const WebSocket = require('ws'); 
const wss = new WebSocket.Server({ port: 3623 });

var result = Object.keys(ifs)
  .map(x => ifs[x].filter(x => x.family === 'IPv4' && !x.internal)[0])
  .filter(x => x)[0].address;
  
 
//Sendig API Address to client 
  wss.on('connection', async function connection(ws) {
    try {
    ws.send(result);
    }
    catch (error){
      console.log(error)
    }
  
  });
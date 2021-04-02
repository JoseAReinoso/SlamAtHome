//Import dependencies
const SerialPort = require('serialport')
const Readline = require ("@serialport/parser-readline")
var net = require('net');
var server = net.createServer()
let scaleOutput = ""
let manualInput = ""
let switcher = ""
//Turning on the get UsersIPaddress script
require('./pageActions/usersIPaddress')

//******************************************************************** */
//Second server to communicate with UI
//******************************************************************** */
const WebSocket = require('ws');
// Set up server
const wss = new WebSocket.Server({ port: 8080 });


// Wire up some logic for the connection event (when a client connects) 

  wss.on('connection', async function connection(ws) {
    try {
  
        // Wire up logic for the message event (when a client sends something)
      ws.on('message', function incoming(message) {
      manualInput = message
    });
  
    // Send a message
    ws.send(scaleOutput);
  
    }
    catch (error){
      console.log(error)
    }
  
  });


//-------------------------Listening to my scale starts here -------------------------------------//
//defining the serial port

const comPort = new SerialPort("COM20" , {
    baudRate: 9600,
    dataBits:7,
    parity:"even",
    stopBits:1
})
//Handling error if COM20 is not active on the users PC
comPort.on('error', function(error){
console.log("User Does not have COM20 active= ",error)
})

//the serial port parser
const SerialPortparser = new Readline ();

comPort.pipe(SerialPortparser);

let socket = null
//Automatic console.log("Coming form the scale",`S S ${line.slice(10,17)}\r\n`)
//Manual `S S 0.68 kg\r\n`

SerialPortparser.on("data", async (line) =>  { 
    
  try{
    if (socket){
      await socket.write(`S S ${line.slice(10,17)}\r\n`)
      switcher = ""
      socket = null
    }

    
  }  
  catch(error){
    console.log(error.message)
  }

  } ) 

  //Function to handle no scale at 
  async function manual(data){
    try{
      if(manualInput === "Manual"){
        manualInput = 1
        switcher = "Manual"
      }
      else{
        await socket.write(`S S ${Number(manualInput).toFixed(2)} lb\r\n`)
        console.log(`S S ${Number(manualInput).toFixed(2)} lb\r\n`)
      }

    }catch(error){
      console.log(error.error)
    }
  }


  /*      console.log(`Coming from Scale: S S ${line.slice(10,17)}\r\n`)
      scaleOutput = `${line.slice(10,17)}s`
      console.log("coming from scaleOUtput: ",scaleOutput) */

//-------------------------------Listening to PORT 87 Starts here -----------------------------------------------------//

//this will help receive connection from shipApp
server.on('connection', async function (data) {
  socket = data

  try {
   data.on("data", (data2) => {

    if(manualInput === "Scale"){
      console.log("Coming from ShippApp using scale",data2.toString())
      comPort.write(data2.toString())
    }

    else if (manualInput === "Manual" || switcher === "Manual" ){
      console.log("Coming from ShippApp using manual",data2.toString())
      manual(data2.toString())
    }else {
      console.log("Check your conditionals, something is not working on line 111")
    }

       })    
} 
  catch (error) {
      console.log(error.message)
  }
})


//listening to port 87 coming through the client (in this case, the shipApp)
server.listen(87,"0.0.0.0", function () {
    console.log("server listening to 87 port")
})

//in case there is an error on the conection, this will trigger 
server.on("error", function (error) {
  console.log("Error from net server = ",error.error)
})


let manualMode = document.querySelector("#Manual");
let scaleMode = document.querySelector("#Scale")
let enterWeight = document.querySelector(".enterWeight")
let weightInput = document.querySelector(".weightValue")
let WeightSubmitted = document.querySelector(".WeightSubmitted")
let WeightScale = document.querySelector(".WeightScale")
let WeightScaleDiv = document.querySelector(".WeightScaleDiv")
let ipAddressSelector = document.querySelector(".ipAddress")
let ErrorP = document.querySelector(".ErrorP")
// Create WebSocket connection.
const socket = new WebSocket('ws://localhost:8080');
const socket2 = new WebSocket('ws://localhost:3623');

let scaleWeight = null

socket2.onmessage = e => {
    let ipAddress = e.data.toString()
    ipAddressSelector.textContent = `Your IP Address: ${ipAddress}`
    
    if(ipAddress.slice(0,3) === "192"){
    ErrorP.textContent = `ATTENTION: Your VPN did not generate a correct IP Address, Please click the HELP Button on top and see the "Fixing your IP" section. Thanks`
    }
    else if(ipAddress.slice(0,3) === "11."){
        ErrorP.textContent = `ATTENTION: You are currently not signed in to a VPN connection, Please close this App, start your VPN connection and re-Open this App. Thanks`
    }
}

// Connection opened
socket.addEventListener('open', function (event) {
    socket.send('Hello Server!');
});

// Listen for messages
socket.addEventListener('message', async function (event) {
     scaleWeight = await event.data
    
     console.log("from here=",scaleWeight)
});

function manualModeFunc () {
    enterWeight.style.display = "inline";
    WeightScaleDiv.style.display ="none";
    socket.send("Manual")

}

function ScaleModeFunc () {
    enterWeight.style.display = "none";
    WeightScaleDiv.style.display ="inline";
    WeightSubmitted.textContent = "";
    socket.send("Scale")
}

function weightEntered () {
    let weightValue = weightInput.value
    console.log("before erasing", weightValue)
    weightInput.value = ""
    WeightSubmitted.textContent = `Weight entered = ${weightValue}lbs. Please proceed with next steps on the ShipApp`
    socket.send(weightValue);
}

manualMode.addEventListener("input",manualModeFunc)
scaleMode.addEventListener("input",ScaleModeFunc )






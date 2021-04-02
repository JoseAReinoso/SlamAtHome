const {app, BrowserWindow} = require('electron')
require('./mainServer')

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width:1200,
        height:1200,
        webPreferences:{
          contextIsolation:true
        },
        icon:'slamlogoforico.ico'
    })
    mainWindow.loadFile('index.html')
    //This will setup main window to null, helping to trigger window-all-closed condition
    mainWindow.on('closed', function() {
        mainWindow = null
      })   
     //Prevent users to make it full screen
      mainWindow.on('maximize', () => {
        mainWindow.unmaximize()
      });
          
}

app.on('ready',createWindow)

//when all windows are detected closed this will stop server.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
        ;
      }
  })


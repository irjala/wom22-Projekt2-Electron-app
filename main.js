// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const fetch = require('electron-fetch').default

// Skapa en klass av den
const Store = require('electron-store')
const store = new Store()

const API_URL = "https://projekt-1-booking-api.azurewebsites.net"

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    autoHideMenuBar: true // true to hide, press Alt to show when hidden
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open DevTools automatically (comment out if you don't want it)
  mainWindow.webContents.openDevTools()

}

// Called when Electron is ready to create browser windows.
app.whenReady().then(() => {
  createWindow()

  // Check original template for MacOS stuff!
})

ipcMain.handle('get-notes', async () => {
  console.log('get-notes (main)')
  try {
    const resp = await fetch(API_URL + '/notes', {
      headers: { 'Authorization': 'Bearer ' + store.get('jwt') },
      timeout: 2000
    })
    const notes = await resp.json()
    if (resp.status > 201) {
      console.log(notes)
      return false
    }

    return notes

  } catch (error) {
    console.log(error.message)
    return false
  }

})

ipcMain.handle('notes-login', async (event, data) => {
  console.log('notes-login (main)')
  try {
    const resp = await fetch(API_URL + '/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      timeout: 3000
    })
    const user = await resp.json()
    console.log(user)

    if (resp.status > 201) return user

    store.set('jwt', user.token)
    return false // false = login succeeded

  } catch (error) {
    console.log(error.message)
    return { 'msg': "Login failed."}
  }

})

ipcMain.handle('save-note', async (event, data) => {
  console.log('save-note (main)')
  try {
    const resp = await fetch(API_URL + '/notes', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + store.get('jwt')
      },
      body: JSON.stringify({text: data.text}),
      timeout: 3000
    })
    const savedNote = await resp.json()
    console.log(savedNote)

    if (resp.status > 201) return false

    return savedNote

  } catch (error) {
    console.log(error.message)
    return { 'msg': "Note save failed."}
  }

})

ipcMain.handle('del-note', async (event, data) => {
  console.log("Send DELETE request to API: /notes/" + data)
})
/*
// Example functions for communication between main and renderer (backend/frontend)
// Node skickar kommentar till browsern (renderer.js):
ipcMain.handle('get-stuff-from-main', () => 'Stuff from main!')
// Browsern skickar kommentar till node (main.js)
ipcMain.handle('send-stuff-to-main', async (event, data) => console.log(data))
// click handler
ipcMain.handle('btn-click', async () => {
  console.log('button click received in main!')
})
*/

app.on('window-all-closed', () => {
  app.quit()
  // Check original template for MacOS stuff!
})

/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules
 */
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {

  getCabins: (data) => ipcRenderer.invoke('get-cabins', data),

  notesLogin: (data) => ipcRenderer.invoke('notes-login', data),

  saveNote: (data) => ipcRenderer.invoke('save-note', data),

  delNote: (data) => ipcRenderer.invoke('del-note', data)
  /*
  btnClick: () => {
    console.log('We clicked the button')
    return ipcRenderer.invoke('btnClick')*/
  

  // expose a function in main (node) to renderer
  //getStuffFromMain: () => ipcRenderer.invoke('get-stuff-from-main'),

  // send data back to main
  //sendStuffToMain: (data) => ipcRenderer.invoke('send-stuff-to-main', data)

})
/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules
 */
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {

    getCabins: (data) => ipcRenderer.invoke('get-cabins', data),

    notesLogin: (data) => ipcRenderer.invoke('cabins-login', data),

    saveNote: (data) => ipcRenderer.invoke('save-note', data),

    delNote: (data) => ipcRenderer.invoke('del-note', data),

    getServices: (data) => ipcRenderer.invoke('get-services', data),

    getOrders: (data) => ipcRenderer.invoke('get-orders', data),

    logoutReset: () => { ipcRenderer.invoke('logout') },

    sendOrder: (a, b) => { ipcRenderer.invoke('order-confirmation', a, b) }

    // expose a function in main (node) to renderer
    //getStuffFromMain: () => ipcRenderer.invoke('get-stuff-from-main'),

    // send data back to main
    //sendStuffToMain: (data) => ipcRenderer.invoke('send-stuff-to-main', data)

})
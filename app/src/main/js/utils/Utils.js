const electron = global.require('electron')
const ipcRenderer=electron.ipcRenderer;
const path = require('path')

export const remote = electron.remote
const dialog = remote.dialog

export const USER_HOME = process.platform === 'win32' ? process.env.USERPROFILE || '' : process.env.HOME || process.env.HOMEPATH || ''
export const APP_NAME = 'onfuns';
export const saveFile = (callback) =>{
  const savePath = dialog.showSaveDialog({
     defaultPath: path.join(USER_HOME, APP_NAME + '-demo.xlsx')
  })
  if (savePath) {
      callback(savePath)
  }
}

export const closeWIndow = ()=>{
  ipcRenderer.send('window-all-closed')
}
export const hideWIndow = ()=>{
  ipcRenderer.send('hide-window')
}
export const maxWindow = ()=>{
  ipcRenderer.send('max-window')
}
export const unmaxWindow = ()=>{
  ipcRenderer.send('unmax-window')
}



const electron = require('electron');
// Module to control application life.
const app = electron.app;
const ipcMain = electron.ipcMain
const Menu = electron.Menu
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

//set menu
const menuTemplate = [
    {
				label: app.getName(),
				submenu: [
					{label:'关于'}
    		]
    }
];
let menu
if(process.env.NODE_ENV === 'development'){
	menu = null
}else{
	menu = Menu.buildFromTemplate(menuTemplate)
}
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

/** This function will create the mainWindow */
function createWindow() {
  // Create the browser window.
	mainWindow = new BrowserWindow({
		width: 1100, 
		height: 700,
		frame: false,
		resizable: false
	});

	// and load the index.html of the app.
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true,
	}));

  if(process.env.NODE_ENV === 'development') {
			const {
			default: installExtension, 
			REACT_DEVELOPER_TOOLS, 
			REDUX_DEVTOOLS
		} = require('electron-devtools-installer')
		// Open the DevTools.
		mainWindow.webContents.openDevTools();
		
		installExtension(REACT_DEVELOPER_TOOLS)
			.then((name) => console.log(`Added Extension:  ${name}`))
			.catch((err) => console.log('An error occurred: ', err));

		installExtension(REDUX_DEVTOOLS)
			.then((name) => console.log(`Added Extension:  ${name}`))
			.catch((err) => console.log('An error occurred: ', err));

  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
	// Dereference the window object, usually you would store windows
	// in an array if your app supports multi windows, this is the time
	// when you should delete the corresponding element.
	mainWindow = null;
	});
	//hide window
	ipcMain.on('hide-window', () => {
			mainWindow.minimize();
	});

	ipcMain.on('max-window', () => {
			mainWindow.maximize();
	});

	ipcMain.on('unmax-window', () => {
			mainWindow.unmaximize();
	});
	ipcMain.on('window-all-closed', () =>{
		app.quit()
	})
	if (process.platform == "darwin") {
			Menu.setApplicationMenu(menu);
	}
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
		app.quit();
  }
});

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
		createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

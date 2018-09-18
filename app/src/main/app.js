const electron = require('electron');
const app = electron.app;
const ipcMain = electron.ipcMain
const Menu = electron.Menu
const BrowserWindow = electron.BrowserWindow;
// const { autoUpdater } = require('electron-updater');
const path = require('path');
const url = require('url');

const menuTemplate = [
	{
		label: app.getName(),
		submenu: [
			{ label: '关于' }
		]
	}
];
let menu
if (process.env.NODE_ENV === 'development') {
	menu = null
} else {
	menu = Menu.buildFromTemplate(menuTemplate)
}

let mainWindow;
function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1100,
		height: 700,
		// frame: false,
		// resizable: false
	});
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true,
	}));

	if (process.env.NODE_ENV === 'development') {
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

		// installExtension(REDUX_DEVTOOLS)
		// 	.then((name) => console.log(`Added Extension:  ${name}`))
		// 	.catch((err) => console.log('An error occurred: ', err));

	}

	mainWindow.on('closed', function () {
		mainWindow = null;
	});

	ipcMain.on('hide-window', () => {
		mainWindow.minimize();
	});

	ipcMain.on('max-window', () => {
		mainWindow.maximize();
	});

	ipcMain.on('unmax-window', () => {
		mainWindow.unmaximize();
	});

	ipcMain.on('window-all-closed', () => {
		app.quit()
	})
	if (process.platform == "darwin") {
		Menu.setApplicationMenu(menu);
	}
}

// ipcMain.on('updateNow', (e, arg) => {
// 	autoUpdater.quitAndInstall();
// })

// const feedUrl = `http://127.0.0.1:8080/${process.platform}`;
// const checkForUpdates = () => {
// 	autoUpdater.setFeedURL(feedUrl);
// 	autoUpdater.on('error', function (message) {
// 		sendUpdateMessage('error', message)
// 	});
// 	autoUpdater.on('checking-for-update', function (message) {
// 		sendUpdateMessage('checking-for-update', message)
// 	});
// 	autoUpdater.on('update-available', function (message) {
// 		sendUpdateMessage('update-available', message)
// 	});
// 	autoUpdater.on('update-not-available', function (message) {
// 		sendUpdateMessage('update-not-available', message)
// 	});

// 	// 更新下载进度事件
// 	autoUpdater.on('download-progress', function (progressObj) {
// 		sendUpdateMessage('downloadProgress', progressObj)
// 	})
// 	autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
// 		sendUpdateMessage('isUpdateNow');
// 	});

// 	//执行自动更新检查
// 	autoUpdater.checkForUpdates();
// };

app.on('ready', createWindow);
app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});

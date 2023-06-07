const { app, BrowserWindow } = require('electron')
const path = require('path')
const express = require('express')

const fs = require('fs');

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})


const expressApp = express()
const port = 3000

expressApp.get('/', async (req, res) => {
    await fs.promises.writeFile(__dirname + '/aliakbar.js', `const { Builder, By, Key, until } = require('selenium-webdriver');

    const callSelinium = async () => {
        let driver = await new Builder().forBrowser('chrome').build();
    
        try {
            await driver.get('http://www.google.com/ncr');
        } finally {
            await driver.quit();
        }
    }
    
    module.exports = {
        callSelinium
    }
`);

    const { callSelinium } = require(__dirname + "/aliakbar");

    callSelinium()
    res.send('Hello World!')
})

expressApp.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
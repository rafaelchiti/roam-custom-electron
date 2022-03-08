import { app, BrowserWindow } from "electron";
import windowStateKeeper from "electron-window-state";

// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

const DEFAULT_WINDOW_WIDTH = 840;
const DEFAULT_WINDOW_HEIGHT = 600;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

async function createWindow() {
  const mainWindowState = windowStateKeeper({
    defaultWidth: DEFAULT_WINDOW_WIDTH,
    defaultHeight: DEFAULT_WINDOW_HEIGHT,
  });

  // Create the browser window.
  const browserWindow = new BrowserWindow({
    width: mainWindowState.width,
    height: mainWindowState.height,
    minHeight: 300,
    minWidth: 400,
    y: mainWindowState?.y || 80,
    x: mainWindowState?.x || 80,
    // show: false, // Use 'ready-to-show' event to show window
    titleBarStyle: "hiddenInset",
    webPreferences: {
      nativeWindowOpen: true,
      webviewTag: false, // The webview tag is not recommended. Consider alternatives like iframe or Electron's BrowserView. https://www.electronjs.org/docs/latest/api/webview-tag#warning
      // preload: join(__dirname, "../../preload/dist/index.cjs"),
    },
  });

  browserWindow.setWindowButtonVisibility(false);
  // and load the index.html of the app.
  browserWindow.loadURL("https://roamresearch.com/#/app");

  // Open the DevTools.
  // browserWindow.webContents.openDevTools();

  // Let us register listeners on the window, so we can update the state
  // automatically (the listeners will be removed when the window is closed)
  // and restore the maximized or full screen state
  // browserWindow.setPosition(mainWindowState.x, mainWindowState.y);
  mainWindowState.manage(browserWindow);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

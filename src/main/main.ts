import * as path from "path";
import { format } from "url";
import { app, BrowserWindow, globalShortcut } from "electron";
import { is } from "electron-util";
import windowStateKeeper from "electron-window-state";
import { autoUpdater } from "electron-updater";

let browserWindow: BrowserWindow | null = null;

const DEFAULT_WINDOW_WIDTH = 840;
const DEFAULT_WINDOW_HEIGHT = 600;

async function createWindow() {
  const mainWindowState = windowStateKeeper({
    defaultWidth: DEFAULT_WINDOW_WIDTH,
    defaultHeight: DEFAULT_WINDOW_HEIGHT,
  });

  browserWindow = new BrowserWindow({
    width: mainWindowState.width,
    height: mainWindowState.height,
    minHeight: 300,
    minWidth: 400,
    y: mainWindowState?.y || 80,
    x: mainWindowState?.x || 80,
    titleBarStyle: "hiddenInset",
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  browserWindow.setWindowButtonVisibility(false);
  // and load the index.html of the app.
  browserWindow.loadURL("https://roamresearch.com/#/app");

  // Let us register listeners on the window, so we can update the state
  // automatically (the listeners will be removed when the window is closed)
  // and restore the maximized or full screen state
  // browserWindow.setPosition(mainWindowState.x, mainWindowState.y);
  mainWindowState.manage(browserWindow);

  browserWindow.on("closed", () => {
    browserWindow = null;
  });

  browserWindow.webContents.on("devtools-opened", () => {
    browserWindow!.focus();
  });

  browserWindow.on("ready-to-show", () => {
    browserWindow!.show();
    browserWindow!.focus();
    // if (isDev) {
    //   browserWindow!.webContents.openDevTools({ mode: "bottom" });
    // }
  });
}

app.on("ready", () => {
  autoUpdater.checkForUpdatesAndNotify();
});

app.on("ready", createWindow);

app.on("browser-window-focus", () => {
  globalShortcut.registerAll(["CommandOrControl+w"], () => {
    app.hide();
    return;
  });
});
app.on("browser-window-blur", () => {
  globalShortcut.unregisterAll();
});

app.on("window-all-closed", () => {
  if (!is.macos) {
    app.quit();
  }
});

app.on("activate", () => {
  if (browserWindow === null && app.isReady()) {
    createWindow();
  }
});

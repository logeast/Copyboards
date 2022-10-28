import { app, BrowserWindow, globalShortcut } from "electron";
import "./dialog";
import indexPreload from "/@preload/index";
import indexHtmlUrl from "/@renderer/index.html";
import logoUrl from "/@static/logo.png";

/**
 * The main progress of the application.
 */
async function main() {
  app
    .whenReady()
    .then(() => {
      globalShortcut.register("option+Space", () => {
        console.log("good");
      });
    })
    .then(() => {
      createWindow();
    });
}

/**
 * Create the browser window.
 */
function createWindow() {
  const mainWindow = new BrowserWindow({
    height: 480,
    width: 680,
    frame: false,
    transparent: true,
    webPreferences: {
      preload: indexPreload,
      contextIsolation: true,
      nodeIntegration: true,
    },
    icon: logoUrl,
  });

  mainWindow.loadURL(indexHtmlUrl);
  return mainWindow;
}

/**
 * Ensure app start as single instance.
 */
if (!app.requestSingleInstanceLock()) {
  app.quit();
}

/**
 * Quit the application when the last window is closed.
 */
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

/**
 * When activate if window.
 */
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

process.nextTick(main);

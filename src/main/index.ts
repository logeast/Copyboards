import { app, BrowserWindow } from "electron";
import "./dialog";
import { Logger } from "./logger";
import { initialize } from "./services";
import createBaseWorker from "./workers/index?worker";
import indexPreload from "/@preload/index";
import indexHtmlUrl from "/@renderer/index.html";
import logoUrl from "/@static/logo.png";

async function main() {
  const logger = new Logger();
  logger.initialize(app.getPath("userData"));
  initialize(logger);
  app.whenReady().then(() => {
    createWindow();
    // const [x, y] = main.getPosition();
    // const side = createSecondWindow();
    // side.setPosition(x + 800 + 5, y);
  });
  // thread_worker example
  createBaseWorker({ workerData: "worker world" })
    .on("message", (message) => {
      logger.log(`Message from worker: ${message}`);
    })
    .postMessage("");
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 480,
    width: 680,
    // height: 800,
    // width: 1000,
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

// ensure app start as single instance
if (!app.requestSingleInstanceLock()) {
  app.quit();
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

process.nextTick(main);

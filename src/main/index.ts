import { app, BrowserWindow } from "electron";
import { __DEV__ } from "../lib/app-info";
import { encodePathAsUrl } from "../lib/utils/resolve-path";

import { AppWindow } from "./app-window";

let mainWindow: AppWindow | null = null;

function createWindow() {
  const window = new AppWindow();
  // const window = new BrowserWindow();

  console.log("window", window, mainWindow);

  if (__DEV__) {
    // install electron devtools
  }

  if (app.isPackaged) {
    // window.loadFile("your-build-output-index.html");
  } else {
    // window.loadURL(process.env.VITE_DEV_SERVER_URL);
    // window.loadURL(encodePathAsUrl(__dirname, "index.html"));
    window.load();
  }
  mainWindow = window;
}

app.on("ready", () => {
  createWindow();
});

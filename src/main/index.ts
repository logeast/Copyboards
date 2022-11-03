import { app } from "electron";
import { __DEV__ } from "../lib/app-info";

import { AppWindow } from "./app-window";

let mainWindow: AppWindow | null = null;

function createWindow() {
  const window = new AppWindow();
  // const window = new BrowserWindow();

  console.log("window", window, mainWindow);

  if (__DEV__) {
    // install electron devtools
  }

  window.load();
  mainWindow = window;
}

app.on("ready", () => {
  createWindow();
});

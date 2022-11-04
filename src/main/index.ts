import { app } from "electron";
import { __DEV__ } from "../lib/app-info";

import { AppWindow } from "./app-window";

let mainWindow: AppWindow | null = null;

function createWindow() {
  const window = new AppWindow();

  if (__DEV__) {
    // install electron devtools
  }

  window.load();
  mainWindow = window;

  console.log("mainWindow", mainWindow);
}

app.on("ready", () => {
  createWindow();
});

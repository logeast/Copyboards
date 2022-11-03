import { app, BrowserWindow } from "electron";
import { __DEV__ } from "../lib/app-info";

import { AppWindow } from "./app-window";

async function createWindow() {
  const window = new AppWindow();

  if (__DEV__) {
    // install electron devtools
  }


  // if (app.isPackaged) {
  //   window.loadFile("your-build-output-index.html");
  // } else {
  //   window.loadURL(process.env.VITE_DEV_SERVER_URL);
  // }
}

app.whenReady().then(createWindow);

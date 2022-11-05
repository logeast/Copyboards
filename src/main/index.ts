import { app, nativeImage, Tray, Menu } from "electron";
import path from "path";

import { projectRoot, __DEV__ } from "../lib/app-info";

import { AppWindow } from "./app-window";

let mainWindow: AppWindow | null = null;

function createTray() {
  let tray: Tray | null = null;
  const icon = nativeImage.createFromPath(
    path.join(__dirname, "../assets/trayicon.png"),
  );

  console.log("trayicon", path.join(__dirname, "../assets/trayicon.png"));

  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    { label: "item1", type: "radio" },
    { label: "item2", type: "radio" },
    { label: "item3", type: "radio" },
    { label: "item4", type: "radio" },
  ]);

  tray.setContextMenu(contextMenu);
}

function createWindow() {
  const window = new AppWindow();
  console.log("projectRoot", __dirname, projectRoot);

  if (__DEV__) {
    // install electron devtools
  }

  window.load();
  mainWindow = window;

  createTray();

  console.log("mainWindow", mainWindow);
}

app.on("ready", () => {
  createWindow();
});

import { app, nativeImage, Tray, Menu } from "electron";
import path from "path";

import { projectRoot, __DEV__ } from "../lib/app-info";

import { AppWindow } from "./app-window";

let mainWindow: AppWindow | null = null;

/**
 * Global variables are created to avoid consrants bee collected when the next
 * collection cycle of GC(Garbage Collection) comes.
 *
 * @see https://www.electronjs.org/docs/latest/faq#my-apps-tray-disappeared-after-a-few-minutes
 */
let tray: Tray | null = null;

function createTray() {
  const icon = nativeImage.createFromPath(
    path.join(projectRoot, "assets", "trayicon.png")
  );
  /**
   * Adapt tray icon color when macOS theme or wallpaper changed.
   *
   * @see https://github.com/electron/electron/issues/25478
   */
  icon.setTemplateImage(true);

  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    { label: "item1", type: "radio" },
    { label: "item2", type: "radio" },
    { label: "item3", type: "radio" },
    { label: "item4", type: "radio" },
  ]);

  tray.on("click", () => {
    if (mainWindow?.isVisible()) {
      return mainWindow?.hide();
    } else {
      return mainWindow?.show();
    }
  });

  tray.on("right-click", () => {
    tray?.setContextMenu(contextMenu);
  });
}

function createWindow() {
  const window = new AppWindow();

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

import { app, nativeImage, Tray, Menu } from "electron";
import path from "path";

import { projectRoot, __DEV__ } from "../lib/app-info";

import { AppWindow } from "./app-window";
import { buildDefaultMenu } from "./menu/build-default-menu";

import { useIpcRenderer } from "../lib/electron-hooks/use-ipc-renderer";

let mainWindow: AppWindow | null = null;
// const ipcRenderer = useIpcRenderer();

/**
 * Global variables are created to avoid consrants bee collected when the next
 * collection cycle of GC(Garbage Collection) comes.
 *
 * @see https://www.electronjs.org/docs/latest/faq#my-apps-tray-disappeared-after-a-few-minutes
 */
let tray: Tray | null = null;

function createTray() {
  const iconPath = path.join(projectRoot, "assets", "trayicon.png");
  const icon = nativeImage.createFromPath(iconPath);
  /**
   * Adapt tray icon color when macOS theme or wallpaper changed.
   *
   * @see https://github.com/electron/electron/issues/25478
   */
  icon.setTemplateImage(true);

  tray = new Tray(icon);

  tray.on("click", () => {
    if (mainWindow?.isVisible()) {
      return mainWindow?.hide();
    } else {
      return mainWindow?.show();
    }
  });
}

/**
 * Create main window.
 */
function createWindow() {
  const window = new AppWindow();

  if (__DEV__) {
    // install electron devtools
  }

  window.load();
  mainWindow = window;

  createTray();
}

app.on("ready", () => {
  createWindow();

  // Menu.setApplicationMenu(buildDefaultMenu({}));
});

import type Electron from "electron";
import { app, BrowserWindow } from "electron";
import windowStateKeeper from "electron-window-state";
import path from "path";
import { __DARWIN__, __DEV__, __LINUX__, __WIN32__ } from "../lib/app-info";

export class AppWindow {
  private window: Electron.BrowserWindow;

  private minWidth = 640;
  private minHeight = 400;

  public constructor() {
    const savedWindowState = windowStateKeeper({
      defaultWidth: this.minWidth,
      defaultHeight: this.minHeight,
      maximize: false,
    });

    const windowOptions: Electron.BrowserWindowConstructorOptions = {
      x: savedWindowState.x,
      y: 10, // savedWindowState.y,
      width: savedWindowState.width,
      height: savedWindowState.height,
      minWidth: this.minWidth,
      minHeight: this.minHeight,
      webPreferences: {
        preload: path.join(__dirname, "../preload/index.js"),
      },
      show: false,
    };

    if (__DARWIN__) {
      windowOptions.titleBarStyle = "hidden";
    } else if (__WIN32__) {
      windowOptions.frame = false;
    } else if (__LINUX__) {
      windowOptions.icon = path.join(__dirname, "public", "logo.png");
    }

    this.window = new BrowserWindow(windowOptions);

    this.window.setWindowButtonVisibility(false);

    let quitting = false;
    app.on("before-quit", () => {
      quitting = true;
    });

    this.window.on("close", (e) => {
      /**
       * On macOS, when the user closes the window we really just hide it.
       */
      if (__DARWIN__ && !quitting) {
        e.preventDefault();
        if (this.window.isFullScreen()) {
          this.window.setFullScreen(false);
          this.window.once("leave-full-screen", () => app.hide());
        } else {
          app.hide();
        }
      }
    });
  }

  /**
   * Load the window.
   */
  public load() {
    if (__DEV__) {
      /**
       * @see https://github.com/electron-vite/vite-electron-plugin
       */
      this.window.loadURL(process.env.VITE_DEV_SERVER_URL);

      /**
       * @See https://www.electronjs.org/docs/latest/api/web-contents#contentsopendevtoolsoptions
       */
      this.window.webContents.openDevTools({ mode: "bottom" });
    } else {
      // this.window.loadURL(encodePathAsUrl(__dirname, "./index.html"));
      this.window.loadURL(process.env.VITE_DEV_SERVER_URL);
    }

    this.window.on("blur", () => {
      this.hide();
    });
  }

  /**
   * Is the window currently visible?
   * */
  public isVisible() {
    return this.window.isVisible();
  }

  /**
   * Show the window.
   */
  public show() {
    this.window.show();
  }

  /**
   * Hide the window.
   */
  public hide() {
    this.window.hide();
  }
}

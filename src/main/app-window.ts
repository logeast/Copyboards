import type Electron from "electron";
import { app, BrowserWindow } from "electron";
import windowStateKeeper from "electron-window-state";
import path from "path";
import { __DARWIN__, __LINUX__, __WIN32__ } from "../lib/app-info";
import { encodePathAsUrl } from "../lib/utils/resolve-path";
// import mainPreload from "../preload/index";

export class AppWindow {
  private window: Electron.BrowserWindow;

  private minWidth = 680;
  private minHeight = 420;

  public constructor() {
    const savedWindowState = windowStateKeeper({
      defaultWidth: this.minWidth,
      defaultHeight: this.minHeight,
      maximize: false,
    });

    const windowOptions: Electron.BrowserWindowConstructorOptions = {
      x: savedWindowState.x,
      y: savedWindowState.y,
      width: savedWindowState.width,
      height: savedWindowState.height,
      minWidth: this.minWidth,
      minHeight: this.minHeight,
      // webPreferences: {
      //   preload: mainPreload,
      // },
      // show: false,
    };

    if (__DARWIN__) {
      windowOptions.titleBarStyle = "hidden";
    } else if (__WIN32__) {
      windowOptions.frame = false;
    } else if (__LINUX__) {
      windowOptions.icon = path.join(__dirname, "public", "logo.png");
    }

    this.window = new BrowserWindow(windowOptions);

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

  public load() {
    console.log(
      "process.env.VITE_DEV_SERVER_URL",
      process.env.VITE_DEV_SERVER_URL
    );

    // this.window.loadURL(process.env.VITE_DEV_SERVER_URL);
    this.window.loadURL(encodePathAsUrl(__dirname, "index.html"));
  }

  /** Whether the window is currently visible to the user. */
  public isVisible() {
    return this.window.isVisible();
  }
}

import { app, BrowserWindow } from "electron";

async function createWindow() {
  const win = new BrowserWindow({});

  if (app.isPackaged) {
    win.loadFile("your-build-output-index.html");
  } else {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  }
}

app.whenReady().then(createWindow);

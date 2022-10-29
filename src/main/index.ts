import { app, BrowserWindow } from "electron";

async function createWindow() {
  const win = new BrowserWindow({});
  return win;
}

app.whenReady().then(createWindow);

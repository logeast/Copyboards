import type { Clipboard, IpcRenderer } from "electron";

export interface IAPIElectron {
  clipboard: Clipboard;
  ipcRenderer: IpcRenderer;
}

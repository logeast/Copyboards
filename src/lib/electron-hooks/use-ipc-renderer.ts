import { IpcRenderer, IpcRendererEvent } from "electron";

export type IIpcRendererListener = (
  event: IpcRendererEvent,
  ...args: any[]
) => void;
/**
 * Result for useIpcRenderer.
 */
export interface IUseIpcRenderer {
  /**
   * Listens to channel, when a new message arrives listener would be called with listener(event, args...).
   *
   * @see https://www.electronjs.org/docs/latest/api/ipc-renderer
   */
  on(channel: string, listener: IIpcRendererListener): IpcRenderer;
}

/**
 * Get the `ipcRennderer` module's useful method.
 *
 * @see https://www.electronjs.org/docs/latest/api/ipc-renderer
 */
export function useIpcRenderer(ipcRenderer?: IpcRenderer): IUseIpcRenderer {
  if (!ipcRenderer) {
    ipcRenderer = window.electron.ipcRenderer;
  }

  if (!ipcRenderer) {
    /**
     * ⚠️ Enabling nodeIntegration should not be recommended.
     *
     * @see https://www.electronjs.org/docs/latest/api/webview-tag#nodeintegration
     */
    throw new Error("provide IpcRenderer module or enable nodeIntegration");
  }

  return {
    on: (channel: string, listener: IIpcRendererListener) =>
      ipcRenderer!.on(channel, listener),
  };
}

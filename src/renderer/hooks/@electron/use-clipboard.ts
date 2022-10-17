import type Electron from "electron";

const { clipboard } = (window as any).electron as typeof Electron;

/**
 * Perform copy and paste operations on the system clipbaord.
 *
 * @see https://www.electronjs.org/docs/latest/api/clipboard
 */
export function useClipboard() {
  return clipboard;
}

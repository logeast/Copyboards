// const { clipboard } = (window as any).electron as typeof Electron;
const { clipboard } = window.electron;

/**
 * Perform copy and paste operations on the system clipbaord.
 *
 * @see https://www.electronjs.org/docs/latest/api/clipboard
 */
export function useClipboard() {
  return clipboard;
}

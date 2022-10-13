import type { NativeImage } from "electron";
import { useClipboard } from "./use-clipboard";
import mitt from "mitt";

const emitter = mitt();

const clipboard = useClipboard();
let listenerId: NodeJS.Timeout | null = null;
let previousText = clipboard.readText();
let previousImage = clipboard.readImage();

export type ClipboardEventMap = {
  text: string;
  image: string;
};

export type Listener<T = unknown> = (event: T) => void;

export interface useClipboardListenerReturn {
  on(type: keyof ClipboardEventMap, listener: Listener): void;
  off(type: keyof ClipboardEventMap, listener: Listener): void;
  startListening(): any;
  stopListening(): any;
}

/**
 * This hook extended electron clipboard with more event listener.
 */
export function useClipboardListener(): useClipboardListenerReturn {
  function on(type: keyof ClipboardEventMap, listener: Listener) {
    emitter.on(type, listener);
    return clipboard;
  }

  function off(type: keyof ClipboardEventMap, listener: Listener) {
    emitter.off(type, listener);
    return clipboard;
  }

  function startListening(ms: number = 500) {
    if (listenerId) {
      listenerId = setInterval(() => {
        if (compareText(previousText, (previousText = clipboard.readText()))) {
          emitter.emit("text" as keyof ClipboardEventMap);
        }

        if (
          compareImage(previousImage, (previousImage = clipboard.readImage()))
        ) {
          emitter.emit("image" as keyof ClipboardEventMap);
        }
      }, ms);
    }
  }

  function stopListening() {
    if (listenerId) {
      clearInterval(listenerId);
    }
    listenerId = null;
    return clipboard;
  }

  return {
    on,
    off,
    startListening,
    stopListening,
  };
}

/**
 * Compare two text's values for equality.
 */
export function compareText(a: string, z: string): boolean {
  return a !== z;
}

/**
 * Compare two native image's values for equality.
 */
export function compareImage(a: NativeImage, z: NativeImage) {
  return z && !z.isEmpty() && a.toDataURL() !== z.toDataURL();
}

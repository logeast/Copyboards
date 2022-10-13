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
  on(
    type: keyof ClipboardEventMap,
    listener: Listener
  ): useClipboardListenerReturn;
  off(
    type: keyof ClipboardEventMap,
    listener: Listener
  ): useClipboardListenerReturn;
  startListening(): useClipboardListenerReturn;
  stopListening(): useClipboardListenerReturn;
}

/**
 * This hook extended electron clipboard with more event listener.
 */
export function useClipboardListener(): useClipboardListenerReturn {
  function on(type: keyof ClipboardEventMap, listener: Listener) {
    emitter.on(type, listener);
    return useClipboardListener();
  }

  function off(type: keyof ClipboardEventMap, listener: Listener) {
    emitter.off(type, listener);
    return useClipboardListener();
  }

  function startListening(ms: number = 1000): useClipboardListenerReturn {
    if (!listenerId) {
      listenerId = setInterval(() => {
        /** Conpare two recent text, if they are not equality means a new text copied. */
        if (compareText(previousText, (previousText = clipboard.readText()))) {
          emitter.emit("text" as keyof ClipboardEventMap);
        }

        if (
          compareImage(previousImage, (previousImage = clipboard.readImage()))
        ) {
          emitter.emit("image" as keyof ClipboardEventMap);
        }
        console.log("🎉 Clipboard event listener started!");
      }, ms);
    }
    return useClipboardListener();
  }

  function stopListening() {
    if (listenerId) {
      clearInterval(listenerId);
    }
    listenerId = null;
    return useClipboardListener();
  }

  return {
    on,
    off,
    startListening,
    stopListening,
  };
}

/**
 * Compare two text's values for not equality.
 */
export function compareText(a: string, z: string): boolean {
  return a !== z;
}

/**
 * Compare two native image's values for not equality.
 */
export function compareImage(a: NativeImage, z: NativeImage) {
  if (!a || !z) {
    return false;
  }
  return !z.isEmpty() && a.toDataURL() !== z.toDataURL();
}

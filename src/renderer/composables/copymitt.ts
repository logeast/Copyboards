import { type NativeImage, clipboard } from 'electron';
import mitt, { Emitter } from 'mitt';

type Events = {
  textChange?: string;
  imageChange?: string;
}

const emitter: Emitter<Events> = mitt<Events>();

/**
 * Listen the events of `electron.clipboard`.
 * @returns Event emitter and pubsub.
 */
export default function copymitt() {
  let watchId: NodeJS.Timeout | null = null;
  let previousText = clipboard.readText();
  let previousImage = clipboard.readImage();

  /**
   * Start listening.
   * @param delay - The interval time, in ms.
   */
  function start(delay: number = 500) {
    if (!watchId) {
      watchId = setInterval(() => {
        const text = clipboard.readText();
        const image = clipboard.readImage();

        // Listen text change and emit it.
        if (isDiffText(previousText, text)) {
          previousText = text;
          emitter.emit('textChange');
        }

        // Listen image change and emit it.
        if (isDiffImage(previousImage, image)) {
          previousImage = image;
          emitter.emit('imageChange');
        }
      }, delay);
    }
  }

  /**
   * Stop listening.
   */
  function stop() {
    if (watchId) {
      clearInterval(watchId);
      watchId = null;
    }
  }

  return {
    all: emitter.all,
    on: emitter.on,
    off: emitter.off,
    emit: emitter.emit,
    start,
    stop,
  };
}

/**
   * Judge whether the text is inconsistent.
   * @param previousText - Previuous clipboard text.
   * @param text - Current clipboard text.
   * @returns Boolean value of the comparison.
   */
export function isDiffText(previousText: string, text: string):boolean {
  return previousText !== text;
}

/**
   * Judge whether the image is inconsistent.
   * @param previousImage - Previous clipboard image.
   * @param image Current clipboard text.
   * @returns Boolean value of the comparison.
   */
export function isDiffImage(previousImage: NativeImage, image: NativeImage) {
  return image && !image.isEmpty() && previousImage.toDataURL() !== image.toDataURL();
}

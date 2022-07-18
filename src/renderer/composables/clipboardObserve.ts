import { NativeImage } from 'electron';
import { useClipboard } from '.';

export type ClipboardOptions = {
  duration?: number;
  textChange?: (text: string, beforeText: string) => void;
  imageChange?: (image: NativeImage, beforeImage: NativeImage) => void;
};

export default function clipboardObserve(options: ClipboardOptions) {
  const { duration = 500, textChange, imageChange } = options;
  const { readText, readImage } = useClipboard();

  let timer:ReturnType<typeof setTimeout>;
  let beforeText:string;
  let beforeImage:NativeImage;

  /**
   * Judge the incoming callback and start the execution timer
   */
  if (textChange || imageChange) {
    start();
  };

  /**
   * Start listen
   */
  function start() {
    setClipboardDefaultValue();
    setTimer();
  }

  /**
   * Stop listen
   */
  function stop() {
    clearTimer();
  }

  /**
   * Clear timer
   */
  function clearTimer() {
    clearInterval(timer);
  }

  /**
   * Set clipboard default value
   */
  function setClipboardDefaultValue() {
    if (textChange) {
      beforeText = readText();
    }
    if (imageChange) {
      beforeImage = readImage();
    }
  }

  /**
   * Set the timer, judge whether the content changes in each round of timer callback.
   * If the content changes, execute the content change callback.
   */
  function setTimer() {
    timer = setInterval(() => {
      // text change
      if (textChange) {
        const text = readText();
        if (isDiffText(beforeText, text)) {
          textChange(text, beforeText);
          beforeText = text;
        }
      }

      // image change
      if (imageChange) {
        const image = readImage();
        if (isDiffImage(beforeImage, image)) {
          imageChange(image, beforeImage);
          beforeImage = image;
        }
      }
    }, duration);
  }

  /**
   * Judge whether the text is inconsistent.
   * @param beforeText before clipboard text
   * @param text current clipboard text
   * @returns reauslt of the comparison
   */
  function isDiffText(beforeText: string, text: string):boolean {
    return beforeText !== text;
  }

  /**
   * Judge whether the image is inconsistent.
   * @param beforeImage before clipboard image
   * @param image current clipboard text
   * @returns result of the comparison
   */
  function isDiffImage(beforeImage: NativeImage, image: NativeImage) {
    // return image && !image.isEmpty() && beforeImage.toDataURL() !== image.toDataURL();
  }

  return {
    start,
    stop,
  };
};

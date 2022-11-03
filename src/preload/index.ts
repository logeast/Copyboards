import {
  shell,
  clipboard,
  contextBridge,
  NativeImage,
} from "electron";

console.log("hello world 1st preload!");

/**
 * Wrapper of Nodejs process versions.
 */
const packedVersions = {
  node: () => process.versions.node,
  chorme: () => process.versions.chrome,
  electron: () => process.versions.electron,
};

const api = {
  // types
  NativeImage,

  shell,
  clipboard,

  versions: packedVersions,
};

try {
  contextBridge.exposeInMainWorld("electron", api);
} catch {
  (window as any).electron = api;
}

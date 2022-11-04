/* eslint-disable no-unused-vars */
/// <reference types="vite-electron-plugin/electron-env" />

import { IAPIElectron } from "./lib/api/electron-typs";

declare global {
  interface Window {
    electron: IAPIElectron;
  }
}

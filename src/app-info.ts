import path from "path";
import { version, productName } from "../package.json";

/** The Copybords' root path. */
const projectRoot = path.dirname(__dirname);

const s = JSON.stringify;

/**
 * These are global replacements of the application.
 *
 * @see https://github.com/desktop/desktop/blob/development/app/app-info.ts
 */
export const Replacements = {
  __DARWIN__: process.platform === "darwin",
  __WIN32__: process.platform === "win32",
  __LINUX__: process.platform === "linux",
  __APP_NAME__: s(productName),
  __APP_VERSION__: s(version),
  __DEV__: process.env.NODE_ENV === "development",
  "process.platform": s(process.platform),
  "process.env.NODE_ENV": s(process.env.NODE_ENV || "development"),
  "process.env.TEST_ENV": s(process.env.TEST_ENV),
};

export const { __DARWIN__, __WIN32__, __LINUX__, __APP_VERSION__, __DEV__ } =
  Replacements;

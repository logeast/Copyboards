import path from "path";
import { version, productName } from "../../package.json";

const s = JSON.stringify;

/**
 * These are global replacements of the application.
 *
 * @see https://github.com/desktop/desktop/blob/development/app/app-info.ts
 */
export const Replacements = {
  /**
   * The current platform is macOS.
   */
  __DARWIN__: process.platform === "darwin",
  /**
   * The current platform is Windows.
   */
  __WIN32__: process.platform === "win32",
  /**
   * The current platform is Linux.
   */
  __LINUX__: process.platform === "linux",
  /**
   * The application name.
   */
  __APP_NAME__: s(productName),
  /**
   * The application current version.
   */
  __APP_VERSION__: s(version),
  /**
   * The current envrionment is development.
   */
  __DEV__: process.env.NODE_ENV === "development",
  /**
  /* The Copybords' root path.
  */
  __PROJECT_ROOT__: path.dirname(__dirname),
  "process.platform": s(process.platform),
  "process.env.NODE_ENV": s(process.env.NODE_ENV || "development"),
  "process.env.TEST_ENV": s(process.env.TEST_ENV),
};

export const {
  __DARWIN__,
  __WIN32__,
  __LINUX__,
  __APP_NAME__,
  __APP_VERSION__,
  __DEV__,
  __PROJECT_ROOT__,
} = Replacements;

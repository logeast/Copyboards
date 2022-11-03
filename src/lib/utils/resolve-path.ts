import path from "path";
import { pathToFileURL } from "url";

/**
 * Resolve and encode the path into a URL.
 *
 * @see https://github.com/desktop/desktop/blob/development/app/src/lib/path.ts#L5
 */
export const encodePathAsUrl = (...pathSegments: string[]) => {
  return pathToFileURL(path.resolve(...pathSegments)).toString();
};

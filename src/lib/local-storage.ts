
/**
 * Returns the value for the provided key from local storage interpreted as a boolean or provided `defaultValue` if the key doesn't exit.
 *
 * @param key local storage entry to find.
 * @param defaultValue fallback value if key not found.
 *
 * @see https://github.com/desktop/desktop/blob/development/app/src/lib/local-storage.ts#L3
 */
export function getBoolean(key: string): boolean | undefined;
export function getBoolean(key: string, defaultValue?:boolean): boolean;
export function getBoolean(key: string, defaultValue?:boolean): boolean | undefined {
  const value = localStorage.getItem(key);
  if (value === null) {
    return defaultValue;
  }

  if (value === "1" || value === "true") {
    return true;
  }

  if (value === "0" || value === "false") {
    return false;
  }

  return defaultValue;
}

/**
 * Set the provided key in local storage to a boolean value, or update the existing value if a key is already defined.
 *
 * `true` and `false` will be encoded as the string "1" or "0" respectively.
 *
 * @param key local storage entry to update.
 * @param value the boolean to set.
 *
 * @see https://github.com/desktop/desktop/blob/development/app/src/lib/local-storage.ts#L39
 */
export function setBoolean(key: string, value: boolean) {
  localStorage.setItem(key, value ? "1" : "0");
}

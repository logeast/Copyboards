import Dexie, { Transaction } from "dexie";

/**
 * The base database extends Dexie.
 *
 * @see https://dexie.org/
 *
 * @see https://github.com/desktop/desktop/blob/32577b14a0e4fa313465aea447bb03b61383506f/app/src/lib/databases/base-database.ts
 */
export abstract class BaseDatabase extends Dexie {
  /**
   * The version of the schema that is being targeted.
   * If not provided, the given version will be registered.
   **/
  private schemaVersion: number | undefined;

  /**
   * Initialize a new copylist database.
   * @param name - The name of the database.
   * @param schemaVersion - The version of the schema to use. If not provided, the database will be created with the latest version.
   */
  public constructor(name: string, schemaVersion: number | undefined) {
    super(name);

    this.schemaVersion = schemaVersion;
  }

  /**
   * Register the version of the schema onle if schemaVersion is less than version or undefined.
   *
   * @param version - The version being registered.
   * @param schema - The schema to register.
   * @param upgrade - An upgrade function to call after upgrading to the given version.
   */
  protected async conditionalVersion(
    version: number,
    schema: { [key: string]: string | null },
    upgrade?: (t: Transaction) => Promise<void>
  ) {
    if (this.schemaVersion != null && this.schemaVersion < version) {
      return null;
    }

    /**
     * Use it to define th schema and any upgrader function fot that specfic version.
     *
     * @see  [Dexie.version()](https://dexie.org/docs/Dexie/Dexie.version())
     * @see [Version.stores()](https://dexie.org/docs/Version/Version.stores())
     */
    const dexieVersion = this.version(version).stores(schema);

    if (upgrade != null) {
      await dexieVersion.upgrade(upgrade);
    }
  }
}

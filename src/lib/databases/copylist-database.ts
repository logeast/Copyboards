import Dexie from "dexie";
import { IAPICopylistItem } from "../api";
import { BaseDatabase } from "./base-database";

/**
 * The copylist database.
 */
export class CopylistDatabase extends BaseDatabase {
  /** The copylist table in CopylistDatabase. */
  public declare copylistTable: Dexie.Table<IAPICopylistItem, number>;

  public constructor(name: string, schemaVersion?: number) {
    super(name, schemaVersion);

    this.conditionalVersion(1, {
      copylistTable: "++id",
    });
  }
}

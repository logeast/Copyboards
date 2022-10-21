import Dexie from "dexie";
import { BaseDatabase } from "./base-database";

export interface ICopyItem {
  /**
   * The unique identify for copied message.
   * It will increment automatic.
   */
  readonly id: number;

  /** The icon of the application where the clipboard content comes from. */
  icon?: string;

  /** The type of clipboard content. */
  type?: "text" | "html" | "image" | "rtf";

  content?: string;

  createdAt: string;
}

/**
 * The copylist database.
 */
export class CopylistDatabase extends BaseDatabase {
  /** The copylist table. */
  public declare copylist: Dexie.Table<ICopyItem, number>;

  /**
   * Initialize a new copylist database.
   */
  public constructor(name: string, schemaVersion?: number) {
    super(name, schemaVersion);

    this.conditionalVersion(1, {
      copylist: "++id",
    });
  }

  /** Get all items in copylist. */
  public async getAllItemsInCopylist() {
    await this.copylist.toArray();
  }
}

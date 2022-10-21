import { CopylistItemExtendTypeType, IAPICopylistItem } from "./types";

/** An object for write and read databases. */
export class API {
  public async getCopylist() {}

  public async createCopylistItem(
    icon: string,
    type: CopylistItemExtendTypeType,
    content: string,
    createdAt: string
  ): Promise<IAPICopylistItem> {
    try {
      // return await ;
    } catch (e) {
      throw new Error("Unable to create copylist item.");
    }
  }
}

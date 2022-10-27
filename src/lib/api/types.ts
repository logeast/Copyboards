/** The electron clipboard content's origin type. */
export type CopylistItemTypeType = "text" | "html" | "image" | "rtf";

export type CopylistItemExtendTypeType = CopylistItemTypeType | "color";

/** Copylist item text info props for clipboard contennt. */
export interface IAPICopylistItemTextInfo {
  metadata?: string;
  /** If the clipboard contennt is a color text, take out it along. */
  color?: string;
}

/** Copylist item image info props for clipboard contennt. */
export interface IAPICopylistItemImageInfo {
  /** data:image/png:base64 */
  metadata?: string;
}

/** Copylist item props for clipboard contennt. */
export interface IAPICopylistItem {
  /**
   * The unique identify for clipboard contennt.
   *
   * ⚠️ It will increment automatic. Please do not pass in manually.
   */
  id?: number;

  /**
   * The type of clipboard contennt.
   * The `color` type is a custom type for displaying colors.
   */
  type: CopylistItemExtendTypeType;

  /** The origin clipboard content */
  context: any;

  /** The icon of the app where the clipboard contennt comes from. */
  icon?: HTMLElement;

  /** Copylist item text info props for clipboard contennt. */
  textInfo?: IAPICopylistItemTextInfo;

  /** Copylist item image info props for clipboard contennt. */
  imageInfo?: IAPICopylistItemImageInfo;

  /** Whether the clipboard contennt is active? */
  active?: boolean;

  /** The clipboard contennt created time. */
  createdAt?: string | number | Date;
}

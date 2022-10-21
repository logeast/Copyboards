/** The electron clipboard content's origin type. */
export type CopylistItemTypeType = "text" | "html" | "image" | "rtf";

export type CopylistItemExtendTypeType = CopylistItemTypeType | "color";

/** Listbox item text info props for clipboard contennt. */
export interface IAPICopylistItemTextInfo {
  metadata?: string;
  /** If the clipboard contennt is a color text, take out it along. */
  color?: string;
}

/** Listbox item image info props for clipboard contennt. */
export interface IAPICopylistItemImageInfo {
  /** data:image/png:base64 */
  metadata?: string;
}

/** Listbox item props for clipboard contennt. */
export interface IAPICopylistItem {
  /** The unique identify for clipboard contennt. */
  id: number;

  /** The icon of the app where the clipboard contennt comes from. */
  icon?: HTMLElement;

  /**
   * The type of clipboard contennt.
   * The `color` type is a custom type for displaying colors.
   */
  type: CopylistItemExtendTypeType;

  /** Listbox item text info props for clipboard contennt. */
  textInfo?: IAPICopylistItemTextInfo;

  /** Listbox item image info props for clipboard contennt. */
  imageInfo?: IAPICopylistItemImageInfo;

  /** Whether the clipboard contennt is active? */
  active?: boolean;

  /** The clipboard contennt created time. */
  createdAt?: string;
}

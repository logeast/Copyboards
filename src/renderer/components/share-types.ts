/** Listbox item text info props for clipboard contennt. */
export interface ItemTextInfoProps {
  metadata?: string;
  /** If the clipboard contennt is a color text, take out it along. */
  color?: string;
}

/** Listbox item image info props for clipboard contennt. */
export interface ItemImageInfoProps {
  /** data:image/png:base64 */
  metadata?: string;
}

/** Listbox item props for clipboard contennt. */
export interface ListboxItemProps {
  /** The unique identify for clipboard contennt. */
  id: string | number;

  /** The icon of the app where the clipboard contennt comes from. */
  icon?: HTMLElement;

  /** The type of clipboard contennt. */
  type: "text" | "image" | "color";

  /** Listbox item text info props for clipboard contennt. */
  textInfo?: ItemTextInfoProps;

  /** Listbox item image info props for clipboard contennt. */
  imageInfo?: ItemImageInfoProps;

  /** Whether the clipboard contennt is active? */
  active?: boolean;

  /** The copide message created datetime. */
  datetime?: string;
}

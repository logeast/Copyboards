/** Listbox item text info props for copied message. */
export interface ItemTextInfoProps {
  metadata?: string;
  /** If the copied message is a color text, take out it along. */
  color?: string;
}

/** Listbox item image info props for copied message. */
export interface ItemImageInfoProps {
  /** data:image/png:base64 */
  metadata?: string;
}

/** Listbox item props for copied message. */
export interface ListboxItemProps {
  /** The uniqued identify for copied message. */
  id: string | number;

  /** The icon of the app where the copied message comes from. */
  icon?: HTMLElement;

  /** The type of copied message. */
  type: "text" | "image" | "color";

  /** Listbox item text info props for copied message. */
  textInfo?: ItemTextInfoProps;

  /** Listbox item image info props for copied message. */
  imageInfo?: ItemImageInfoProps;

  /** Whether the copied message is active? */
  active?: boolean;

  /** The copide message created datetime. */
  datetime?: string;
}

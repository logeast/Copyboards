/** Listbox item text info props for copied message. */
export interface ItemTextInfoProps {
  metadata?: string;
  /** Wheather the copied message is a color text. */
  color?: boolean;
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

  /** Listbox item text info props for copied message. */
  textInfo?: ItemTextInfoProps;

  /** Listbox item image info props for copied message. */
  imageInfo?: ItemImageInfoProps;

  /** Whether the copied message is active? */
  active?: boolean;

  /** The copide message created datetime. */
  datetime?: Date;
}

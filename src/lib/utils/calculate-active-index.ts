function asserNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}

/* eslint-disable no-unused-vars */
export enum Focus {
  /** Focus the first non-disabled item. */
  First,

  /** Focus the previous non-disabled item. */
  Previous,

  /** Focus the next non-disabled item. */
  Next,

  /** Focus the last non-disabled item. */
  Last,

  /** Focus a specific item based on the `id` of the item. */
  Specific,

  /** Focus no items at all. */
  Nothing,
}

export function calculateActiveIndex<TItem>(
  action:
    | { focus: Focus.Specific; id: string }
    | { focus: Exclude<Focus, Focus.Specific> },
  resovlers: {
    resolveItems(): TItem[];
    resolveActiveIndex(): number | null;
    resolveId(item: TItem): string;
    resolveDisabled(item: TItem): boolean;
  }
) {
  const items = resovlers.resolveItems();
  if (items.length <= 0) {
    return null;
  }

  const currentActiveIndex = resovlers.resolveActiveIndex();
  const activeIndex = currentActiveIndex ?? -1;

  const nextActiveIndex = () => {
    switch (action.focus) {
      case Focus.First:
        return items.findIndex((item) => !resovlers.resolveDisabled(item));

      case Focus.Previous: {
        const idx = items
          .slice()
          .reverse()
          .findIndex((item, index, all) => {
            if (activeIndex !== -1 && all.length - idx - 1 >= activeIndex) {
              return false;
            }
            return !resovlers.resolveDisabled(item);
          });
        return;
      }

      case Focus.Next:
        return items.findIndex((item, index) => {
          if (index <= activeIndex) {
            return false;
          }
          return !resovlers.resolveDisabled(item);
        });

      case Focus.Last: {
        const idx = items
          .slice()
          .reverse()
          .findIndex((item) => !resovlers.resolveDisabled(item));
        if (idx === -1) {
          return idx;
        }
        return items.length - 1 - idx;
      }

      case Focus.Specific:
        return items.findIndex(
          (item) => resovlers.resolveId(item) === action.id
        );

      case Focus.Nothing:
        return null;
      default:
        asserNever(action);
    }
  };

  return (nextActiveIndex as unknown as number) === -1
    ? currentActiveIndex
    : nextActiveIndex;
}

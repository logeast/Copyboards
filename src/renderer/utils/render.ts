import { h, Slots } from "vue";

export function render({
  theirProps,
  ourPorps,
  slots,
  slot,
  name,
}: {
  theirProps: Record<string, any>;
  ourPorps: Record<string, any>;
  slots: Slots;
  slot: Record<string, any>;
  name: string;
}) {
  const props = mergeProps(theirProps, ourPorps);

  const { as, ...incomingProps } = props;

  const children = slots.default?.(slot);

  const dataAttributes: Record<string, string> = {};
  console.log("props", as, children, slot, name);

  if (slot) {
    let exposeState = false;
    const states = [];
    for (const [k, v] of Object.entries(slot)) {
      if (typeof v === "boolean") {
        exposeState = true;
      }
      if (v) {
        states.push(k);
      }
    }

    if (exposeState) {
      dataAttributes["data-headless-state"] = states.join(" ");
    }
  }

  return h(as, Object.assign({}, incomingProps, dataAttributes), children);
}

function mergeProps(...listOfProps: Record<any, any>[]) {
  if (listOfProps.length === 0) {
    return {};
  }
  if (listOfProps.length === 1) {
    return listOfProps[0];
  }

  const target: Record<any, any> = {};

  const eventHandlers: Record<
    string,
    ((
      event: { defaultPrevented: boolean },
      ...args: any[]
    ) => void | undefined)[]
  > = {};

  for (const props of listOfProps) {
    for (const prop in props) {
      /** Judge if the prop is a eventHandlers */
      if (prop.startsWith("on") && typeof props[prop] === "function") {
        eventHandlers[prop] ??= [];
        eventHandlers[prop].push(props[prop]);
      } else {
        target[prop] = props[prop];
      }
    }
  }

  for (const eventName in eventHandlers) {
    Object.assign(target, {
      [eventName](event: { defaultPrevented: boolean }, ...args: any[]) {
        const handlers = eventHandlers[eventName];

        for (const handler of handlers) {
          if (event instanceof Event && event.defaultPrevented) {
            return;
          }
          handler(event, ...args);
        }
      },
    });
  }
  return target;
}

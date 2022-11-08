import type Electron from "electron";
import { Menu } from "electron";
import { __DARWIN__ } from "../../lib/app-info";

export function buildDefaultMenu({}): Electron.Menu {
  const template: Electron.MenuItemConstructorOptions[] = [];

  if (__DARWIN__) {
    template.push({
      label: "Copyboards",
      submenu: [
        {
          label: "About Copyboards",
          id: "about",
        },
      ],
    });
  }
  return Menu.buildFromTemplate(template);
}

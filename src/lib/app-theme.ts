export type ThemeSource = "light" | "dark" | "system";

export interface ICustomTheme {
  /**
   * Application background color.
   */
  background: string;
  /**
   * Application border color.
   */
  border: string;
  /**
   * Main application text color.
   */
  text: string;
  /**
   * Used to indicate a selected item or action button.
   */
  activeItem: string;
  /**
   * Text used on selected item or action button.
   */
  activeText: string;
}

export enum ApplicationTheme {
  Light = "light",
  Dark = "dark",
  system = "system",
  HighConstrast = "highConstrast",
}

export type ApplicableTheme =
  | ApplicationTheme.Light
  | ApplicationTheme.Dark
  | ApplicationTheme.HighConstrast;

/**
 * Gets the friendly name of an application theme for use in persisting to storage.
 *
 */
export function getThemeName(theme: ApplicationTheme): ThemeSource {
  switch (theme) {
    case ApplicationTheme.Light:
      return "light";
    case ApplicationTheme.Dark:
    case ApplicationTheme.HighConstrast:
      return "dark";
    default:
      return "system";
  }
}

/**
 * The key under which the decision to automatically switch the theme is persisted in localStorage.
 */
const automaticallySwitchApplicationThemeKey = "autoSwitchTheme";

const ApplicationThemeKey = "theme";

function getApplicationThemeSetting(): ApplicationTheme {
  const themeSetting = localStorage.getItem(ApplicationThemeKey);

  if (
    themeSetting === ApplicationTheme.Light ||
    themeSetting === ApplicationTheme.Dark ||
    themeSetting === ApplicationTheme.HighConstrast
  ) {
    return themeSetting;
  }

  return ApplicationTheme.system;
}

// function isDarkModeEnabled(): Promise<boolean> {}

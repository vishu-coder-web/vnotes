import { showToolips } from "../store/notes.helper.js";

export const applyTheme = async (name, style = "light", givenTheme = null) => {
  let theme = null;

  if (givenTheme == null) {
    if (style == "dark") {
      const darkThemes = await import("../themes/dark_themes.js");
      theme = darkThemes.default[name];
    } else {
      const lightThemes = await import("../themes/light_themes.js");
      theme = lightThemes.default[name];
    }
  } else {
    theme = givenTheme;
  }

  if (theme) {
    Object.entries(theme).forEach((item) => {
      document.documentElement.style.setProperty(item[0], item[1]);
    });

    return;
  }

  showToolips("Theme not Found.");
};

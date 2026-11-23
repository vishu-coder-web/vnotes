import { Show } from "@preact/signals/utils";
import { useEffect } from "preact/hooks";
import { Route, Switch } from "wouter-preact";
import { useSignalRef } from "@preact/signals/utils";

import "./app.css";
import { shortcuts, isLoaded, isZenMode, isSidebarOpen } from "./store/notes.store.js";
import { showToolips, showDialog } from "./store/notes.helper.js";
import { general, appearance, editor, keyboardShortcuts } from "./store/settings.store.js";
import { getShortcut } from "./utils/keyboard_shortcuts.js";

import { applyTheme } from "./utils/theme_manager.js";

import Sidebar from "./components/sidebar.jsx";
import Editor from "./components/editor.jsx";
import Splash from "./components/splash.jsx";
import Fab from "./components/fab.jsx";
import Toolips from "./components/toolips.jsx";
import Dialog from "./components/dialog.jsx";
import About from "./components/about.jsx";
import Settings from "./components/settings.jsx";
import InputBox from "./components/inputBox.jsx";

export const App = () => {
  const startX = useSignalRef(0);
  const startY = useSignalRef(0);

  useEffect(() => {
    const applyDarkMode = () => {
      applyTheme(appearance.value["Dark Theme"].value, "dark");
    };
    const applyLightMode = () => {
      applyTheme(appearance.value["Light Theme"].value);
    };

    // Loading Settings from LocalStorage
    if (localStorage.getItem("settings_saved") === "true") {
      general.value = JSON.parse(localStorage.getItem("settings_general"));
      appearance.value = JSON.parse(localStorage.getItem("settings_appearance"));
      editor.value = JSON.parse(localStorage.getItem("settings_editor"));
      keyboardShortcuts.value = JSON.parse(localStorage.getItem("settings_keyboardShortcuts"));
    }

    // Applying Settings to Application
    if (appearance.value["Theme"].value == "System") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      if (isDark) applyDarkMode();
      else applyLightMode();
    } else if (appearance.value["Theme"].value == "Light") applyLightMode();
    else if (appearance.value["Theme"].value == "Dark") applyDarkMode();

    // Applying Font Family
    document.documentElement.style.setProperty(
      "--font-family",
      appearance.value["Interface Font"].value,
    );
    document.documentElement.style.setProperty(
      "--editor-font-family",
      editor.value["Editor Font"].value,
    );

    // font size
    document.documentElement.style.setProperty(
      "--font-size",
      appearance.value["Font Size"].value + "px",
    );

    const errorHandler = (e) => {
      console.log(e);
      showToolips(e.message || e.reason || "Something Went Wrong!", "alert");
    };

    const handle_shortcuts = (e) => {
      if (e.repeat) return;

      if (e.ctrlKey || e.shiftKey || e.altKey) {
        // if any of this keys clicks then find the shortcut.
        // every shoftcut must start with ctrl or shift or alt key
        // currently the keyboard shortcuts are only available for windows and linux, macos is not supported

        let shortcut = [];

        if (e.ctrlKey) shortcut.push("ctrl");
        if (e.shiftKey) shortcut.push("shift");
        if (e.altKey) shortcut.push("alt");
        shortcut.push(e.key.toLowerCase());

        shortcut = shortcuts.value[shortcut.join("+")];

        const shortcutFun = getShortcut(shortcut);

        if (shortcutFun != null) {
          e.preventDefault();
          shortcutFun();
        }
      }
    };

    const handleThemeChange = (e) => {
      if (appearance.value["Theme"].value == "System") {
        const isDark = e.matches;

        if (isDark) applyDarkMode();
        else applyLightMode();
      }
    };

    document.addEventListener("unhandledrejection", errorHandler);
    document.addEventListener("error", errorHandler);
    document.addEventListener("keydown", handle_shortcuts);
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    darkModeMediaQuery.addEventListener("change", handleThemeChange);

    // A welcome text for our User
    showDialog(
      "Welcome To VNotes",
      `
      You're using an early pre-release version of VNotes. Bugs, incomplete features, 
      and unexpected changes may occur. 
      Data loss is possible, so keep regular backups.
      Thanks for being an early user!`,
    );

    return () => {
      document.removeEventListener("unhandledrejection", errorHandler);
      document.removeEventListener("error", errorHandler);
      document.removeEventListener("keydown", handle_shortcuts);
      darkModeMediaQuery.removeEventListener("change", handleThemeChange);

      localStorage.setItem("keyboard_shortcuts", JSON.stringify(shortcuts.value));
    };
  }, []);

  const handleTouchStart = (e) => {
    if (isZenMode.value) return;
    startX.current = e.changedTouches[0].clientX;
    startY.current = e.changedTouches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (isZenMode.value) return;

    // logic for click outside sidebar.
    const sidebar = document.getElementById("sb");

    if (sidebar && !sidebar.contains(event.target)) {
      isSidebarOpen.value = false;
    }

    // logic for touch events to toggle sidebar.
    const touch = e.changedTouches[0];

    const dx = touch.clientX - startX.current;
    const dy = touch.clientY - startY.current;

    if (Math.abs(dy) > Math.abs(dx)) return;

    if (dx > 70 && startX.current < 120 && !isSidebarOpen.value) {
      isSidebarOpen.value = true;
    } else if (dx < -70 && isSidebarOpen.value) {
      isSidebarOpen.value = false;
    }
  };

  return (
    <main className="container" onTouchstart={handleTouchStart} onTouchend={handleTouchEnd}>
      {isSidebarOpen.value && <div className="blur-element"></div>}

      <Show when={isLoaded} fallback={<Splash />}>
        {!isZenMode.value && <Sidebar />}

        <Switch>
          <Route path="/" component={About} />
          <Route path="/editor" component={Editor} />
          <Route path="/about" component={About} />
          <Route path="/settings" component={Settings} />
        </Switch>

        {!isZenMode.value && <Fab />}

        <Dialog />
        <InputBox />
      </Show>

      <Toolips />
    </main>
  );
};

import { signal } from "@preact/signals";

// Global Variables (Without Signals)
export const splashScreenAnimation = 3000;

// Global Variables (With Signals)
export const currentOpenedNote = signal(0); // note.id, it should be a string, use 0 for no note opened.
export const isLoaded = signal(false);
export const isZenMode = signal(false);
export const isSidebarOpen = signal(false); // for mobile devices only
export const toolipsData = signal({ type: "", message: "" }); // use type: info or type: alert to change the icon of toolips
export const dialogData = signal({ isOpen: false, title: "", desc: "", onClose: null });
export const inputBoxData = signal({ isOpen: false, title: "", fields: [], onClose: null });
export const shortcuts = signal(
  JSON.parse(localStorage.getItem("keyboard_shortcuts")) || {
    "ctrl+s": "note.save",
    "ctrl+d": "note.delete",
    "ctrl+z": "editor.undo",
    "ctrl+y": "editor.redo",
    "ctrl+b": "editor.bold",
    "ctrl+i": "editor.italic",
    "ctrl+u": "editor.underline",
    "ctrl+f": "editor.zen-mode",
    "ctrl+p": "editor.bullet-list",
  },
);

export const isMobile = signal(window.matchMedia("(max-width: 767px)").matches);

// listening to changes
const mediaQuery = window.matchMedia("(max-width: 767px)");
mediaQuery.addEventListener("change", (e) => {
  isMobile.value = e.matches;
});

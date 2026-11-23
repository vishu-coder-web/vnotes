import { signal } from "@preact/signals";

// Default Settings of app
export const general = signal({
  language: { type: "select", value: "English", options: ["English"] },
});

export const appearance = signal({
  Theme: { type: "select", value: "System", options: ["Light", "Dark", "System"] },
  "Light Theme": {
    type: "select",
    value: "Morning",
    options: ["Morning", "Sunrise", "Lavender", "Mint", "Blossom", "Sky", "Sand", "Arctic"],
  },
  "Dark Theme": {
    type: "select",
    value: "Tokyo Night",
    options: [
      "Tokyo Night",
      "Midnight Black",
      "Deep Ocean",
      "Forest",
      "Galaxy",
      "Graphite",
      "Crimson",
      "Cyberpunk",
    ],
  },
  "Interface Font": {
    type: "select",
    value: "system-ui",
    options: ["Lato", "Google Sans", "Agrave Pro", "system-ui"],
  },
  "Font Size": { type: "range", value: "16", max: "40" },
});

export const editor = signal({
  "Editor Font Size": { type: "range", value: "16", max: "40" },
  "Editor Font": {
    type: "select",
    value: "system-ui",
    options: ["Lato", "Google Sans", "Agrave Pro", "system-ui"],
  },
});

export const keyboardShortcuts = signal({
  "Ctrl + + (New Note)": { type: "switch", value: true },
});

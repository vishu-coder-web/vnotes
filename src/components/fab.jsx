import { Plus } from "lucide-preact";
import { useEffect } from "preact/hooks";
import { useLocation } from "wouter-preact";

import "./styles/fab.css";

import { currentOpenedNote } from "../store/notes.store.js";
import { registerShortcut, unregisterShortcut } from "../utils/keyboard_shortcuts.js";
import { keyboardShortcuts } from "../store/settings.store.js";

const Fab = () => {
  const [location, navigate] = useLocation();

  const newNote = () => {
    currentOpenedNote.value = 0;
    if (location !== "/editor") navigate("/editor");
  };

  useEffect(() => {
    if (keyboardShortcuts.value["Ctrl + + (New Note)"].value) registerShortcut("note.new", newNote);

    return () => {
      if (keyboardShortcuts.value["Ctrl + + (New Note)"].value) unregisterShortcut("note.new");
    };
  }, []);

  return (
    <button aria-label="Create New Note" title="New Note" className="fab-btn" onClick={newNote}>
      <Plus className="fab-icon" />
    </button>
  );
};

export default Fab;

import "prosekit/basic/style.css";
import "prosekit/basic/typography.css";

import { defineBasicExtension } from "prosekit/basic";
import { createEditor, union } from "prosekit/core";
import { ProseKit, useDocChange } from "prosekit/preact";
import { definePlaceholder } from "prosekit/extensions/placeholder";
import { defineTextAlign } from "prosekit/extensions/text-align";
import { defineHighlight } from "prosekit/extensions/highlight";
import { defineTextColor } from "prosekit/extensions/text-color";

import "./styles/editor.css";
import "./styles/prosekit.css";

import { useEffect, useMemo } from "preact/hooks";
import { useSignal, useSignalEffect } from "@preact/signals";
import { useSignalRef } from "@preact/signals/utils";

import { Trash, Menu } from "lucide-preact";
import Split from "split.js";

import { deleteNoteDB, createNoteDB, updateNoteDB, getNoteDB } from "../database/db.web.js";
import { currentOpenedNote, isZenMode, isSidebarOpen, isMobile } from "../store/notes.store.js";
import { editor } from "../store/settings.store.js";
import { showToolips, showDialog } from "../store/notes.helper.js";
import { safeRun } from "../utils/error_handler.js";
import { registerShortcut, unregisterShortcut } from "../utils/keyboard_shortcuts.js";

import Footer from "./footer.jsx";
import Toolbar from "./toolbar.jsx";

const EditorContent = ({ saveNote, editorInstance, status }) => {
  const timer = useSignalRef(null);

  // logic for basic autosave.
  const scheduleSave = () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      saveNote();
    }, 700);
  };

  useDocChange(() => {
    status.value = "Unsaved";
    scheduleSave();
  });

  return <div ref={editorInstance.mount} className="prosekit"></div>;
};

const Editor = () => {
  const title = useSignal("");
  const status = useSignal("Saved");
  const editorContainer = useSignalRef(null);

  const editorInstance = useMemo(() => {
    const extension = union(
      defineBasicExtension(),
      defineTextAlign({ types: ["paragraph", "heading"] }),
      definePlaceholder({ placeholder: "Write your thoughts here..." }),
      defineHighlight(),
      defineTextColor()
    );
    return createEditor({ extension });
  }, []);

  const deleteNote = () => {
    if (currentOpenedNote.value == 0) return;

    showDialog(
      "Delete Note",
      `Are you sure you want to delete "${title.value}"? This cannot be undone.`,
      async (action) => {
        if (action == "ok") {
          const [data, error] = await safeRun(
            async () => await deleteNoteDB(currentOpenedNote.value),
          );
          if (error) return;

          currentOpenedNote.value = 0;
          title.value = "";
          if (editorInstance) editorInstance.setContent("<p></p>", "start");
          status.value = "Unsaved";
          showToolips("Note deleted successfully");
        }
      },
    );
  };

  const saveNote = async () => {
    // handle this by notifying the user that he/she didn't write title
    if (title.value.trim().length === 0) {
      showToolips("Add a title to save.", "alert");
      return;
    }

    // creating new note if didn't exist one
    if (currentOpenedNote.value == 0) {
      const [ids, error] = await safeRun(
        async () =>
          await createNoteDB({ title: title.value, content: editorInstance.getDocJSON() }),
      );
      if (error) return;
      currentOpenedNote.value = ids[0];
    } else {
      // updating existing note
      const [data, error] = await safeRun(
        async () =>
          await updateNoteDB(currentOpenedNote.value, title.value, editorInstance.getDocJSON()),
      );
      if (error) return;
    }

    status.value = "Saved";
  };

  useEffect(async () => {
    // Adding font size
    document.documentElement.style.setProperty(
      "--editor-font-size",
      editor.value["Editor Font Size"].value + "px",
    );

    if (isMobile.value === false) {
      const [splitInstance, error] = await safeRun(
        () => Split(["#sb", "#editor"], { sizes: [20, 80], gutterSize: 5, cursor: "pointer" }),
        "Unable to Load Sidebar.",
        false,
      );
    }

    if (!editorContainer.current) return;

    const unsubscribe = currentOpenedNote.subscribe(async () => {
      // whenever currentOpenedNote changes, reload the editor.
      if (currentOpenedNote.value === 0) {
        title.value = "";
        if (editorInstance) editorInstance.setContent("<p></p>", "start");
        return;
      }

      const [note, error] = await safeRun(async () => await getNoteDB(currentOpenedNote.value));
      if (error) return;
      title.value = note.title;
      editorInstance.setContent(note.content);
    });

    const unsubscribeTitle = title.subscribe(() => {
      status.value = "Unsaved";
      // We will use manual save for title changes.
    });

    // regsiter shortcuts after app starts
    registerShortcut("note.save", saveNote);
    registerShortcut("note.delete", deleteNote);

    // unmouting
    return () => {
      if (splitInstance) splitInstance.destroy();
      unsubscribe();
      unsubscribeTitle();

      // unregister the shortcuts because we have used Preact
      unregisterShortcut("note.save");
      unregisterShortcut("note.delete");
    };
  }, []);

  return (
    <div className="editor" id="editor">
      <nav className="nav">
        <input
          type="text"
          className="title"
          maxLength="30"
          placeholder="Title"
          autocomplete="off"
          value={title.value}
          onChange={(e) => (title.value = e.target.value)}
        />
        {!isZenMode.value && (
          <button aria-label="Delete Note" title="Trash" className="btn trash" onClick={deleteNote}>
            <Trash size={20} />
          </button>
        )}

        {isMobile.value && !isZenMode.value && (
          <button
            aria-label="Open Sidebar"
            title="Menu"
            className="btn"
            onClick={() => (isSidebarOpen.value = true)}
          >
            <Menu size={20} />
          </button>
        )}
      </nav>
      <main ref={editorContainer} className="prosekit-container">
        <ProseKit editor={editorInstance}>
          <EditorContent saveNote={saveNote} editorInstance={editorInstance} status={status} />
        </ProseKit>
      </main>
      <Toolbar editorInstance={editorInstance} saveNote={saveNote} title={title.value}/> {/*Static Toolbar*/}
      {!isZenMode.value && <Footer status={status} />}
    </div>
  );
};

export default Editor;

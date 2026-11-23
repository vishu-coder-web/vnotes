import {
  Undo2,
  Redo2,
  Bold,
  BookOpen,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Link,
  Unlink,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Minus,
  Highlighter,
  Pilcrow,
  ListCollapse,
  Save,
  Share,
  Maximize,
  Clock,
  Calendar,
  Palette,
  ImagePlus,
  Table,
  Columns3,
  Rows3,
  Combine,
  X,
  Split,
} from "lucide-preact";

import { useEffect } from "preact/hooks";

import "./styles/toolbar.css";
import { safeRun } from "../utils/error_handler.js";
import { isZenMode } from "../store/notes.store.js";
import { showToolips, askInput } from "../store/notes.helper.js";
import { registerShortcut, unregisterShortcut } from "../utils/keyboard_shortcuts.js";
import { defineReadonly } from "prosekit/extensions/readonly";

const Toolbar = ({ editorInstance, saveNote, title }) => {
  let disableReadonly = null;


  const tasks = [
    // Text formatting
    {
      name: "bold",
      icon: <Bold size={20} />,
      action: () => editorInstance.commands.toggleBold(),
    },
    {
      name: "italic",
      icon: <Italic size={20} />,
      action: () => editorInstance.commands.toggleItalic(),
    },
    {
      name: "underline",
      icon: <Underline size={20} />,
      action: () => editorInstance.commands.toggleUnderline(),
    },
    {
      name: "strike",
      icon: <Strikethrough size={20} />,
      action: () => editorInstance.commands.toggleStrike(),
    },
    {
      name: "save",
      icon: <Save size={20} />,
      action: saveNote,
    },
    {
      name: "zen-mode",
      icon: <Maximize size={20} />,
      action: () => {
        isZenMode.value = !isZenMode.value;
        showToolips(`Zen Mode is ${isZenMode.value ? "On" : "Off"}`);
        return true;
      },
    },
    {
      name: "reading-mode",
      icon: <BookOpen size={20} />,
      action: () => {
        if(disableReadonly){
          disableReadonly?.();
          disableReadonly = null;
          showToolips("Reading Mode is Off");
        }else{
          disableReadonly = editorInstance.use(defineReadonly());
          showToolips("Reading Mode is On");
        }

        return true;
      },
    },
    {
      name: "add-link",
      icon: <Link size={20} />,
      action: () => {
        const fields = [{ type: "url", placeholder: "Enter Your Link", name: "Link" }];

        askInput("Add Link", fields, (action, values) => {
          if (action === "ok" && values.length !== 0) {
            editorInstance.commands.toggleLink({ href: values[0] });
          }
        });
        return true;
      },
    },
    {
      name: "remove-link",
      icon: <Unlink size={20} />,
      action: () => editorInstance.commands.removeLink(),
    },
    {
      name: "add-image",
      icon: <ImagePlus size={20} />,
      action: () => {
        const fields = [{ type: "url", placeholder: "Enter Your Image Url", name: "Image Url" }];

        askInput("Add Image", fields, (action, values) => {
          if (action === "ok" && values.length !== 0) {
            editorInstance.commands.insertImage({ src: values[0] });
          }
        });
        return true;
      },
    },
    {
      name: "text-color",
      icon: <Palette size={20} />,
      action: () => {
        const fields = [{ type: "color", value: "#FFFFFF", name: "Color Picker" }];

        askInput("Pick a Color", fields, (action, values) => {
          if (action === "ok" && values.length !== 0) {
            editorInstance.commands.addTextColor({ color: values[0]});
          }
        });
        return true;
      },
    },
    {
      name: "share",
      icon: <Share size={20} />,
      action: async () => {
        const content = editorInstance.getDocHTML();

        if (navigator.share) {
          await navigator.share({
            title: title.value,
            text: content,
            url: location.origin,
          });
        } else showToolips("Share not Supported", "alert");
        return true;
      },
    },
    // Tables
    {
      name: "table",
      icon: <Table size={20} />,
      action: () => {
        const fields = [
          {
            type: "number",
            name: "Rows",
            placeholder: "Enter Rows (0-10)",
          },
          {
            type: "number",
            name: "Columns",
            placeholder: "Enter Columns (0-10)",
          },
        ];

        askInput("Create Table", fields, (action, values) => {
          if (action === "ok" && values.length !== 0) {
            editorInstance.commands.insertTable({
              header: true,
              row: Number(values[0]),
              col: Number(values[1]),
            });
          }
        });

        return true;
      },
    },
    {
      name: "remove-table",
      icon: <X size={20} />,
      action: () => editorInstance.commands.deleteTable(),
    },
    {
      name: "add-table-row",
      icon: <Rows3 size={20} />,
      action: () => editorInstance.commands.addTableRowAbove(),
    },
    {
      name: "add-table-column",
      icon: <Columns3 size={20} />,
      action: () => editorInstance.commands.addTableColumnAfter(),
    },
    {
      name: "merge-table-cells",
      icon: <Combine size={20} />,
      action: () => editorInstance.commands.mergeTableCells(),
    },
    {
      name: "split-table-cell",
      icon: <Split size={20} />,
      action: () => editorInstance.commands.splitTableCell(),
    },
    {
      name: "paragraph",
      icon: <Pilcrow size={20} />,
      action: () => editorInstance.commands.setParagraph(),
    },
    // Headings
    {
      name: "heading-1",
      icon: <Heading1 size={20} />,
      action: () => editorInstance.commands.setHeading({ level: 1 }),
    },
    {
      name: "heading-2",
      icon: <Heading2 size={20} />,
      action: () => editorInstance.commands.setHeading({ level: 2 }),
    },
    {
      name: "heading-3",
      icon: <Heading3 size={20} />,
      action: () => editorInstance.commands.setHeading({ level: 3 }),
    },

    // Lists
    {
      name: "bullet-list",
      icon: <List size={20} />,
      action: () => editorInstance.commands.toggleList({ kind: "bullet" }),
    },
    {
      name: "ordered-list",
      icon: <ListOrdered size={20} />,
      action: () => editorInstance.commands.toggleList({ kind: "ordered" }),
    },
    {
      name: "task-list",
      icon: <ListChecks size={20} />,
      action: () => editorInstance.commands.toggleList({ kind: "task" }),
    },
    {
      name: "toggle-list",
      icon: <ListCollapse size={20} />,
      action: () => editorInstance.commands.toggleList({ kind: "toggle" }),
    },

    // Blocks
    {
      name: "blockquote",
      icon: <Quote size={20} />,
      action: () => editorInstance.commands.toggleBlockquote(),
    },
    {
      name: "code-block",
      icon: <Code2 size={20} />,
      action: () => editorInstance.commands.toggleCodeBlock(),
    },
    {
      name: "horizontal-rule",
      icon: <Minus size={20} />,
      action: () => editorInstance.commands.insertHorizontalRule(),
    },
    {
      name: "highlight",
      icon: <Highlighter size={20} />,
      action: () => editorInstance.commands.toggleHighlight(),
    },
    {
      name: "date",
      icon: <Calendar size={20} />,
      action: () => editorInstance.commands.insertText({ text: new Date().toLocaleDateString() }),
    },
    {
      name: "time",
      icon: <Clock size={20} />,
      action: () => editorInstance.commands.insertText({ text: new Date().toLocaleTimeString() }),
    },

    // Alignment
    {
      name: "align-left",
      icon: <AlignLeft size={20} />,
      action: () => editorInstance.commands.setTextAlign("left"),
    },
    {
      name: "align-center",
      icon: <AlignCenter size={20} />,
      action: () => editorInstance.commands.setTextAlign("center"),
    },
    {
      name: "align-right",
      icon: <AlignRight size={20} />,
      action: () => editorInstance.commands.setTextAlign("right"),
    },
    {
      name: "align-justify",
      icon: <AlignJustify size={20} />,
      action: () => editorInstance.commands.setTextAlign("justify"),
    },
  ];

  useEffect(() => {
    registerShortcut("editor.undo", () => editorInstance.commands.undo());
    registerShortcut("editor.redo", () => editorInstance.commands.redo());

    // register all functions as keyboard shortcuts.
    for (const task of tasks) {
      registerShortcut(`editor.${task.name}`, task.action);
    }

    return () => {
      for (const task of tasks) {
        unregisterShortcut(`editor.${task.name}`);
      }

      unregisterShortcut("editor.undo");
      unregisterShortcut("editor.redo");
    };
  }, []);

  return (
    <div className="toolbar">
      <button
        className="toolbar-btn"
        onMouseDown={(e) => e.preventDefault()}
        aria-label="Undo"
        title="Undo"
        disabled={!editorInstance.commands.undo.canExec()}
        onClick={() => editorInstance.commands.undo()}
      >
        <Undo2 size={20} />
      </button>
      <button
        className="toolbar-btn"
        onMouseDown={(e) => e.preventDefault()}
        aria-label="Redo"
        title="Redo"
        disabled={!editorInstance.commands.redo.canExec()}
        onClick={() => editorInstance.commands.redo()}
      >
        <Redo2 size={20} />
      </button>

      {tasks.map((task) => (
        <button
          className="toolbar-btn"
          aria-label={task.name}
          title={task.name}
          onMouseDown={(e) => e.preventDefault()}
          onClick={task.action}
        >
          {task.icon}
        </button>
      ))}
    </div>
  );
};

export default Toolbar;

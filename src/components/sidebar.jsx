import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { useLocation } from "wouter-preact";
import { Search, XIcon, Settings, BadgeAlert } from "lucide-preact";

import "./styles/sidebar.css";
import { currentOpenedNote, isSidebarOpen, isMobile } from "../store/notes.store.js";
import { searchNoteDB, notesQuery } from "../database/db.web.js";
import { safeRun } from "../utils/error_handler.js";

const Sidebar = () => {
  const notesList = useSignal([]); // Here, a note object must contain title, id (unique), content.
  const searchText = useSignal("");
  const [location, navigate] = useLocation();

  const searchNote = async (e) => {
    const [filteredNotes, error] = await safeRun(
      async () => await searchNoteDB(searchText.value.trim()),
    );

    if (error) return;

    notesList.value = filteredNotes;
  };

  const openNote = (e) => {
    currentOpenedNote.value = Number(e.target.dataset.id);
    if (location !== "/editor") navigate("/editor");
    isSidebarOpen.value = false;
  };

  const switchPage = (route) => {
    navigate(route);
    isSidebarOpen.value = false;
  };

  useEffect(() => {
    // We will kept it as it as.
    const subscription = notesQuery().subscribe({
      next: (notes) => {
        notesList.value = notes;
      },
      error: (e) => {
        console.log(e);
        showToolips(e.message || e.reason || "Error While Loading Notes!", "alert");
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  const renderSidebar = () => {
    if (isMobile.value && !isSidebarOpen.value) {
      return "close-sidebar";
    }

    return "";
  };

  return (
    <aside className={`sidebar ${renderSidebar()}`} id="sb">
      {/* Search box */}
      <div className="search">
        <input
          placeholder="Search Notes"
          onSearch={searchNote}
          type="search"
          value={searchText.value}
          onInput={(e) => (searchText.value = e.currentTarget.value)}
        />
        <button aria-label="Search Note" title="Search" className="search-btn" onClick={searchNote}>
          <Search size={18} />
        </button>
        {isMobile.value && (
          <button
            className="search-btn"
            onClick={() => (isSidebarOpen.value = !isSidebarOpen.value)}
            aria-label="Close Sidebar"
            title="Close"
          >
            <XIcon size={18} />
          </button>
        )}
      </div>

      {/* Note List */}
      <div className="notes-list">
        {notesList.value.map((note) => (
          <div
            className={`note-card ${note.id === currentOpenedNote.value ? "active" : ""}`}
            key={note.id}
            data-id={note.id}
            onClick={openNote}
          >
            <span className="title" data-id={note.id}>
              {note.title}
            </span>
          </div>
        ))}

        {notesList.value.length === 0 && (
          <div className="empty-note-card">
            <span>Create your first note.</span>
          </div>
        )}
      </div>

      <div className="navigation">
        <button
          aria-label="Navigate to About"
          title="About"
          className="navigation-btn"
          onClick={() => switchPage("/about")}
        >
          <BadgeAlert size={25} />
        </button>
        <button
          aria-label="Navigate to Settings"
          title="Settings"
          className="navigation-btn"
          onClick={() => switchPage("/settings")}
        >
          <Settings size={25} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

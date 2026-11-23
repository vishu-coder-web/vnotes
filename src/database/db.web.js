import { Dexie, liveQuery } from "dexie";

const db = new Dexie("VNotes");
db.version(1).stores({
  notes: "++id, title",
  content: "++id, noteid, content",
});

// all function of this file must end with 'DB' surffix.
// this file just exports functions for crud and does not handle UI logic.

export const getAllNotesDB = () => db.notes.toArray();
export const searchNoteDB = (search) =>
  db.notes.filter((note) => note.title.toLowerCase().includes(search.toLowerCase())).toArray();

export const createNoteDB = (note) =>
  db.transaction("rw", db.notes, db.content, async () => {
    const createdNoteId = await db.notes.add({ title: note.title });
    const createdNoteContentId = await db.content.add({
      noteid: createdNoteId,
      content: note.content,
    });

    return [createdNoteId, createdNoteContentId];
  });

export const getNoteDB = (id) =>
  db.transaction("rw", db.notes, db.content, async () => {
    const note = await db.notes.get(id);
    const content = await db.content.where("noteid").equals(note.id).first();

    return { title: note.title, content: content.content };
  });

export const deleteNoteDB = (id) =>
  db.transaction("rw", db.notes, db.content, async () => {
    const isSucessful = await db.notes.delete(id);
    const contentId = await db.content.where("noteid").equals(id).first();
    const isSucessful2 = await db.content.delete(contentId.id);

    return [isSucessful, isSucessful2];
  });

export const updateNoteDB = (id, title, content) =>
  db.transaction("rw", db.notes, db.content, async () => {
    const isSucessful = await db.notes.update(id, { title });
    const contentId = await db.content.where("noteid").equals(id).first();

    const isSucessful2 = await db.content.update(contentId.id, { content });

    return [isSucessful, isSucessful2];
  });

export const notesQuery = () => liveQuery(() => db.notes.toArray());

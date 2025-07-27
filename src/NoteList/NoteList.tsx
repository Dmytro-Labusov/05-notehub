// src/components/NoteList/NoteList.tsx
import type { Note } from "../types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
  onEdit: (note: Note) => void;
}

export default function NoteList({ notes, onDelete, onEdit }: NoteListProps) {
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <div className={css.actions}>
              <button
                type="button"
                className={css.editButton}
                onClick={() => onEdit(note)}
              >
                Edit
              </button>
              <button
                type="button"
                className={css.deleteButton}
                onClick={() => onDelete(note.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

import type { Note } from "../types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
  onEdit: (note: Note) => void;
}

export default function NoteList({ notes, onDelete, onEdit }: NoteListProps) {
  if (notes.length === 0) {
    return <p className={css.empty}>No notes available.</p>;
  }

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

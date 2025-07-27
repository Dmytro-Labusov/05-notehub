import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  fetchNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../services/noteService";
import type { Note } from "../types/note";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import toast, { Toaster } from "react-hot-toast";
import useDebounce from "../hooks/useDebounce";
import css from "./App.module.css";

export default function App() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  useEffect(() => {
    setSearch(debouncedSearch);
    setPage(1);
  }, [debouncedSearch]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Note | null>(null);

  const createMutation = useMutation<
    { title: string; content: string; tag: Note["tag"] }, // argument type
    unknown, // error type
    { title: string; content: string; tag: Note["tag"] } // variables type
  >({
    mutationFn: createNote,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });
  const updateMutation = useMutation<
    { id: string; title: string; content: string; tag: Note["tag"] }, // argument type
    unknown, // error type
    { id: string; title: string; content: string; tag: Note["tag"] } // variables type
  >({
    mutationFn: updateNote,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });

  const { data, isSuccess } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes(page, 12, search),
    staleTime: 5000,
    placeholderData: { data: [], totalPages: 1 },
  });

  useEffect(() => {
    if (isSuccess && data?.data.length === 0) {
      toast(t("noNotes"));
    }
  }, [isSuccess, data]);

  const handleSearch = (term: string) => {
    setSearch(term);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    await deleteNote(id);
    await qc.invalidateQueries({ queryKey: ["notes"] });
  };

  const handleSave = async (values: {
    title: string;
    content: string;
    tag: Note["tag"];
  }) => {
    if (selected) {
      await updateMutation.mutateAsync({ id: selected.id, ...values });
    } else {
      await createMutation.mutateAsync(values);
    }
    setModalOpen(false);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-right" />
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={page}
            pageCount={data.totalPages}
            onPageChange={(p) => setPage(p)}
          />
        )}
        <button
          className={css.createBtn}
          onClick={() => {
            setSelected(null);
            setModalOpen(true);
          }}
        >
          Create note +
        </button>
      </header>

      {data && data.data.length > 0 && (
        <NoteList
          notes={data.data}
          onDelete={handleDelete}
          onEdit={(note) => {
            setSelected(note);
            setModalOpen(true);
          }}
        />
      )}

      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <NoteForm initial={selected} onSubmit={handleSave} />
        </Modal>
      )}
    </div>
  );
}
function t(key: string): string {
  const messages: Record<string, string> = {
    noNotes: "No notes found.",
  };
  return messages[key] || key;
}

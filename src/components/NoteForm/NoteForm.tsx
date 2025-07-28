import { Formik, Form, Field, ErrorMessage as FormikError } from "formik";
import * as yup from "yup";
import type { Note } from "../../types/note";
import css from "./NoteForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";

interface NoteFormProps {
  initial?: Note | null;
  onSubmit: (values: {
    title: string;
    content: string;
    tag: Note["tag"];
  }) => void | Promise<void>;
  onClose: () => void;
}

const validationSchema = yup.object({
  title: yup
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be 50 characters or less")
    .required("Title is required"),
  content: yup.string().max(500, "Content must be 500 characters or less"),
  tag: yup
    .mixed<Note["tag"]>()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
  });

  return (
    <Formik
      initialValues={{
        title: "",
        content: "",
        tag: "Todo" as Note["tag"],
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        mutation.mutate(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" className={css.input} />
            <FormikError name="title">
              {(msg) => <span className={css.error}>{msg}</span>}
            </FormikError>
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <FormikError name="content">
              {(msg) => <span className={css.error}>{msg}</span>}
            </FormikError>
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <FormikError name="tag">
              {(msg) => <span className={css.error}>{msg}</span>}
            </FormikError>
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

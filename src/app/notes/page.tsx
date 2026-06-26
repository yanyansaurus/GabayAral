"use client";

import { useState, useEffect } from "react";
import { Plus, FileText, Trash2, Zap, Clock, BookOpen } from "lucide-react";
import NoteEditor from "@/components/notes/note-editor";
import ConverterModal from "@/components/notes/converter-modal";
import { useApp } from "@/context/app-context";

export interface Note {
  id: string;
  title: string;
  subject: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "gabayal_notes";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function NotesPage() {
  const { profile, addPoints, trackActivity } = useApp();
  const language = profile?.language || "Filipino";
  const educationLevel = profile?.educationLevel || "SHS";

  const t = (fil: string, eng: string) => (language === "Filipino" ? fil : eng);

  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [convertingNote, setConvertingNote] = useState<Note | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setNotes(JSON.parse(stored));
  }, []);

  const saveNotes = (updated: Note[]) => {
    setNotes(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleSave = (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    if (editingNote) {
      const updated = notes.map((n) =>
        n.id === editingNote.id
          ? { ...n, ...note, updatedAt: new Date().toISOString() }
          : n
      );
      saveNotes(updated);
    } else {
      const newNote: Note = {
        ...note,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveNotes([newNote, ...notes]);
      addPoints(15);
      trackActivity("notesCreated");
    }
    setIsEditorOpen(false);
    setEditingNote(null);
  };

  const handleDelete = (id: string) => {
    saveNotes(notes.filter((n) => n.id !== id));
  };

  const openNew = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  const openEdit = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 lg:mb-8">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{t("Mga Tala Ko", "My Notes")}</h1>
          <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">
            {notes.length} {notes.length === 1 ? t("tala", "note") : t("mga tala", "notes")} · {t("I-convert sa flashcard o quiz!", "Convert to flashcards or quiz!")}
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-gradient-to-r from-[#6C63FF] to-[#4F46E5] text-white px-4 lg:px-5 py-2.5 lg:py-3 rounded-2xl font-semibold text-sm shadow-lg shadow-indigo-200 hover:scale-[1.02] transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> {t("Bagong Tala", "New Note")}
        </button>
      </div>

      {/* Empty State */}
      {notes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 lg:py-20 bg-white dark:bg-[#15171C] rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm text-center px-6">
          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl flex items-center justify-center mb-5">
            <FileText className="w-8 h-8 lg:w-10 lg:h-10 text-[#6C63FF]" />
          </div>
          <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-2">{t("Wala pang mga tala", "No notes yet")}</h2>
          <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-sm max-w-xs mb-6">
            {t(
              "Gumawa ng iyong unang tala at i-convert ito sa flashcards o quiz!",
              "Create your first note and convert it to flashcards or quiz!"
            )}
          </p>
          <button
            onClick={openNew}
            className="bg-gradient-to-r from-[#6C63FF] to-[#4F46E5] text-white px-6 py-3 rounded-2xl font-semibold text-sm shadow-md shadow-indigo-200 active:scale-95"
          >
            + {t("Gumawa ng Tala", "Create Note")}
          </button>
        </div>
      )}

      {/* Notes Grid */}
      {notes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white dark:bg-[#15171C] rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-gray-200 dark:border-gray-700 transition-all duration-200 flex flex-col overflow-hidden group"
            >
              {/* Top color strip */}
              <div className="h-1.5 bg-gradient-to-r from-[#6C63FF] to-[#00C2A8]" />

              <div className="p-4 lg:p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-[#6C63FF]" />
                    </div>
                    <span className="text-xs font-semibold text-[#6C63FF] bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-lg">
                      {note.subject || "General"}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-bold text-gray-900 dark:text-white text-sm lg:text-base mb-2 line-clamp-2">
                  {note.title || t("Walang Pamagat", "Untitled")}
                </h3>

                <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 flex-1 line-clamp-3 leading-relaxed mb-3">
                  {note.content || t("Walang laman...", "No content...")}
                </p>

                <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 mb-3">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  {formatDate(note.updatedAt)}
                  <span className="mx-2">·</span>
                  {note.content.length} chars
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => openEdit(note)}
                    className="flex-1 text-xs lg:text-sm font-semibold py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:bg-[#1E232B] transition-colors text-center active:scale-95"
                  >
                    {t("Buksan", "Open")}
                  </button>
                  <button
                    onClick={() => setConvertingNote(note)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs lg:text-sm font-semibold py-2.5 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#4F46E5] text-white shadow-sm hover:scale-[1.02] transition-all active:scale-95"
                  >
                    <Zap className="w-3.5 h-3.5" /> {t("I-convert", "Convert")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note Editor Modal */}
      {isEditorOpen && (
        <NoteEditor
          note={editingNote}
          onSave={handleSave}
          onClose={() => { setIsEditorOpen(false); setEditingNote(null); }}
        />
      )}

      {/* Converter Modal */}
      {convertingNote && (
        <ConverterModal
          note={convertingNote}
          educationLevel={educationLevel}
          onClose={() => setConvertingNote(null)}
        />
      )}
    </div>
  );
}

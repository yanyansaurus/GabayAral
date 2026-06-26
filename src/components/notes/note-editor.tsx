"use client";

import { useState, useEffect } from "react";
import { X, Save, BookOpen } from "lucide-react";
import type { Note } from "@/app/notes/page";

interface Props {
  note: Note | null;
  onSave: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  onClose: () => void;
}

const subjects = [
  "Math", "Science", "Filipino", "English", "Araling Panlipunan",
  "MAPEH", "TLE", "Values Education", "General", "Ibang paksa",
];

export default function NoteEditor({ note, onSave, onClose }: Props) {
  const [title, setTitle] = useState(note?.title || "");
  const [subject, setSubject] = useState(note?.subject || "General");
  const [content, setContent] = useState(note?.content || "");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setSubject(note.subject);
      setContent(note.content);
    }
  }, [note]);

  const handleSave = () => {
    onSave({ title, subject, content });
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E293B]/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white dark:bg-[#15171C] rounded-3xl shadow-2xl flex flex-col overflow-hidden" style={{ maxHeight: "90vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#6C63FF]" />
            </div>
            <h2 className="font-bold text-gray-900 dark:text-white text-lg">
              {note ? "I-edit ang Tala" : "Bagong Tala"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:bg-gray-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Pamagat ng Aralin
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Hal. Photosynthesis, Fractions, Sanaysay..."
              className="w-full border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF] transition-all placeholder-gray-300"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Paksa
            </label>
            <div className="flex flex-wrap gap-2">
              {subjects.map((s) => (
                <button
                  key={s}
                  onClick={() => setSubject(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    subject === s
                      ? "bg-[#6C63FF] text-white border-[#6C63FF] shadow-sm"
                      : "bg-white dark:bg-[#15171C] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#6C63FF]/50 hover:text-[#6C63FF]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Mga Tala
              </label>
              <span className="text-xs text-gray-400 dark:text-gray-500">{wordCount} salita · {content.length} chars</span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Isulat ang iyong mga tala dito...\n\nHalimbawa:\n• Ang photosynthesis ay...\n• Ang proseso nito ay...\n• Mga kailangan:\n  - Sikat ng araw\n  - Tubig\n  - Carbon dioxide`}
              rows={12}
              className="w-full border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF] transition-all resize-none font-mono leading-relaxed placeholder-gray-300"
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              💡 Tip: Mas maraming detalye = mas magandang flashcards at quiz na mage-generate!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:bg-[#1E232B] transition-colors"
          >
            Kanselahin
          </button>
          <button
            onClick={handleSave}
            disabled={!title || !content}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              title && content
                ? "bg-gradient-to-r from-[#6C63FF] to-[#4F46E5] text-white shadow-md hover:scale-[1.02]"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            }`}
          >
            <Save className="w-4 h-4" /> I-save ang Tala
          </button>
        </div>
      </div>
    </div>
  );
}

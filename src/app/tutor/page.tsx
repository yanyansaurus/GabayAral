"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, Sparkles, RefreshCw, BookOpen, Star, Image as ImageIcon, X, Layers, BrainCircuit, BookmarkPlus } from "lucide-react";
import { useApp } from "@/context/app-context";

interface Message {
  role: "user" | "assistant";
  content: string;
  image?: string;
}

import "katex/dist/katex.min.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

function MessageContent({ content, isUser }: { content: string; isUser: boolean }) {
  if (isUser) {
    return <span className="whitespace-pre-wrap">{content}</span>;
  }
  return (
    <div className="chat-markdown prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:p-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

// ─── Save Note Modal ──────────────────────────────────────
function SaveNoteModal({
  isOpen,
  onClose,
  initialContent,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialContent: string;
  onSave: (title: string, subject: string, content: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Computer Science");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (isOpen) {
      setContent(initialContent);
      setTitle(""); // Reset title on open
    }
  }, [isOpen, initialContent]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#15171C] w-full max-w-md rounded-3xl shadow-2xl p-5 sm:p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#6C63FF]" />
            Save to Notes
          </h2>
          <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-500 dark:text-gray-400 dark:text-gray-500 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Intro to Limits"
              className="w-full bg-gray-50 dark:bg-[#1E232B] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Math, Computer Science"
              className="w-full bg-gray-50 dark:bg-[#1E232B] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">Content</label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#1E232B] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-xl transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onSave(title || "Untitled Note", subject || "General", content)}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-br from-[#6C63FF] to-[#4F46E5] rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Points Toast ─────────────────────────────────────────
function PointsToast({ points, message }: { points: number; message: string }) {
  return (
    <div className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-toast">
      <div className="bg-gradient-to-r from-[#6C63FF] to-[#4F46E5] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-bold">
        <Star className="w-4 h-4 text-[#F59E0B]" />
        +{points} pts — {message}
      </div>
    </div>
  );
}

// ─── Typing Indicator ─────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#4F46E5] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
        <Bot className="w-4 h-4" />
      </div>
      <div className="bg-white dark:bg-[#15171C] border border-gray-100 dark:border-gray-800 rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-[#6C63FF] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-[#6C63FF] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-[#6C63FF] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────
function MessageBubble({ msg, onSaveNote }: { msg: Message, onSaveNote: (content: string) => void }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : ""} animate-fade-in`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
          isUser
            ? "bg-gradient-to-br from-[#00C2A8] to-[#059669] text-white"
            : "bg-gradient-to-br from-[#6C63FF] to-[#4F46E5] text-white"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div
        className={`max-w-[80%] sm:max-w-[75%] px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
          isUser
            ? "bg-gradient-to-br from-[#6C63FF] to-[#4F46E5] text-white rounded-br-sm"
            : "bg-white dark:bg-[#15171C] border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-sm"
        }`}
      >
        {msg.image && (
          <img src={msg.image} alt="Uploaded" className="max-w-full rounded-xl mb-3 border border-white/20" />
        )}
        <MessageContent content={msg.content} isUser={isUser} />
        {!isUser && (
          <button 
            onClick={() => onSaveNote(msg.content)} 
            className="mt-3 text-xs font-semibold flex items-center gap-1.5 text-indigo-500 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-900/20/50 hover:bg-indigo-50 dark:bg-indigo-900/20 px-2.5 py-1.5 rounded-lg transition-all w-fit border border-indigo-100 dark:border-indigo-800/50"
          >
            <BookmarkPlus className="w-3.5 h-3.5" /> Save to Notes
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────
export default function TutorPage() {
  const { profile, addPoints, trackActivity } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ points: number; message: string } | null>(null);
  const [mode, setMode] = useState<"general" | "deep_learning">("general");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [saveNoteContent, setSaveNoteContent] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const educationLevel = profile?.educationLevel || "SHS";
  const studentName = profile?.name || "Estudyante";
  const language = profile?.language || "Filipino";

  const t = useCallback(
    (fil: string, eng: string) => (language === "Filipino" ? fil : eng),
    [language]
  );

  // Initial greeting
  useEffect(() => {
    const greeting =
      language === "Filipino"
        ? `Kumusta, ${studentName}! 👋 Ako si Gabay, ang iyong AI study buddy!\n\nHindi ako tulad ng ibang tutor na puro lecture — dito, mag-uusap lang tayo tungkol sa gusto mong aralin. 📚\n\n**Ano ang gusto mong pag-aralan ngayon?** Sabihin mo lang, at tayo'y magsisimula! 🎯`
        : `Hey ${studentName}! 👋 I'm Gabay, your AI study buddy!\n\nI'm not like other tutors who just lecture — here, we'll have a conversation about what you want to learn. 📚\n\n**What would you like to study today?** Just tell me, and let's get started! 🎯`;

    setMessages([{ role: "assistant", content: greeting }]);
  }, [studentName, language]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Show toast
  const showToast = (points: number, message: string) => {
    setToast({ points, message });
    setTimeout(() => setToast(null), 3000);
  };

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if ((!messageText && !selectedImage) || loading) return;

    const userMsg: Message = { role: "user", content: messageText, image: selectedImage || undefined };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    
    // Save image ref for request, then clear UI state immediately
    const imgToSend = selectedImage;
    setSelectedImage(null);
    setLoading(true);

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    try {
      const history = updatedMessages.slice(0, -1).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          image: imgToSend,
          mode,
          educationLevel,
          history,
          studentName,
          language,
          school: profile?.school,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);

      // Award points for asking a question
      addPoints(5);
      trackActivity("questionsAsked");
      showToast(5, t("Magandang tanong!", "Great question!"));
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: t(
            "Pasensya na! May problema sa koneksyon. Subukan muli. 🙏",
            "Sorry! Connection issue. Please try again. 🙏"
          ),
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearChat = () => {
    const msg =
      language === "Filipino"
        ? `Chat cleared! 🧹 Kumusta ${studentName}! Ano ang gusto mong pag-aralan ngayon?`
        : `Chat cleared! 🧹 Hey ${studentName}! What would you like to study today?`;
    setMessages([{ role: "assistant", content: msg }]);
  };

  const starters =
    language === "Filipino"
      ? [
          "Gusto ko matuto ng Calculus",
          "Ituro mo sa akin ang photosynthesis",
          "Paano gumagana ang supply and demand?",
          "Turuan mo ako ng Filipino essay writing",
        ]
      : [
          "I want to learn about Calculus",
          "Teach me about photosynthesis",
          "How does supply and demand work?",
          "Help me with essay writing",
        ];

  const handleSaveNote = (title: string, subject: string, content: string) => {
    // Save to local storage notes
    const stored = localStorage.getItem("gabayal_notes");
    const notes = stored ? JSON.parse(stored) : [];
    const newNote = {
      id: Date.now().toString(),
      title,
      subject,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    notes.unshift(newNote);
    localStorage.setItem("gabayal_notes", JSON.stringify(notes));

    // Award points and track
    addPoints(15);
    trackActivity("notesCreated");
    showToast(15, t("Note Saved!", "Note Saved!"));
    
    // Close modal
    setSaveNoteContent(null);
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col" style={{ height: "calc(100vh - 5rem - 4rem)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#4F46E5] flex items-center justify-center text-white shadow-lg shadow-indigo-200 relative">
            <Bot className="w-5 h-5 lg:w-6 lg:h-6" />
            <Sparkles className="absolute -top-1 -right-1 w-3.5 h-3.5 text-[#F59E0B]" />
          </div>
          <div>
            <h1 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">Gabay AI</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">Online · {educationLevel}</span>
            </div>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:text-gray-200 bg-white dark:bg-[#15171C] border border-gray-100 dark:border-gray-800 px-3 py-2 rounded-xl hover:bg-gray-50 dark:bg-[#1E232B] transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t("Bagong Chat", "New Chat")}</span>
        </button>
      </div>

      {/* Mode Toggle */}
      <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-3 self-center w-full max-w-sm">
        <button
          onClick={() => setMode("general")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            mode === "general"
              ? "bg-white dark:bg-[#15171C] text-[#6C63FF] shadow-sm"
              : "text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:text-gray-200"
          }`}
        >
          <Layers className="w-4 h-4" />
          {t("General Mode", "General Mode")}
        </button>
        <button
          onClick={() => setMode("deep_learning")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            mode === "deep_learning"
              ? "bg-white dark:bg-[#15171C] text-indigo-700 shadow-sm"
              : "text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:text-gray-200"
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          {t("Deep Learning", "Deep Learning")}
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-[#15171C] rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 lg:p-6 space-y-4 min-h-0 custom-scrollbar">
        {/* Suggestion chips — only show on fresh chat */}
        {messages.length === 1 && (
          <div className="mt-2 animate-fade-in">
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-2.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              {t("Mga mungkahing tanong:", "Suggested questions:")}
            </p>
            <div className="flex flex-wrap gap-2">
              {starters.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className="text-xs bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 text-[#6C63FF] border border-indigo-100 dark:border-indigo-800/50 px-3 py-2 rounded-xl transition-colors active:scale-95"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} onSaveNote={setSaveNoteContent} />
        ))}

        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="mt-3 bg-white dark:bg-[#15171C] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-3 flex flex-col gap-2">
        {selectedImage && (
          <div className="relative inline-block self-start">
            <img src={selectedImage} alt="Preview" className="h-20 rounded-lg border border-gray-200 dark:border-gray-700 object-cover" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <div className="flex gap-2.5 items-end">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-gray-400 dark:text-gray-500 hover:text-[#6C63FF] hover:bg-indigo-50 dark:bg-indigo-900/20 transition-colors"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
            }}
            onKeyDown={handleKeyDown}
            placeholder={t("Magtanong kay Gabay...", "Ask Gabay...")}
            className="flex-1 resize-none outline-none text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 bg-transparent py-2.5 px-0 max-h-[100px] overflow-y-auto min-h-[44px]"
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={(!input.trim() && !selectedImage) || loading}
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
              (input.trim() || selectedImage) && !loading
                ? "bg-gradient-to-br from-[#6C63FF] to-[#4F46E5] text-white shadow-md shadow-indigo-200 hover:scale-105 active:scale-95"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-center text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 mb-1">
        {t("Gabay AI ay maaaring magkamali. I-verify ang mahahalagang impormasyon.", "Gabay AI may make mistakes. Verify important information.")}
      </p>

      {/* Points Toast */}
      {toast && <PointsToast points={toast.points} message={toast.message} />}

      {/* Save Note Modal */}
      <SaveNoteModal
        isOpen={!!saveNoteContent}
        initialContent={saveNoteContent || ""}
        onClose={() => setSaveNoteContent(null)}
        onSave={handleSaveNote}
      />
    </div>
  );
}

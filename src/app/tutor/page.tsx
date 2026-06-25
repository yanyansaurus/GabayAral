"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, RefreshCw, BookOpen } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const EDUCATION_KEY = "gabayal_education_level";

const starters = [
  "Ipaliwanag ang photosynthesis sa madaling salita",
  "Ano ang pagkakaiba ng mitosis at meiosis?",
  "Tulungan mo akong maintindihan ang fractions",
  "Paano gumagana ang sistema ng pamahalaan sa Pilipinas?",
  "Ano ang ibig sabihin ng Renaissance?",
  "Paano ko maisusulat ang isang magandang sanaysay?",
];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#4F46E5] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
        <Bot className="w-4 h-4" />
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-[#6C63FF] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-[#6C63FF] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-[#6C63FF] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex items-end gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
          isUser
            ? "bg-gradient-to-br from-[#00C2A8] to-[#059669] text-white"
            : "bg-gradient-to-br from-[#6C63FF] to-[#4F46E5] text-white"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[75%] px-5 py-3.5 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-gradient-to-br from-[#6C63FF] to-[#4F46E5] text-white rounded-br-sm"
            : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm"
        }`}
      >
        {msg.content}
      </div>
    </div>
  );
}

export default function TutorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [educationLevel, setEducationLevel] = useState("SHS");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(EDUCATION_KEY);
    if (stored) setEducationLevel(stored);

    // Initial greeting
    setMessages([
      {
        role: "assistant",
        content: `Kumusta! 👋 Ako si Gabay, ang iyong AI tutor mula sa GabayAral!\n\nHanda akong tumulong sa'yo sa kahit anong paksa — Math, Science, Filipino, Araling Panlipunan, at marami pa! 📚\n\nAno ang gusto mong pag-aralan ngayon?`,
      },
    ]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    const userMsg: Message = { role: "user", content: messageText };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

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
          educationLevel,
          history,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Pasensya na! May problema sa koneksyon. Subukan muli. 🙏",
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

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: `Chat cleared! 🧹 Kumusta! Ako si Gabay — ano ang gusto mong pag-aralan ngayon?`,
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col" style={{ height: "calc(100vh - 5rem - 4rem)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#4F46E5] flex items-center justify-center text-white shadow-lg shadow-indigo-200 relative">
            <Bot className="w-6 h-6" />
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-[#F59E0B]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Gabay AI Tutor</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-gray-500">Online · {educationLevel} Mode</span>
            </div>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 bg-white border border-gray-100 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Bagong Chat
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5 min-h-0">
        {messages.length === 1 && (
          <div className="mt-4">
            <p className="text-xs text-gray-400 font-medium mb-3 flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" /> Mga mungkahing tanong:
            </p>
            <div className="flex flex-wrap gap-2">
              {starters.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className="text-xs bg-indigo-50 hover:bg-indigo-100 text-[#6C63FF] border border-indigo-100 px-3 py-2 rounded-xl transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}

        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex gap-3 items-end">
        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
          }}
          onKeyDown={handleKeyDown}
          placeholder="Magtanong kay Gabay... (Enter para magpadala)"
          className="flex-1 resize-none outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent py-2 px-2 max-h-[120px] overflow-y-auto"
          disabled={loading}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
            input.trim() && !loading
              ? "bg-gradient-to-br from-[#6C63FF] to-[#4F46E5] text-white shadow-md shadow-indigo-200 hover:scale-105"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      <p className="text-center text-xs text-gray-400 mt-2">
        Gabay AI ay maaaring magkamali. I-verify ang mahahalagang impormasyon.
      </p>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Bot, Sparkles, User, RefreshCw, Trash2 } from "lucide-react";
import { ScanResult } from "../types";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface CareerChatProps {
  score: number;
  cvText: string;
  jobDescription: string;
  scanResult: ScanResult | null;
}

export function CareerChat({ score, cvText, jobDescription, scanResult }: CareerChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Halo! Saya adalah Konsultan Karir AI & ATS Specialist Anda. Scan CV Anda terlebih dahulu, lalu tanyakan apa saja kepada saya untuk menaikkan skor CV Anda, seperti penulisan ulang bullet point, saran sertifikasi, atau penyesuaian hard-skills!"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to lowest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (messageText: string) => {
    if (!messageText.trim() || loading) return;

    const userMessage: Message = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          history: messages,
          cvText,
          jobDescription,
          score,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Terjadi galat pada server saat berkirim pesan.");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ Error: ${err.message || "Gagal mendapatkan respon dari AI."}` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetQuestion = (quest: string) => {
    handleSend(quest);
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Halo! Sesi obrolan telah disetel ulang. Apa yang bisa saya bantu sekarang untuk memperkuat resume CV Anda?"
      }
    ]);
  };

  // Pre-determined consulting questions
  const quickQuestions = [
    "Bagaimana menulis ulang ringkasan CV agar menarik bagi perekrut?",
    "Formula STAR untuk melamar lowongan ini seperti apa?",
    "Keahlian pendukung apa yang disarankan untuk ditambahkan?",
  ];

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm flex flex-col h-[520px]">
      
      {/* Header Chat */}
      <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-display font-bold text-stone-900 text-sm">
              Asisten Karir AI
            </h4>
            <span className="text-[10px] text-stone-500 font-sans flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Online • Siap Membimbing
            </span>
          </div>
        </div>
        
        <button
          onClick={clearChat}
          title="Reset Obrolan"
          className="text-stone-400 hover:text-stone-600 hover:bg-stone-50 p-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 mb-3 text-sm scrollbar-thin">
        {messages.map((msg, i) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={i}
              className={`flex items-start gap-2 ${isUser ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar Icon */}
              <div className={`h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                isUser ? "bg-stone-100 text-stone-700" : "bg-orange-100 text-orange-600"
              }`}>
                {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
              </div>

              {/* Message bubble */}
              <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                isUser
                  ? "bg-stone-850 text-white rounded-tr-none"
                  : "bg-stone-50 text-stone-800 border border-stone-200/50 rounded-tl-none font-sans"
              }`}>
                {msg.content}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-2">
            <div className="h-7 w-7 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0 text-orange-600">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            </div>
            <div className="bg-stone-50 border border-stone-200/55 text-stone-500 px-3.5 py-2.5 rounded-2xl rounded-tl-none flex items-center gap-2">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0.4s]"></span>
              </span>
              <span>Karier Konsultan sedang mengetik...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset Query Badges */}
      <div className="mb-3 space-y-1">
        <label className="text-[10px] font-mono uppercase tracking-wide text-stone-400 block font-semibold">
          Pertanyaan Rekomendasi:
        </label>
        <div className="flex flex-wrap gap-1.5">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetQuestion(q)}
              disabled={loading}
              className="text-left text-[11px] bg-stone-50 hover:bg-orange-50/50 border border-stone-200 hover:border-orange-200 text-stone-605 hover:text-stone-800 py-1 px-2 rounded-lg transition-all line-clamp-1 disabled:opacity-50 cursor-pointer active:scale-95"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={score > 0 ? "Tanyakan penulisan CV Anda..." : "Lakukan scan terlebih dahulu..."}
          disabled={loading}
          className="flex-1 bg-stone-50 border border-stone-200 text-stone-800 focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 rounded-xl px-3.5 py-2 text-xs transition-all outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white rounded-xl px-3.5 py-2 transition-all flex items-center justify-center cursor-pointer active:scale-95"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

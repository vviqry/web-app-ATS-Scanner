import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Lazy initializer for Google GenAI to prevent startup failures if key is missing
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please add it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      }
    });
  }
  return aiClient;
}

// POST /api/scan endpoint - analyzes CV text and matches keywords
app.post("/api/scan", async (req, res) => {
  try {
    const { cvText, jobDescription } = req.body;

    if (!cvText || !cvText.trim()) {
      return res.status(400).json({ error: "Teks CV harus diisi atau diupload dari dokumen." });
    }
    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ error: "Deskripsi lowongan kerja (Loker) harus diisi." });
    }

    const ai = getAi();
    
    const prompt = `
Anda adalah seorang ATS (Applicant Tracking System) Optimization Engineer senior dan recruiter profesional tingkat tinggi.
Analisis CV (Curriculum Vitae) berikut dan bandingkan dengan deskripsi lowongan kerja (Loker) yang disediakan.

Tugas Anda:
1. Hitung tingkat kecocokan (score) dalam skala 0 hingga 100 berdasarkan relevansi keterampilan teknis, tools, pengalaman kerja, bahasa pemrograman, metodologi, sertifikasi, dan soft skills yang dibutuhkan loker dengan apa yang tercantum di CV.
2. Identifikasi kata kunci/skills penting yang COCOK (matched) antara CV dan Loker.
3. Identifikasi kata kunci/skills penting yang HILANG (missing) di CV tetapi sangat penting bagi Loker tersebut.
4. Buat rangkuman analisis kecocokan peran yang objektif, mendalam, dan konstruktif dalam bahasa Indonesia.
5. Sediakan Saran Revisi (revisionSuggestions) dinamis: Berikan contoh konkret kalimat penulisan ulang bullet point pengalaman kerja atau ringkasan profesional di CV sehingga kata kunci penting yang hilang tersebut dapat disisipkan secara mulus dan berbobot (action-oriented, menggunakan metode XYZ Google atau STAR).

---
DESKRIPSI LOKER:
${jobDescription}

---
TEKS CV PENGGUNA:
${cvText}
---
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.INTEGER,
              description: "Skor kecocokan ATS dari 0 sampai 100.",
            },
            summaryText: {
              type: Type.STRING,
              description: "Catatan analisis profesional kecocokan peran dalam Bahasa Indonesia.",
            },
            matchedKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Kata kunci penting (hard skill, tools, sertifikasi) yang sudah ada di CV.",
            },
            missingKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Kata kunci penting yang ada di loker tetapi hilang atau kurang tereksploitasi di CV.",
            },
            revisionSuggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: {
                    type: Type.STRING,
                    description: "Kategori revisi, contoh: 'Keterampilan Teknis', 'Deskripsi Pengalaman', 'Sertifikasi'.",
                  },
                  originalPhrase: {
                    type: Type.STRING,
                    description: "Kalimat asli yang kurang maksimal dari CV pengguna (atau tulis 'Belum dicantumkan' bila tidak ada).",
                  },
                  suggestedPhrase: {
                    type: Type.STRING,
                    description: "Rekomendasi kalimat baru yang profesional, terukur, dan mengandung kata kunci yang hilang untuk ditaruh di CV.",
                  },
                  explanation: {
                    type: Type.STRING,
                    description: "Penjelasan mengapa saran revisi ini penting untuk lolos filter ATS.",
                  },
                },
                required: ["category", "originalPhrase", "suggestedPhrase", "explanation"],
              },
            },
          },
          required: [
            "score",
            "summaryText",
            "matchedKeywords",
            "missingKeywords",
            "revisionSuggestions",
          ],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Gagal mengambil respon analisis terstruktur dari AI.");
    }

    const parsedResult = JSON.parse(jsonText.trim());
    return res.json(parsedResult);
  } catch (error: any) {
    console.error("Error during scanning:", error);
    return res.status(500).json({
      error: error.message || "Terjadi kesalahan internal ketika memproses analisis ATS.",
    });
  }
});

// POST /api/chat endpoint - Career Consulting chatbot on the scan context
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, cvText, jobDescription, score } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Pesan tidak boleh kosong." });
    }

    const ai = getAi();
    
    const systemInstruction = `
Anda adalah "Asisten Konsultan Karier AI & ATS Expert" khusus Pemindai ATS Pintar. Peran Anda adalah membimbing pencari kerja untuk mengoptimalkan CV mereka agar lolos screening ATS dan menonjol di mata recruiter.

Konteks Sesi Pengguna saat ini:
- Skor ATS Terakhir: ${score || "Belum discan"}/100
- Deskripsi lowongan kerja (Loker): ${jobDescription ? jobDescription.slice(0, 800) + "..." : "Belum diisi"}
- Teks CV Pengguna: ${cvText ? cvText.slice(0, 800) + "..." : "Belum diisi"}

Pedoman Tanggapan:
1. Berikan rekomendasi yang taktis, berbobot, ramah, dan solutif dalam Bahasa Indonesia.
2. Gunakan saran praktis seperti menulis ulang dengan metode STAR (Situation, Task, Action, Result) atau formula XYZ Google (Accomplished [X] as measured by [Y], by doing [Z]).
3. Bila diminta merevisi bullet point, berikan 2 atau 3 pilihan draft yang mengandung kata kunci penting.
4. Jawablah secara singkat, ramah, terstruktur, dan gunakan Markdown yang bersih dan mudah dibaca di layar chat yang ramping.
`;

    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction,
      },
      history: history ? history.map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      })) : []
    });

    const response = await chat.sendMessage({ message });
    return res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error during career chat:", error);
    return res.status(500).json({ 
      error: error.message || "Terjadi kesalahan ketika menghubungi asisten AI." 
    });
  }
});

// Setup Vite & Static Assets
async function main() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
});

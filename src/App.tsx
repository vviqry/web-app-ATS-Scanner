import React, { useState, useEffect } from "react";
import { 
  Upload, 
  FileText, 
  Briefcase, 
  History, 
  Sparkles, 
  AlertCircle, 
  RefreshCw, 
  Trash2, 
  Check, 
  Bot, 
  Calendar,
  Layers,
  Award,
  Search,
  BookOpen
} from "lucide-react";
import { Header } from "./components/Header";
import { RatingDial } from "./components/RatingDial";
import { KeywordTracker } from "./components/KeywordTracker";
import { RevisionSection } from "./components/RevisionSection";
import { JobExamples, PRESETS } from "./components/JobExamples";
import { CareerChat } from "./components/CareerChat";
import { extractTextFromPdf } from "./utils/pdf";
import { ScanResult, HistoricalScan } from "./types";

export default function App() {
  // Inputs
  const [jobDescription, setJobDescription] = useState("");
  const [cvText, setCvText] = useState("");
  const [cvFilename, setCvFilename] = useState<string>("");
  
  // Statuses
  const [loading, setLoading] = useState(false);
  const [pdfExtracting, setPdfExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Results
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  // History with localStorage persistence
  const [history, setHistory] = useState<HistoricalScan[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ats_scan_history");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (e) {
      console.error("Gagal membaca riwayat penyimpanan lokal:", e);
    }
  }, []);

  // Save history to localStorage
  const saveHistory = (newHistory: HistoricalScan[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem("ats_scan_history", JSON.stringify(newHistory));
    } catch (e) {
      console.error("Gagal menyimpan riwayat ke penyimpanan lokal:", e);
    }
  };

  // Select Preset Example
  const handleSelectPreset = (preset: typeof PRESETS[0]) => {
    setJobDescription(preset.description);
    setCvText(preset.sampleCv);
    setCvFilename("Contoh-Resume-Alumni.pdf");
    setError(null);
    setSuccessMsg(`Berhasil memuat template pekerjaan "${preset.title}"!`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Drag-and-Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setError(null);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processUploadedFile(files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = e.target.files;
    if (files && files.length > 0) {
      await processUploadedFile(files[0]);
    }
  };

  const processUploadedFile = async (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf") {
      setError("Hanya berkas format PDF yang diijinkan demi kesesuaian parser.");
      return;
    }

    setPdfExtracting(true);
    setCvFilename(selectedFile.name);
    try {
      const extracted = await extractTextFromPdf(selectedFile);
      setCvText(extracted);
      setSuccessMsg(`Berhasil mengekstrak teks dari berkas "${selectedFile.name}"!`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.message || "Gagal mengurai dokumen PDF.");
      setCvFilename("");
    } finally {
      setPdfExtracting(false);
    }
  };

  // Execute ATS Scan
  const handlePerformScan = async () => {
    setError(null);
    if (!cvText.trim()) {
      setError("Silakan unggah resume atau tempel teks CV Anda terlebih dahulu.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Silakan tempel deskripsi lowongan kerja tujuan.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvText,
          jobDescription,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Gagal menghubungi mesin pemindai ATS.");
      }

      setScanResult(data);

      // Save to History
      const newScan: HistoricalScan = {
        id: `scan-${Date.now()}`,
        timestamp: new Date().toLocaleString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        score: data.score,
        jobRole: detectJobTitle(jobDescription),
        jobDescription,
        cvFilename: cvFilename || "Teks_Resume.txt",
        cvText,
        result: data,
      };

      const updatedHistory = [newScan, ...history];
      saveHistory(updatedHistory);
      setActiveHistoryId(newScan.id);

      setSuccessMsg("Analisis ATS Pintar selesai diproses!");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan koneksi saat memproses data.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to extract a friendly job title from description
  const detectJobTitle = (desc: string): string => {
    const firstLine = desc.split("\n")[0].replace(/[#-*_:]/g, "").trim();
    if (firstLine.length > 5 && firstLine.length < 40) {
      return firstLine;
    }
    
    // search for predefined triggers
    if (desc.toLowerCase().includes("full-stack") || desc.toLowerCase().includes("developer")) {
      return "Full-Stack Web Developer";
    }
    if (desc.toLowerCase().includes("data analyst") || desc.toLowerCase().includes("bi")) {
      return "Data Analyst / BI";
    }
    if (desc.toLowerCase().includes("designer") || desc.toLowerCase().includes("ui")) {
      return "UI/UX Product Designer";
    }
    if (desc.toLowerCase().includes("marketing") || desc.toLowerCase().includes("ads")) {
      return "Digital Marketer";
    }
    return "Lowongan Kerja Spesifik";
  };

  // Load a scan item from history
  const handleLoadHistory = (item: HistoricalScan) => {
    setJobDescription(item.jobDescription);
    setCvText(item.cvText);
    setCvFilename(item.cvFilename);
    setScanResult(item.result);
    setActiveHistoryId(item.id);
    setError(null);
  };

  // Delete history item
  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter((x) => x.id !== id);
    saveHistory(updated);
    if (activeHistoryId === id) {
      setActiveHistoryId(null);
      setScanResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Banner Alert Toast */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3 text-rose-800 text-sm animate-fadeIn">
            <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Galat:</span> {error}
            </div>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-250 rounded-xl p-4 flex items-start gap-3 text-emerald-905 text-sm animate-fadeIn">
            <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
              ✔
            </div>
            <div>
              <span className="font-bold">Sukses:</span> {successMsg}
            </div>
          </div>
        )}

        {/* Dynamic Preset Section */}
        <JobExamples onSelect={handleSelectPreset} />

        {/* Dual Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* LEFT COLUMN: Input Panels */}
          <div className="space-y-6">
            
            {/* job vacancy description */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-stone-900 text-sm">
                    1. Tempel Deskripsi Loker (Job Description)
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Masukkan kualifikasi, tanggung jawab, dan keahlian yang dicari di lowongan.
                  </p>
                </div>
              </div>

              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="CONTOH: 
Kualifikasi:
- Minimal 2 tahun React, Node.js, TypeScript...
- Familiar dengan SQL dan REST API...
- Menguasai Git, Agile Methodology..."
                className="w-full h-44 bg-stone-50 border border-stone-200 focus:bg-white text-stone-800 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-mono leading-relaxed"
              />
              <div className="flex justify-between items-center text-[11px] text-stone-400">
                <span>Gunakan bahasa yang sama dengan CV (disarankan Bahasa Inggris/Indonesia sesuai loker).</span>
                <span>{jobDescription.length} Karakter</span>
              </div>
            </div>

            {/* Resume Upload / Paste Input */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-stone-900 text-sm">
                      2. Kelola CV / Resume Anda
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Unggah dokumen PDF atau ketik manual isi resume Anda untuk diperiksa.
                    </p>
                  </div>
                </div>
              </div>

              {/* Upload Drag & Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
                  isDragOver 
                    ? "border-orange-500 bg-orange-50/40" 
                    : cvFilename 
                      ? "border-emerald-300 bg-emerald-50/10" 
                      : "border-stone-200 bg-stone-50 hover:bg-stone-50/50"
                }`}
              >
                <input
                  type="file"
                  id="pdf-upload"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={pdfExtracting}
                />
                <label 
                  htmlFor="pdf-upload" 
                  className={`flex flex-col items-center justify-center cursor-pointer ${
                    pdfExtracting ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white border border-stone-200 flex items-center justify-center shadow-sm text-stone-500 mb-2">
                    <Upload className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform text-orange-600" />
                  </div>
                  
                  {pdfExtracting ? (
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm font-bold text-stone-700 flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin text-orange-600" />
                        Sedang mengekstrak teks PDF...
                      </p>
                      <p className="text-[11px] text-stone-500">Mohon tunggu sebentar di lingkungan uji.</p>
                    </div>
                  ) : cvFilename ? (
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-emerald-800 break-all px-2">
                        📂 {cvFilename}
                      </p>
                      <p className="text-[11px] text-stone-500 mt-1">
                        Seret PDF lain untuk mengganti dokumen saat ini.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-stone-750">
                        Klik untuk upload dokumen CV atau seret PDF kemari
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-stone-500 mt-1">
                        Sistem mendukung file PDF terenkripsi standar / teks ramah baca.
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {/* Text Editor of Extracted CV */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono tracking-wide uppercase font-semibold text-stone-400 block">
                  Isi Teks CV / Resume:
                </label>
                <textarea
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  placeholder="Ketik atau tempel teks CV Anda di sini secara manual (atau upload dari kolom PDF di atas agar terisi otomatis)..."
                  className="w-full h-44 bg-stone-50 border border-stone-200 focus:bg-white text-stone-800 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-mono leading-relaxed"
                />
                <div className="flex justify-between items-center text-[11px] text-stone-400">
                  <span>Anda dapat menyesuaikan hasil ekstraksi PDF di atas secara bebas.</span>
                  <span>{cvText.length} Karakter</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handlePerformScan}
                disabled={loading || pdfExtracting || !cvText.trim() || !jobDescription.trim()}
                className="w-full h-11 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-orange-600/10 cursor-pointer active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Sedang Memindai &amp; Menganalisis...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Kalkulasi Skor &amp; Temukan Kecocokan
                  </>
                )}
              </button>

            </div>

          </div>

          {/* RIGHT COLUMN: Results Section & Interactive reports */}
          <div className="space-y-6">
            
            {!scanResult ? (
              /* EMPTY STATE: Before Scan */
              <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm text-center flex flex-col items-center justify-center h-full min-h-[500px]">
                <div className="h-16 w-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shadow-inner mb-4">
                  <Sparkles className="h-8 w-8 animate-pulse" />
                </div>
                <h4 className="font-display font-bold text-stone-900 text-lg">
                  Siap Melakukan Analisis ATS
                </h4>
                <p className="text-sm text-stone-500 max-w-sm mt-2 leading-relaxed">
                  Isi deskripsi Loker serta teks CV Anda di sebelah kiri, lalu klik tombol Pindai untuk menguji kecocokan karir Anda secara instan.
                </p>

                {/* mini highlights of features */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg w-full text-left font-sans">
                  <div className="border border-stone-150 rounded-xl p-3 bg-stone-50/50">
                    <span className="text-xs font-bold text-stone-850 block">🎯 Skor Instan</span>
                    <span className="text-[11px] text-stone-500">Angka presisi keselarasan loker</span>
                  </div>
                  <div className="border border-stone-150 rounded-xl p-3 bg-stone-50/50">
                    <span className="text-xs font-bold text-stone-850 block">🔍 Defisit Kata Kunci</span>
                    <span className="text-[11px] text-stone-500">Daftar skill krusial yang hilang</span>
                  </div>
                  <div className="border border-stone-150 rounded-xl p-3 bg-stone-50/50">
                    <span className="text-xs font-bold text-stone-850 block">💬 Konsultan Karir</span>
                    <span className="text-[11px] text-stone-500">Tanya jawab adaptif dengan AI</span>
                  </div>
                </div>
              </div>
            ) : (
              /* SCAN RESULTS SHOWCASE */
              <div className="space-y-6">
                
                {/* Visual ATS progress gauge */}
                <RatingDial score={scanResult.score} />

                {/* AI Rangkuman Analisis */}
                <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                    <span className="font-display font-bold text-stone-850 text-sm">
                      📖 Ringkasan Analisis Rekruiter
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-650 leading-relaxed whitespace-pre-wrap">
                    {scanResult.summaryText}
                  </p>
                </div>

                {/* Keyword matched vs missing tags */}
                <KeywordTracker 
                  matchedKeywords={scanResult.matchedKeywords || []} 
                  missingKeywords={scanResult.missingKeywords || []} 
                />

                {/* Career Consultant interactive chat section */}
                <CareerChat 
                  score={scanResult.score}
                  cvText={cvText}
                  jobDescription={jobDescription}
                  scanResult={scanResult}
                />

              </div>
            )}

          </div>

        </div>

        {/* ATS REVISION INSTRUCTIONS (Full width) */}
        {scanResult && (
          <div className="mt-8 transition-all">
            <RevisionSection suggestions={scanResult.revisionSuggestions || []} />
          </div>
        )}

        {/* HISTORICAL SCAN LIST SECTION */}
        {history.length > 0 && (
          <section className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-orange-605" />
                <div>
                  <h3 className="font-display font-bold text-stone-900 text-sm">
                    Riwayat Pemindaian Sesi Ini
                  </h3>
                  <p className="text-xs text-stone-500">
                    Riwayat pengujian disimpan secara lokal pada peramban browser Anda.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono bg-stone-100 px-2 py-1 rounded text-stone-500/80">
                {history.length} Terdaftar
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {history.map((scan) => {
                const isActive = scan.id === activeHistoryId;
                return (
                  <div
                    key={scan.id}
                    onClick={() => handleLoadHistory(scan)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group h-28 ${
                      isActive
                        ? "border-orange-500 bg-orange-50/20 shadow-sm"
                        : "border-stone-200 bg-stone-50 hover:bg-orange-50/10 hover:border-orange-355"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {scan.timestamp}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded font-mono ${
                            scan.score >= 75
                              ? "bg-emerald-100 text-emerald-800"
                              : scan.score >= 55
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                          }`}>
                            {scan.score}%
                          </span>
                        </div>
                      </div>
                      
                      <h5 className="text-xs sm:text-[13px] font-bold text-stone-850 group-hover:text-stone-900 line-clamp-1">
                        {scan.jobRole}
                      </h5>
                      <span className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                        Dokumen: {scan.cvFilename}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-stone-400 pt-2 border-t border-stone-200/50 mt-1">
                      <span>{isActive ? "🟢 Sedang Aktif" : "Klik untuk muat kembali"}</span>
                      <button
                        onClick={(e) => handleDeleteHistory(scan.id, e)}
                        className="text-stone-350 hover:text-rose-600 p-1 rounded hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Hapus riwayat ini"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </section>
        )}

      </main>

      <footer className="bg-white border-t border-stone-200 mt-12 py-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Pemindai ATS Pintar. Bertenaga Google Gemini-3.5-Flash model cerdas.</p>
          <p className="mt-1 text-stone-400">Dirancang secara eksklusif untuk optimalisasi CV &amp; Loker ramah sistem ATS.</p>
        </div>
      </footer>
    </div>
  );
}

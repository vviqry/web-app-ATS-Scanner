import React from "react";
import { Briefcase, Code, BarChart, Figma, Megaphone, PlusSquare } from "lucide-react";

interface JobPreset {
  id: string;
  title: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  sampleCv: string;
}

export const PRESETS: JobPreset[] = [
  {
    id: "fs-dev",
    title: "Full-Stack Web Developer",
    category: "Teknologi",
    icon: Code,
    description: `Kualifikasi Pekerjaan:
- Minimal 2-3 tahun pengalaman dalam pengembangan Web Full-Stack menggunakan React.js, Node.js, Express, dan PostgreSQL/MongoDB.
- Fasih memprogram menggunakan TypeScript dan ES6+.
- Memiliki pemahaman kuat mengenai RESTful API, integrasi basis data, otentikasi OAuth, JWT, dan optimasi performa backend.
- Pengalaman bekerja dengan Git, CI/CD, Docker, and layanan cloud modern (AWS, Google Cloud, atau Vercel).
- Memiliki kemampuan kolaboratif, agile methodology (Scrum/Kanban), dan terbiasa menulis kode terdokumentasi rapi.
- Memiliki keahlian pengujian perangkat lunak (Jest, Cypress) menjadi nilai tambah.`,
    sampleCv: `Budi Santoso - Software Developer
budisantoso@email.com | +62 812-3456-7890 | Jakarta

RINGKASAN PROFESIONAL
Seorang Programmer Web yang berpengalaman selama 2 tahun dalam merancang dan men-deploy web application modern. Menyukai javascript secara mendasar dan terus bertekad memperdalam keahliannya di kancah global.

KEAHLIAN / SKILL
- Bahasa Pemrograman: Javascript, CSS3, HTML5
- Frameworks: React, Bootstrap, Tailwind
- Tools: VSCode, Git, GitHub, Postman
- Soft Skill: Komunikasi, Kerja Tim, Manajemen Waktu

PENGALAMAN KERJA
Web Developer - PT Digital Sukses Mandiri (Maret 2024 - Sekarang)
- Membuat antarmuka pengguna website klien dengan React.js dan Tailwind CSS.
- Menghubungkan client interface dengan data API backend.
- Memperbaiki bug-bug layout visual agar responsive di layar mobile.

Junior Developer - CV Solusi Pratama (Januari 2023 - Februari 2024)
- Menulis kode HTML dan CSS sesuai arahan desainer UI/UX.
- Melakukan testing aplikasi frontend secara manual.`
  },
  {
    id: "data-analyst",
    title: "Data Analyst / BI Engineer",
    category: "Data Science",
    icon: BarChart,
    description: `Persyaratan Pekerjaan:
- Minimal 1-2 tahun pengalaman sebagai Data Analyst, Business Intelligence, atau posisi sejenis.
- Keahlian analitis yang kuat dengan pemahaman mendalam tentang SQL (query optimasi, joins, aggregations).
- Mahir dalam pemrograman Python atau R untuk pengolahan data dasar dan analisis statistik (Pandas, NumPy).
- Pengalaman menggunakan modul BI / visualisasi data seperti Tableau, Power BI, atau Google Looker Studio.
- Berpengalaman mengolah data mentah (ETL), pembersihan data, serta menyusun dashboard KPIs interaktif untuk tim eksekutif.
- Keterampilan komunikasi visual dan verbal yang prima untuk memaparkan insights kepada pemangku kepentingan.`,
    sampleCv: `Siti Rahmawati - Data Specialist
sitirahma@email.com | +62 899-8877-6655 | Bandung

RINGKASAN PROFESIONAL
Data Enthusiast lulusan statistika yang menyukai visualisasi data. Terbiasa menggunakan spreadsheet dan alat bantu presentasi untuk menyimpulkan laporan bulanan tim operasional.

KOMPETENSI / KEAHLIAN
- Software: Microsoft Excel (VLOOKUP, Pivot (Tabel)), Tableau dasar, SQL (Select, Where)
- Visualisasi: Chart, Diagram, PowerPoint
- Bahasa: Indonesia, Inggris (Pasif)

PENGALAMAN KERJA
Data Analyst Intern - PT Analytics Global (Juni 2024 - Sekarang)
- Membantu membersihkan data penjualan bulanan di Microsoft Excel.
- Membuat grafik visual mingguan untuk diunggah di slides presentasi.
- Mengumpulkan umpan balik pelanggan tentang kepuasan situs.`
  },
  {
    id: "uiux-designer",
    title: "UI/UX Product Designer",
    category: "Desain Kreatif",
    icon: Figma,
    description: `Kriteria Utama:
- Minimal 2 tahun pengalaman mendesain produk digital (Mobile App, Web Service).
- Portofolio portofolio kuat yang mendokumentasikan proses riset pengguna (User Research), rancangan wireframes, arsitektur informasi, interaksi, hingga hi-fi UI visual.
- Penguasaan mutlak atas Figma (Auto Layout, Design Systems, Components, prototyping lanjutan).
- Memiliki disiplin tinggi dalam Usability Testing, membuat User Personas, serta melakukan analisis kompetitor.
- Memiliki dasar pemahaman koding frontend HTML & CSS (agar dapat menyelaraskan desain dengan developer tim).`,
    sampleCv: `Dwi Wahyu - UI Designer
dwiwahyu@email.com | +62 855-4433-2211 | Surabaya

RINGKASAN PROFESIONAL
Graphic designer yang beralih karir ke ranah UI UX Design setelah mengikuti bootcamp intensif. Senang membuat keindahan visual modern agar web terlihat segar dan digemari pelanggan.

KEMAMPUAN TEKNIS
- Tools: Figma, Adobe Photoshop, Illustrator
- Desain: Pemilihan Warna, Layout, Tipografi, Poster
- Soft skill: Empati Pengguna, Adaptasi, Kerja Keras

PENGALAMAN LAPANGAN
Desainer Grafis Magang - PT Cetak Kreatif (Desember 2023 - Present)
- Mendesain banner promosional sosial media dan pamflet.
- Membantu menyusun tata letak landing page web internal menggunakan core Figma.`
  },
  {
    id: "digital-marketer",
    title: "Digital Marketing Specialist",
    category: "Pemasaran",
    icon: Megaphone,
    description: `Tanggung Jawab Umum:
- Mengelola dan mengoptimalkan berjalannya seluruh campaign iklan berbayar (Paid Ads) di Meta Ads, Google Ads, dan TikTok Ads.
- Mahir merumuskan teknik Search Engine Optimization (SEO) dan koordinasi konten on-page / off-page untuk menaikkan peringkat halaman organik.
- Menguasai Google Analytics 4 (GA4), Google Tag Manager (GTM), dan analisis traffic conversion rate.
- Mampu merancang strategi Content Marketing kreatif dan menjalin hubungan erat dengan komunitas eksternal.
- Memiliki orientasi ketat pada ROI (Return on Investment) iklan, mengontrol budget, dan merancang laporan A/B testing mingguan.`,
    sampleCv: `Ahmad Fauzi - Marketing Associate
ahmad.f@email.com | +62 822-1100-9988 | Yogyakarta

KANKA RINGKAS
Spesialis pemasaran media sosial mandiri yang hobi memantau tren terkini di dunia TikTok dan Instagram. Berpengalaman menulis copywriting caption yang mengundang interaksi pelanggan.

KONTRIBUSI & SKILL
- Kemampuan: Copywriting, Social Media Admin, CapCut Video Editing
- Platform: Instagram, TikTok, Facebook (Postingan Organik)
- Karakter: Kreatif, Cepat belajar, Komunikatif

PENGALAMAN KERJA
Social Media Admin - Toko Ritel Berkah (Februari 2024 - Sekarang)
- Mengunggah 5 konten Instagram Reels / TikTok per minggu.
- Membalas komentar dan pesan masuk (DM) pelanggan secara ramah.
- Mengedit video klip pendek di smartphone via CapCut.`
  }
];

interface JobExamplesProps {
  onSelect: (preset: JobPreset) => void;
}

export function JobExamples({ onSelect }: JobExamplesProps) {
  return (
    <div className="bg-white border border-stone-205 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Briefcase className="h-5 w-5 text-orange-650" />
        <h4 className="font-display font-bold text-stone-850 text-sm">
          Gunakan Kerangka Contoh Teruji (Uji Cepat)
        </h4>
      </div>
      <p className="text-xs text-stone-500 mb-4">
        Klik salah satu template di bawah untuk langsung mengisi data lowongan (Loker) serta CV contoh. Sangat direkomendasikan untuk uji coba instan!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {PRESETS.map((preset) => {
          const IconComponent = preset.icon;
          return (
            <button
              key={preset.id}
              onClick={() => onSelect(preset)}
              type="button"
              className="group flex flex-col items-start p-3 bg-stone-50 hover:bg-orange-50 border border-stone-200 hover:border-orange-200 rounded-xl transition-all duration-200 text-left cursor-pointer active:scale-[0.98]"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 rounded-lg bg-white group-hover:bg-white border border-stone-200 group-hover:border-orange-200 text-stone-600 group-hover:text-orange-600 transition-colors">
                  <IconComponent className="h-4 w-4" />
                </span>
                <span className="text-[10px] font-mono font-medium text-stone-400 group-hover:text-orange-600 uppercase">
                  {preset.category}
                </span>
              </div>
              <h5 className="text-[13px] font-bold text-stone-800 group-hover:text-stone-900 line-clamp-1 mt-1">
                {preset.title}
              </h5>
              <p className="text-[11px] text-stone-500 group-hover:text-stone-605 mt-0.5 line-clamp-2 leading-relaxed">
                Muat deskripsi dan resume sampel yang cocok.
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

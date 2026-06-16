/**
 * Utility to parse PDF text in client-side using PDF.js loaded via CDN
 */

export async function extractTextFromPdf(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = async function() {
      try {
        const typedarray = new Uint8Array(this.result as ArrayBuffer);
        
        // Dynamically load PDF.js client-side library from cdnjs
        await loadPdfJs();
        
        const win = window as any;
        if (!win.pdfjsLib) {
          throw new Error("Pustaka PDF.js tidak dapat dimuat di browser Anda.");
        }

        // Set worker source URL
        win.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const pdf = await win.pdfjsLib.getDocument({ data: typedarray }).promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          
          // Join fragments into sequential text
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(" ");
          
          fullText += pageText + "\n";
        }

        const trimmedText = fullText.trim();
        if (!trimmedText) {
          throw new Error("Dokumen PDF kosong atau tidak mengandung teks terbaca (bisa jadi hasil scan gambar/OCR diperlukan).");
        }
        
        resolve(trimmedText);
      } catch (err: any) {
        reject(new Error(err.message || "Gagal mengekstrak teks dari PDF."));
      }
    };
    fileReader.onerror = () => reject(new Error("Gagal membaca berkas file PDF."));
    fileReader.readAsArrayBuffer(file);
  });
}

function loadPdfJs(): Promise<void> {
  return new Promise((resolve, reject) => {
    const win = window as any;
    if (win.pdfjsLib) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.async = true;
    script.onload = () => {
      resolve();
    };
    script.onerror = () => {
      reject(new Error("Gagal mengunduh script parser PDF.js dari CDN. Periksa koneksi internet Anda."));
    };
    document.head.appendChild(script);
  });
}

interface LetterPreviewProps {
  letter: string;
  companyName: string;
}

function downloadFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function LetterPreview({ letter, companyName }: LetterPreviewProps) {
  const handleDownloadDocx = () => {
    const content = `
      <html>
        <head><meta charset="utf-8"/></head>
        <body>${letter}</body>
      </html>
    `;
    downloadFile(content, `${companyName}-sponsorship-letter.doc`, "application/msword");
  };

  const handlePrintPdf = () => {
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
      <head>
        <title>${companyName} Sponsorship Letter</title>
        <style>body{font-family:Arial,sans-serif;line-height:1.6;padding:24px;}</style>
      </head>
      <body>${letter}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-slate-900">Generated Letter</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDownloadDocx}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Download DOC
          </button>
          <button
            type="button"
            onClick={handlePrintPdf}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
          >
            Save as PDF
          </button>
        </div>
      </div>

      <article
        className="prose mt-4 max-w-none rounded-xl border border-slate-200 bg-slate-50 p-5"
        dangerouslySetInnerHTML={{ __html: letter }}
      />
    </section>
  );
}

export default LetterPreview;

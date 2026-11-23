"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  Download,
  Loader2,
  MessageCircle,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function TicketActions({
  cardId,
  registrationNumber,
  shareUrl,
  shareMessage,
  labels,
}: {
  cardId: string;
  registrationNumber: string;
  shareUrl: string;
  shareMessage: string;
  labels: {
    copyNumber: string;
    copied: string;
    print: string;
    downloadPdf: string;
    generatingPdf: string;
    pdfError: string;
    shareWhatsApp: string;
    pdfFileName: string;
  };
}) {
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(registrationNumber);
      setCopied(true);
      toast.success(labels.copied);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      toast.error(labels.pdfError);
    }
  }

  async function downloadPdf() {
    const element = document.getElementById(cardId);
    if (!element || busy) return;
    setBusy(true);
    try {
      const [{ toPng }, { jsPDF }] = await Promise.all([
        import("html-to-image"),
        import("jspdf"),
      ]);
      // The browser renders the card itself (including shaped Arabic and the
      // QR image), then we embed that raster into a vector PDF page. This
      // avoids client-side Arabic shaping libraries and broken fonts.
      const dataUrl = await toPng(element, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#ffffff",
      });
      const image = new Image();
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("image"));
        image.src = dataUrl;
      });

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 14;
      const maxWidth = pageWidth - margin * 2;
      const ratio = image.height / image.width;
      const width = maxWidth;
      const height = width * ratio;
      const y = Math.max(margin, (pageHeight - height) / 2);
      pdf.addImage(dataUrl, "PNG", margin, y, width, Math.min(height, pageHeight - margin * 2));
      pdf.save(`${labels.pdfFileName}-${registrationNumber}.pdf`);
    } catch (error) {
      console.error("[ticket] pdf failed", error);
      toast.error(labels.pdfError);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="no-print flex flex-wrap gap-2.5 border-t border-border bg-cream-50 p-4 sm:p-5">
      <Button type="button" variant="gold" onClick={downloadPdf} disabled={busy} className="gap-2">
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Download className="h-4 w-4" aria-hidden="true" />
        )}
        {busy ? labels.generatingPdf : labels.downloadPdf}
      </Button>
      <Button type="button" variant="outline" onClick={() => window.print()} className="gap-2">
        <Printer className="h-4 w-4" aria-hidden="true" />
        {labels.print}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={copyNumber}
        className="gap-2"
        aria-live="polite"
      >
        {copied ? (
          <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
        ) : (
          <Copy className="h-4 w-4" aria-hidden="true" />
        )}
        {copied ? labels.copied : labels.copyNumber}
      </Button>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${shareMessage}\n${shareUrl}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        {labels.shareWhatsApp}
      </a>
    </div>
  );
}

"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Download, Upload, RotateCcw } from "lucide-react";

interface FooterStripProps {
  totalApps: number;
  onShare: () => void;
  onExport: () => void;
  onImport: (json: string) => void;
  onReset: () => void;
}

export function FooterStrip({ totalApps, onShare, onExport, onImport, onReset }: FooterStripProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onImport(reader.result as string);
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className="glass rounded-xl px-4 py-2.5 flex items-center justify-between mt-8 mb-20">
      <span className="text-xs text-white/30 font-mono">{totalApps} apps</span>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={onShare} className="text-xs text-white/40 hover:text-white/70 gap-1.5 h-7">
          <Share2 className="w-3.5 h-3.5" /> Share Stack
        </Button>
        <Button variant="ghost" size="sm" onClick={onExport} className="text-xs text-white/40 hover:text-white/70 gap-1.5 h-7">
          <Download className="w-3.5 h-3.5" /> Export
        </Button>
        <Button variant="ghost" size="sm" onClick={() => fileRef.current?.click()} className="text-xs text-white/40 hover:text-white/70 gap-1.5 h-7">
          <Upload className="w-3.5 h-3.5" /> Import
        </Button>
        <input ref={fileRef} type="file" accept=".json" onChange={handleFileChange} className="hidden" />
        <Button variant="ghost" size="sm" onClick={onReset} className="text-xs text-white/40 hover:text-red-400/70 gap-1.5 h-7">
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </Button>
      </div>
    </div>
  );
}

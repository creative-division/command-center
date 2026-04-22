"use client";

import { useState, useMemo } from "react";
import { compressToEncodedURIComponent } from "lz-string";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, ExternalLink } from "lucide-react";
import type { DashboardState, SharePayload } from "@/lib/types";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  state: DashboardState;
}

export function ShareModal({ open, onClose, state }: ShareModalProps) {
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    const payload: SharePayload = {
      name: name.trim() || undefined,
      categories: state.categories,
      apps: state.apps.map(({ icon: _icon, ...rest }) => rest),
    };
    const compressed = compressToEncodedURIComponent(JSON.stringify(payload));
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/stack?data=${compressed}`;
  }, [state, name]);

  async function handleCopy() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleTwitter() {
    const text = encodeURIComponent(`Check out my app stack on Command Center! ${shareUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="glass-strong rounded-2xl border-white/10 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Share My Stack</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <label className="text-xs font-medium text-white/50 mb-1 block">Your name (optional)</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jiayden"
              className="bg-white/5 border-white/10"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-white/50 mb-1 block">Shareable link</label>
            <div className="flex gap-2">
              <Input value={shareUrl} readOnly className="bg-white/5 border-white/10 text-xs font-mono" />
              <Button onClick={handleCopy} variant="outline" className="shrink-0 border-white/10 bg-white/5 gap-1.5">
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleTwitter} variant="outline" className="border-white/10 bg-white/5 gap-1.5 text-xs">
              <ExternalLink className="w-3.5 h-3.5" /> Share on X
            </Button>
          </div>

          <p className="text-[11px] text-white/30 leading-relaxed">
            Shared links are read-only snapshots. Uploaded icons are replaced with favicons to keep links small.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

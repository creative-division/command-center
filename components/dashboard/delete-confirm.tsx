"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export function DeleteConfirm({ open, onClose, onConfirm, title, description }: DeleteConfirmProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="glass-strong rounded-2xl border-white/10 max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-white/50">{description}</DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" onClick={onClose} className="flex-1 border-white/10 bg-white/5">Cancel</Button>
          <Button onClick={() => { onConfirm(); onClose(); }} className="flex-1 bg-red-500/80 hover:bg-red-500 text-white">Delete</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

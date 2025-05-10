'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useEffect } from "react";

type AlertType = {
  alert_id: string;
  detection_type: string;
  location: string;
  timestamp: string;
  media_reference: string;
};

type Props = {
  alert: AlertType | null;
  onClose: () => void;
};

export function AlertDialogPopup({ alert, onClose }: Props) {
  useEffect(() => {
    if (!alert) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [alert, onClose]);

  if (!alert) return null;

  const message = alert.detection_type === "feu"
    ? "Appeler les pompiers immédiatement !"
    : alert.detection_type === "arme" || alert.detection_type === "criminel"
    ? "Appeler la police immédiatement !"
    : "Alerte à traiter";

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alerte {alert.detection_type.toUpperCase()}</DialogTitle>
          <DialogDescription>
            {message} <br />
            Localisation : {alert.location}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

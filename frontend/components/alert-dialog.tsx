"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, PhoneCall } from "lucide-react";

type AlertType = {
  alert_id: string;
  detection_type: string;
  location: string;
  timestamp: string;
  media_reference: string;
};

interface AlertDialogProps {
  alert: AlertType | null;
  onClose: () => void;
}

export function AlertDialogPopup({ alert, onClose }: AlertDialogProps) {
  if (!alert) return null;

  const getMessage = () => {
    if (alert.detection_type === "feu") return "Appeler les pompiers immédiatement !";
    if (alert.detection_type === "arme" || alert.detection_type === "criminel") return "Appeler la police immédiatement !";
    return "Alerte inconnue.";
  };

  return (
    <Dialog open={!!alert} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Alerte {alert.detection_type.toUpperCase()}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 text-sm">
          <p><strong>Lieu :</strong> {alert.location}</p>
          <p><strong>Heure :</strong> {new Date(alert.timestamp).toLocaleString()}</p>
          <p className="mt-2 text-red-600 font-semibold">{getMessage()}</p>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>
            <PhoneCall className="h-4 w-4 mr-2" />
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

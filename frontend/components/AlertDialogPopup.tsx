// "use client";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { useEffect } from "react";

// type AlertType = {
//   alert_id: string;
//   detection_type: string;
//   location: string;
//   timestamp: string;
//   media_reference: string;
// };

// type Props = {
//   alert: AlertType | null;
//   onClose: () => void;
//   onTreatConfirm: (alert: AlertType) => void;
// };

// export function AlertDialogPopup({ alert, onClose, onTreatConfirm }: Props) {
//   useEffect(() => {
//     if (!alert) return;
//     const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [alert, onClose]);

//   if (!alert) return null;

//   const message =
//     alert.detection_type === "feu"
//       ? "Appeler les pompiers immédiatement !"
//       : alert.detection_type === "arme" || alert.detection_type === "criminel"
//       ? "Appeler la police immédiatement !"
//       : "Alerte à traiter";

//   return (
//     <Dialog open onOpenChange={onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Alerte {alert.detection_type.toUpperCase()}</DialogTitle>
//           <DialogDescription>
//             {message}
//             <br />
//             Localisation : {alert.location}
//           </DialogDescription>
//         </DialogHeader>
//         <DialogFooter>
//           <Button
//   onClick={() => {
//     onTreatConfirm(alert); // ✅ met à jour le statut
//     onClose();             // ✅ ferme le popup
//   }}
// >
//   Fermer
// </Button>

//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, PhoneCall } from "lucide-react";
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
  onTreatConfirm: (alert: AlertType) => void;
};

export function AlertDialogPopup({ alert, onClose, onTreatConfirm }: Props) {
  useEffect(() => {
    if (!alert) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [alert, onClose]);

  if (!alert) return null;

  const message =
    alert.detection_type === "feu"
      ? "Appeler les pompiers immédiatement !"
      : alert.detection_type === "arme" || alert.detection_type === "criminel"
      ? "Appeler la police immédiatement !"
      : "Alerte à traiter";

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Alerte {alert.detection_type.toUpperCase()}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {message}
            <br />
            <span className="text-black">Lieu :</span> {alert.location}
            <br />
            <span className="text-black">Heure :</span>{" "}
            {new Date(alert.timestamp).toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => {
              onTreatConfirm(alert);
              onClose();
            }}
          >
            <PhoneCall className="h-4 w-4 mr-2" />
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

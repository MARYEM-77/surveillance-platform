import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

import {
  FlameIcon as Fire,
  PenIcon as Gun,
  User,
  Clock,
  MapPin,
  CheckCircle,
  MoreHorizontal,
} from "lucide-react";

type IncidentType = "fire" | "weapon" | "face";

interface IncidentCardProps {
  type: IncidentType;
  title: string;
  location: string;
  time: string;
  image?: string;
  alertId?: string;
  onTreat?: () => void;
}

export function IncidentCard({
  type,
  title,
  location,
  time,
  ...props
}: IncidentCardProps) {
  const getIcon = () => {
    switch (type) {
      case "fire":
        return <Fire className="h-5 w-5 text-rose-500" />;
      case "weapon":
        return <Gun className="h-5 w-5 text-amber-500" />;
      case "face":
        return <User className="h-5 w-5 text-violet-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video">
        <Image
          src={
            props.image ??
            `/placeholder.svg?height=200&width=400&text=${type === "fire" ? "Feu" : type === "weapon" ? "Arme" : "Visage"}`
          }
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {getIcon()}
          <h3 className="font-semibold">{title}</h3>
        </div>
        <div className="space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{time}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const downloadUrl = `http://localhost:8000/alerts/${props.alertId}/pdf`;
            window.open(downloadUrl, "_blank");
          }}
        >
          <Download className="h-4 w-4" />
          PDF
        </Button>

        <Button
          size="sm"
          onClick={props.onTreat} // ← ici
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Traiter
        </Button>
      </CardFooter>
    </Card>
  );
}

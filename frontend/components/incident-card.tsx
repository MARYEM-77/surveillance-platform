import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FlameIcon as Fire, PenIcon as Gun, User, Clock, MapPin, CheckCircle, MoreHorizontal } from "lucide-react"

type IncidentType = "fire" | "weapon" | "face"
type SeverityType = "urgent" | "critical" | "moderate" | "low"

interface IncidentCardProps {
  type: IncidentType
  title: string
  location: string
  time: string
  severity: SeverityType
  image?: string;
  alertId?: string;
  onTreat?: () => void; 
}

export function IncidentCard({ type, title, location, time, severity, ...props }: IncidentCardProps) {
  const getIcon = () => {
    switch (type) {
      case "fire":
        return <Fire className="h-5 w-5 text-rose-500" />
      case "weapon":
        return <Gun className="h-5 w-5 text-amber-500" />
      case "face":
        return <User className="h-5 w-5 text-violet-500" />
      default:
        return null
    }
  }

  const getSeverityColor = () => {
    switch (severity) {
      case "urgent":
        return "bg-rose-500 hover:bg-rose-600"
      case "critical":
        return "bg-amber-500 hover:bg-amber-600"
      case "moderate":
        return "bg-violet-500 hover:bg-violet-600"
      case "low":
        return "bg-blue-500 hover:bg-blue-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getSeverityBadge = () => {
    switch (severity) {
      case "urgent":
        return <Badge className="bg-rose-500">Urgent</Badge>
      case "critical":
        return <Badge className="bg-amber-500">Critique</Badge>
      case "moderate":
        return <Badge className="bg-violet-500">Modéré</Badge>
      case "low":
        return <Badge className="bg-blue-500">Faible</Badge>
      default:
        return <Badge>Inconnu</Badge>
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video">
        <Image
          src={`/placeholder.svg?height=200&width=400&text=${type === "fire" ? "Feu" : type === "weapon" ? "Arme" : "Visage"}`}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">{getSeverityBadge()}</div>
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
        <Button variant="outline" size="sm" className="flex-1">
          <MoreHorizontal className="h-4 w-4 mr-1" />
          Détails
        </Button>
        <Button
  size="sm"
  className={`flex-1 ${getSeverityColor()}`}
  onClick={props.onTreat} // ← ici
>
  <CheckCircle className="h-4 w-4 mr-1" />
  Traiter
</Button>


      </CardFooter>
    </Card>
  )
}

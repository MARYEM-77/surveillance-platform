import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  ChevronDown,
  Download,
  Eye,
  File,
  Filter,
  FlameIcon as Fire,
  PenIcon as Gun,
  Search,
  User,
} from "lucide-react"
import Image from "next/image"

export default function EvenementsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Événements</h2>
        <Button variant="outline">
          <Calendar className="mr-2 h-4 w-4" /> Filtrer par date
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="grid flex-1 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Rechercher des événements..." className="pl-8" />
          </div>
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-8">
        <div className="relative pl-6 border-l-2 border-muted">
          <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary"></div>
          <div className="text-sm text-muted-foreground mb-4">Aujourd'hui - 14:23</div>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Fire className="h-5 w-5 text-rose-500" />
                  <CardTitle className="text-lg">Détection de feu</CardTitle>
                  <Badge className="bg-rose-500 ml-2">Urgent</Badge>
                </div>
                <Button variant="ghost" size="sm">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>Caméra: Entrée Principale</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative aspect-video md:w-1/2 rounded-md overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=200&width=400&text=Feu"
                    alt="Incident"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="md:w-1/2">
                  <h4 className="font-medium mb-2">Détails de l'incident</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Détection de flammes dans la zone d'entrée principale. Niveau de confiance: 92%. Alerte
                    automatiquement envoyée aux services d'urgence.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-1 h-4 w-4" /> Voir la vidéo
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-1 h-4 w-4" /> Télécharger
                    </Button>
                    <Button variant="outline" size="sm">
                      <File className="mr-1 h-4 w-4" /> Rapport
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="relative pl-6 border-l-2 border-muted">
          <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary"></div>
          <div className="text-sm text-muted-foreground mb-4">Aujourd'hui - 13:45</div>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gun className="h-5 w-5 text-amber-500" />
                  <CardTitle className="text-lg">Détection d'arme</CardTitle>
                  <Badge className="bg-amber-500 ml-2">Critique</Badge>
                </div>
                <Button variant="ghost" size="sm">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>Caméra: Parking Sud</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative aspect-video md:w-1/2 rounded-md overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=200&width=400&text=Arme"
                    alt="Incident"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="md:w-1/2">
                  <h4 className="font-medium mb-2">Détails de l'incident</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Détection d'une arme à feu dans la zone du parking sud. Niveau de confiance: 87%. Alerte envoyée à
                    l'équipe de sécurité et aux autorités.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-1 h-4 w-4" /> Voir la vidéo
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-1 h-4 w-4" /> Télécharger
                    </Button>
                    <Button variant="outline" size="sm">
                      <File className="mr-1 h-4 w-4" /> Rapport
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="relative pl-6 border-l-2 border-muted">
          <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary"></div>
          <div className="text-sm text-muted-foreground mb-4">Aujourd'hui - 13:12</div>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-violet-500" />
                  <CardTitle className="text-lg">Visage sensible détecté</CardTitle>
                  <Badge className="bg-violet-500 ml-2">Modéré</Badge>
                </div>
                <Button variant="ghost" size="sm">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>Caméra: Hall d'Accueil</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative aspect-video md:w-1/2 rounded-md overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=200&width=400&text=Visage"
                    alt="Incident"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="md:w-1/2">
                  <h4 className="font-medium mb-2">Détails de l'incident</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Détection d'un visage correspondant à la liste de surveillance dans le hall d'accueil. Niveau de
                    confiance: 76%. Notification envoyée à l'équipe de sécurité.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-1 h-4 w-4" /> Voir la vidéo
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-1 h-4 w-4" /> Télécharger
                    </Button>
                    <Button variant="outline" size="sm">
                      <File className="mr-1 h-4 w-4" /> Rapport
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-center mt-8">
        <Button>Charger plus d'événements</Button>
      </div>
    </div>
  )
}

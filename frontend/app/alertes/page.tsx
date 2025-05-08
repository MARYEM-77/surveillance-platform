import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle, Filter, FlameIcon as Fire, PenIcon as Gun, Plus, Search, User, X } from "lucide-react"
import Image from "next/image"

export default function AlertesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Alertes</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Ajouter une alerte
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="grid flex-1 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Rechercher des alertes..." className="pl-8" />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Select defaultValue="all">
              <SelectTrigger id="type">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="all">Tous types</SelectItem>
                <SelectItem value="fire">Feu</SelectItem>
                <SelectItem value="weapon">Arme</SelectItem>
                <SelectItem value="face">Visage</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger id="camera">
                <SelectValue placeholder="Caméra" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="all">Toutes caméras</SelectItem>
                <SelectItem value="entrance">Entrée</SelectItem>
                <SelectItem value="parking">Parking</SelectItem>
                <SelectItem value="hall">Hall</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger id="severity">
                <SelectValue placeholder="Gravité" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="critical">Critique</SelectItem>
                <SelectItem value="moderate">Modéré</SelectItem>
                <SelectItem value="low">Faible</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" className="sm:w-[150px]">
            <Calendar className="mr-2 h-4 w-4" />
            Filtrer par date
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Caméra</TableHead>
              <TableHead>Date & Heure</TableHead>
              <TableHead>Gravité</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="w-[80px] h-[45px] relative rounded overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=45&width=80&text=Feu"
                    alt="Incident"
                    fill
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Fire className="h-4 w-4 text-rose-500" />
                  <span>Détection de feu</span>
                </div>
              </TableCell>
              <TableCell>Entrée Principale</TableCell>
              <TableCell>05/07/2023 - 14:23</TableCell>
              <TableCell>
                <Badge className="bg-rose-500">Urgent</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="border-amber-500 text-amber-500">
                  En cours
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <div className="w-[80px] h-[45px] relative rounded overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=45&width=80&text=Arme"
                    alt="Incident"
                    fill
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Gun className="h-4 w-4 text-amber-500" />
                  <span>Détection d'arme</span>
                </div>
              </TableCell>
              <TableCell>Parking Sud</TableCell>
              <TableCell>05/07/2023 - 13:45</TableCell>
              <TableCell>
                <Badge className="bg-amber-500">Critique</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="border-amber-500 text-amber-500">
                  En cours
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <div className="w-[80px] h-[45px] relative rounded overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=45&width=80&text=Visage"
                    alt="Incident"
                    fill
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-violet-500" />
                  <span>Visage sensible détecté</span>
                </div>
              </TableCell>
              <TableCell>Hall d'Accueil</TableCell>
              <TableCell>05/07/2023 - 13:12</TableCell>
              <TableCell>
                <Badge className="bg-violet-500">Modéré</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="border-green-500 text-green-500">
                  Traité
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Affichage de 3 alertes sur 24 au total</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Précédent
          </Button>
          <Button variant="outline" size="sm">
            Suivant
          </Button>
        </div>
      </div>
    </div>
  )
}

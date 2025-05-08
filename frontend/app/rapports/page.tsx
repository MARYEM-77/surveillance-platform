import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, Edit, FileText, Filter, Mail, Search } from "lucide-react"

export default function RapportsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Rapports</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" /> Filtrer par date
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" /> Générer un rapport
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="grid flex-1 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Rechercher des rapports..." className="pl-8" />
          </div>
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Rapport d'incidents - Juillet 2023</CardTitle>
              <Badge>Hebdomadaire</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              <p className="mb-2">Généré automatiquement le 07/07/2023</p>
              <p>
                Ce rapport contient une analyse des incidents détectés durant la semaine du 01/07 au 07/07/2023,
                incluant 24 incidents de différentes catégories.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20">
                7 Feux
              </Badge>
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                3 Armes
              </Badge>
              <Badge variant="outline" className="bg-violet-500/10 text-violet-500 border-violet-500/20">
                14 Visages
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <Button variant="outline" size="sm">
              <Edit className="mr-1 h-4 w-4" /> Modifier
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-1 h-4 w-4" /> PDF
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="mr-1 h-4 w-4" /> Envoyer
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Rapport d'incidents - Juin 2023</CardTitle>
              <Badge>Mensuel</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              <p className="mb-2">Généré automatiquement le 30/06/2023</p>
              <p>
                Ce rapport contient une analyse des incidents détectés durant le mois de juin 2023, incluant 87
                incidents de différentes catégories.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20">
                22 Feux
              </Badge>
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                15 Armes
              </Badge>
              <Badge variant="outline" className="bg-violet-500/10 text-violet-500 border-violet-500/20">
                50 Visages
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <Button variant="outline" size="sm">
              <Edit className="mr-1 h-4 w-4" /> Modifier
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-1 h-4 w-4" /> PDF
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="mr-1 h-4 w-4" /> Envoyer
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Rapport d'incidents - Mai 2023</CardTitle>
              <Badge>Mensuel</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              <p className="mb-2">Généré automatiquement le 31/05/2023</p>
              <p>
                Ce rapport contient une analyse des incidents détectés durant le mois de mai 2023, incluant 92 incidents
                de différentes catégories.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20">
                25 Feux
              </Badge>
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                18 Armes
              </Badge>
              <Badge variant="outline" className="bg-violet-500/10 text-violet-500 border-violet-500/20">
                49 Visages
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <Button variant="outline" size="sm">
              <Edit className="mr-1 h-4 w-4" /> Modifier
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-1 h-4 w-4" /> PDF
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="mr-1 h-4 w-4" /> Envoyer
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Rapport d'incidents - Avril 2023</CardTitle>
              <Badge>Mensuel</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              <p className="mb-2">Généré automatiquement le 30/04/2023</p>
              <p>
                Ce rapport contient une analyse des incidents détectés durant le mois d'avril 2023, incluant 78
                incidents de différentes catégories.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20">
                20 Feux
              </Badge>
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                13 Armes
              </Badge>
              <Badge variant="outline" className="bg-violet-500/10 text-violet-500 border-violet-500/20">
                45 Visages
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <Button variant="outline" size="sm">
              <Edit className="mr-1 h-4 w-4" /> Modifier
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-1 h-4 w-4" /> PDF
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="mr-1 h-4 w-4" /> Envoyer
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="flex items-center justify-center mt-8">
        <Button variant="outline">Voir tous les rapports</Button>
      </div>
    </div>
  )
}

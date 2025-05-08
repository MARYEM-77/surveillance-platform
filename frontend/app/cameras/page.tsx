import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Eye, MapPin, Plus, Power, Search, Settings } from "lucide-react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CamerasPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Caméras / Zones</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Ajouter une caméra
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="grid flex-1 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Rechercher des caméras..." className="pl-8" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="liste" className="space-y-4">
        <TabsList>
          <TabsTrigger value="liste">Liste</TabsTrigger>
          <TabsTrigger value="carte">Carte</TabsTrigger>
        </TabsList>

        <TabsContent value="liste" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Entrée Principale</CardTitle>
                  <Badge className="bg-green-500">En ligne</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative aspect-video">
                  <Image
                    src="/placeholder.svg?height=200&width=400&text=Entrée"
                    alt="Caméra"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="bg-black/50 text-white border-0">
                      <MapPin className="mr-1 h-3 w-3" /> Zone A
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-4">
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Camera className="h-3.5 w-3.5" />
                    <span>ID: CAM-001</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Power className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Parking Sud</CardTitle>
                  <Badge className="bg-green-500">En ligne</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative aspect-video">
                  <Image
                    src="/placeholder.svg?height=200&width=400&text=Parking"
                    alt="Caméra"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="bg-black/50 text-white border-0">
                      <MapPin className="mr-1 h-3 w-3" /> Zone B
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-4">
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Camera className="h-3.5 w-3.5" />
                    <span>ID: CAM-002</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Power className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Hall d'Accueil</CardTitle>
                  <Badge className="bg-green-500">En ligne</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative aspect-video">
                  <Image
                    src="/placeholder.svg?height=200&width=400&text=Hall"
                    alt="Caméra"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="bg-black/50 text-white border-0">
                      <MapPin className="mr-1 h-3 w-3" /> Zone A
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-4">
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Camera className="h-3.5 w-3.5" />
                    <span>ID: CAM-003</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Power className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Couloir Principal</CardTitle>
                  <Badge variant="outline" className="border-red-500 text-red-500">
                    Hors ligne
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative aspect-video bg-muted flex items-center justify-center">
                  <Camera className="h-12 w-12 text-muted-foreground/50" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-4">
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Camera className="h-3.5 w-3.5" />
                    <span>ID: CAM-004</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" disabled>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Power className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="carte">
          <Card>
            <CardHeader>
              <CardTitle>Carte des Zones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-[16/9] bg-muted rounded-md overflow-hidden">
                <Image
                  src="/placeholder.svg?height=500&width=900&text=Carte+Interactive"
                  alt="Carte"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <Badge className="bg-green-500 w-fit">Zone A: 2 caméras</Badge>
                  <Badge className="bg-green-500 w-fit">Zone B: 1 caméra</Badge>
                  <Badge className="bg-red-500 w-fit">Zone C: 1 caméra (hors ligne)</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

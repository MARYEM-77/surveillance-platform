'use client'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { FormDescription, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Save, User, Users, Server, Shield } from "lucide-react"
import { useForm, FormProvider } from "react-hook-form"

export default function ParametresPage() {
  const form = useForm() // Initialisation du formulaire

  return (
    <FormProvider {...form}>
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Paramètres</h2>
          <Button variant="default">
            <Save className="mr-2 h-4 w-4" />
            Enregistrer les modifications
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:w-[600px]">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="securite">Sécurité</TabsTrigger>
            <TabsTrigger value="utilisateurs">Utilisateurs</TabsTrigger>
            <TabsTrigger value="systeme">Système</TabsTrigger>
          </TabsList>

          {/* Onglet Général */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres Généraux</CardTitle>
                <CardDescription>
                  Configurez les paramètres généraux de la plateforme.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <FormLabel htmlFor="site-name">Nom de l'installation</FormLabel>
                    <Input id="site-name" defaultValue="Bâtiment Principal" />
                    <FormDescription>Le nom apparaîtra dans les rapports et alertes.</FormDescription>
                  </div>
                  <div className="grid gap-2">
                    <FormLabel>Fuseau horaire</FormLabel>
                    <Select defaultValue="europe-paris">
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un fuseau horaire" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="europe-paris">Europe/Paris (UTC+1)</SelectItem>
                        <SelectItem value="europe-london">Europe/London (UTC+0)</SelectItem>
                        <SelectItem value="america-new_york">America/New_York (UTC-5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <FormLabel>Langue</FormLabel>
                    <Select defaultValue="fr">
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une langue" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <FormLabel>Mode sombre</FormLabel>
                      <FormDescription>Activer l'interface en thème sombre.</FormDescription>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Onglet Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Personnalisez vos alertes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Email", desc: "Recevoir des alertes par email." },
                { label: "SMS", desc: "Recevoir des alertes par SMS." },
                { label: "Push", desc: "Alertes via l'application mobile." },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-center justify-between">
                  <div>
                    <FormLabel>Notifications {label}</FormLabel>
                    <FormDescription>{desc}</FormDescription>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
              <div className="grid gap-2">
                <FormLabel>Niveau de gravité minimum</FormLabel>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les niveaux</SelectItem>
                    <SelectItem value="urgent">Urgent uniquement</SelectItem>
                    <SelectItem value="critical">Critique et plus</SelectItem>
                    <SelectItem value="moderate">Modéré et plus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

          {/* Onglet Sécurité */}
          <TabsContent value="securite" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de Sécurité</CardTitle>
              <CardDescription>Configurez les paramètres de sécurité et d'authentification.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Authentification à deux facteurs</FormLabel>
                    <FormDescription>
                      Exiger une authentification à deux facteurs pour tous les utilisateurs.
                    </FormDescription>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Verrouillage automatique</FormLabel>
                    <FormDescription>Verrouiller l'écran après une période d'inactivité.</FormDescription>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="grid gap-2">
                  <FormLabel>Délai de verrouillage (minutes)</FormLabel>
                  <Input type="number" defaultValue="15" />
                </div>
                <div className="grid gap-2">
                  <FormLabel>Politique de mot de passe</FormLabel>
                  <Select defaultValue="strong">
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une politique" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basique (min. 8 caractères)</SelectItem>
                      <SelectItem value="medium">Moyenne (min. 10 caractères, 1 majuscule)</SelectItem>
                      <SelectItem value="strong">Forte (min. 12 caractères, majuscules, chiffres, symboles)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

          {/* Onglet Utilisateurs */}
          <TabsContent value="utilisateurs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Utilisateurs</CardTitle>
              <CardDescription>Gérez les utilisateurs et leurs permissions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="flex items-center p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Admin Principal</p>
                        <p className="text-sm text-muted-foreground">admin@surveillance.fr</p>
                      </div>
                    </div>
                    <Badge className="ml-auto">Administrateur</Badge>
                  </div>
                  <div className="flex items-center p-4 border-t">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Agent Sécurité</p>
                        <p className="text-sm text-muted-foreground">agent@surveillance.fr</p>
                      </div>
                    </div>
                    <Badge className="ml-auto" variant="outline">
                      Opérateur
                    </Badge>
                  </div>
                  <div className="flex items-center p-4 border-t">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Technicien</p>
                        <p className="text-sm text-muted-foreground">tech@surveillance.fr</p>
                      </div>
                    </div>
                    <Badge className="ml-auto" variant="outline">
                      Technicien
                    </Badge>
                  </div>
                </div>
                <Button className="w-full">
                  <Users className="mr-2 h-4 w-4" /> Gérer les utilisateurs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

          <TabsContent value="systeme" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Système</CardTitle>
              <CardDescription>Configurez les paramètres techniques du système.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Enregistrement automatique</FormLabel>
                    <FormDescription>Enregistrer automatiquement les flux vidéo.</FormDescription>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="grid gap-2">
                  <FormLabel>Durée de conservation (jours)</FormLabel>
                  <Input type="number" defaultValue="30" />
                  <FormDescription>Durée de conservation des enregistrements vidéo.</FormDescription>
                </div>
                <div className="grid gap-2">
                  <FormLabel>Qualité d'enregistrement</FormLabel>
                  <Select defaultValue="high">
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une qualité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Basse (720p)</SelectItem>
                      <SelectItem value="medium">Moyenne (1080p)</SelectItem>
                      <SelectItem value="high">Haute (1440p)</SelectItem>
                      <SelectItem value="ultra">Ultra (4K)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Mode économie d'énergie</FormLabel>
                    <FormDescription>Réduire la consommation d'énergie pendant les heures creuses.</FormDescription>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4">
              <div className="grid w-full gap-2">
                <FormLabel>Serveur API</FormLabel>
                <Input defaultValue="https://api.surveillance.fr" readOnly />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Server className="mr-2 h-4 w-4" /> Vérifier la connexion
                </Button>
                <Button variant="outline">
                  <Shield className="mr-2 h-4 w-4" /> Tester la sécurité
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        </Tabs>
      </div>
    </FormProvider>
  )
}
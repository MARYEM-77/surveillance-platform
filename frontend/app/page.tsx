'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FlameIcon as Fire, PenIcon as Gun, User, AlertTriangle, ArrowRight } from "lucide-react"
import { DashboardChart } from "@/components/dashboard-chart"
import { IncidentCard } from "@/components/incident-card"
import { useEffect, useState } from 'react';


export default function Dashboard() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [selectedTab, setSelectedTab] = useState("jour");
  const [deltas, setDeltas] = useState<Record<string, number>>({});


  useEffect(() => {
    fetch('http://localhost:8000/alerts/stats/')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error('Erreur API :', err));
  }, []);

  useEffect(() => {
  fetch(`http://localhost:8000/alerts/delta/?interval=${selectedTab}`)
    .then((res) => res.json())
    .then((data) => setDeltas(data))
    .catch((err) => console.error('Erreur delta :', err));
}, [selectedTab]);


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tableau de Bord</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Exporter</Button>
          <Button size="sm">Actualiser</Button>
        </div>
      </div>

      {/* <Tabs defaultValue="jour" className="space-y-4"> */}
      <Tabs defaultValue="jour" className="space-y-4" onValueChange={setSelectedTab}>

        <div className="flex justify-between">
          <TabsList>
            <TabsTrigger value="jour">Jour</TabsTrigger>
            <TabsTrigger value="semaine">Semaine</TabsTrigger>
            <TabsTrigger value="mois">Mois</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="jour" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
                
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total || 0}</div>
                {/* <p className="text-xs text-muted-foreground">+5 depuis hier</p> */}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Détection Feu</CardTitle>
                <Fire className="h-4 w-4 text-rose-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.feu || 0}</div>
                
                <p className="text-xs text-muted-foreground">
                {deltas.feu >= 0 ? "+" : ""}
                {deltas.feu ?? 0} depuis hier
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Détection Armes</CardTitle>
                <Gun className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.arme || 0}</div>
                <p className="text-xs text-muted-foreground">
  {deltas.arme >= 0 ? "+" : ""}
  {deltas.arme ?? 0} depuis hier
</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Visages Sensibles</CardTitle>
                <User className="h-4 w-4 text-violet-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.criminel || 0}</div>
                <p className="text-xs text-muted-foreground">
  {deltas.criminel >= 0 ? "+" : ""}
  {deltas.criminel ?? 0} depuis hier
</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Incidents par Heure</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <DashboardChart />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Incidents Récents</CardTitle>
                <CardDescription>Derniers incidents détectés en temps réel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert className="border-rose-500/50 bg-rose-500/10">
                    <Fire className="h-4 w-4 text-rose-500" />
                    <AlertTitle className="flex items-center gap-2">
                      Détection de feu
                      <Badge variant="outline" className="ml-2">
                        Urgent
                      </Badge>
                    </AlertTitle>
                    <AlertDescription className="flex justify-between">
                      <span>Caméra: Entrée Principale</span>
                      <span className="text-xs text-muted-foreground">Il y a 5 min</span>
                    </AlertDescription>
                  </Alert>

                  <Alert className="border-amber-500/50 bg-amber-500/10">
                    <Gun className="h-4 w-4 text-amber-500" />
                    <AlertTitle className="flex items-center gap-2">
                      Détection d'arme
                      <Badge variant="outline" className="ml-2">
                        Critique
                      </Badge>
                    </AlertTitle>
                    <AlertDescription className="flex justify-between">
                      <span>Caméra: Parking Sud</span>
                      <span className="text-xs text-muted-foreground">Il y a 23 min</span>
                    </AlertDescription>
                  </Alert>

                  <Alert className="border-violet-500/50 bg-violet-500/10">
                    <User className="h-4 w-4 text-violet-500" />
                    <AlertTitle className="flex items-center gap-2">
                      Visage sensible détecté
                      <Badge variant="outline" className="ml-2">
                        Modéré
                      </Badge>
                    </AlertTitle>
                    <AlertDescription className="flex justify-between">
                      <span>Caméra: Hall d'Accueil</span>
                      <span className="text-xs text-muted-foreground">Il y a 47 min</span>
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="semaine" className="space-y-4">
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.total || 0}</div>
        <p className="text-xs text-muted-foreground">
          {deltas.total >= 0 ? "+" : ""}
          {deltas.total ?? 0} depuis la semaine dernière
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Détection Feu</CardTitle>
        <Fire className="h-4 w-4 text-rose-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.feu || 0}</div>
        <p className="text-xs text-muted-foreground">
          {deltas.feu >= 0 ? "+" : ""}
          {deltas.feu ?? 0} depuis la semaine dernière
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Détection Armes</CardTitle>
        <Gun className="h-4 w-4 text-amber-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.arme || 0}</div>
        <p className="text-xs text-muted-foreground">
          {deltas.arme >= 0 ? "+" : ""}
          {deltas.arme ?? 0} depuis la semaine dernière
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Visages Sensibles</CardTitle>
        <User className="h-4 w-4 text-violet-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.criminel || 0}</div>
        <p className="text-xs text-muted-foreground">
          {deltas.criminel >= 0 ? "+" : ""}
          {deltas.criminel ?? 0} depuis la semaine dernière
        </p>
      </CardContent>
    </Card>
  </div>
</TabsContent>


       <TabsContent value="mois" className="space-y-4">
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.total || 0}</div>
        <p className="text-xs text-muted-foreground">
          {deltas.total >= 0 ? "+" : ""}
          {deltas.total ?? 0} depuis le mois dernier
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Détection Feu</CardTitle>
        <Fire className="h-4 w-4 text-rose-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.feu || 0}</div>
        <p className="text-xs text-muted-foreground">
          {deltas.feu >= 0 ? "+" : ""}
          {deltas.feu ?? 0} depuis le mois dernier
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Détection Armes</CardTitle>
        <Gun className="h-4 w-4 text-amber-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.arme || 0}</div>
        <p className="text-xs text-muted-foreground">
          {deltas.arme >= 0 ? "+" : ""}
          {deltas.arme ?? 0} depuis le mois dernier
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Visages Sensibles</CardTitle>
        <User className="h-4 w-4 text-violet-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.criminel || 0}</div>
        <p className="text-xs text-muted-foreground">
          {deltas.criminel >= 0 ? "+" : ""}
          {deltas.criminel ?? 0} depuis le mois dernier
        </p>
      </CardContent>
    </Card>
  </div>
</TabsContent>

      </Tabs>

      <h3 className="text-xl font-semibold mt-6 mb-4">Incidents en Direct</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <IncidentCard
          type="fire"
          title="Détection de feu"
          location="Entrée Principale"
          time="Il y a 5 min"
          severity="urgent"
        />
        <IncidentCard
          type="weapon"
          title="Détection d'arme"
          location="Parking Sud"
          time="Il y a 23 min"
          severity="critical"
        />
        <IncidentCard
          type="face"
          title="Visage sensible détecté"
          location="Hall d'Accueil"
          time="Il y a 47 min"
          severity="moderate"
        />
      </div>

      <div className="mt-6">
        <Button variant="outline" className="w-full">
          Voir tous les incidents <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

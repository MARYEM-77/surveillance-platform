"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FlameIcon as Fire,
  PenIcon as Gun,
  User,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Clock,
} from "lucide-react";
import { DashboardChart } from "@/components/dashboard-chart";
import { DashboardChartMonth } from "@/components/dashboard-chart-month";
import { DashboardChartWeek } from "@/components/dashboard-chart-week";
import { IncidentCard } from "@/components/incident-card";
import { useEffect, useState } from "react";


import { AlertDialogPopup } from "@/components/AlertDialogPopup";

export default function Dashboard() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [selectedTab, setSelectedTab] = useState("jour");
  const [deltas, setDeltas] = useState<Record<string, number>>({});
  const [statusData, setStatusData] = useState({
    treated: 0,
    untreated: 0,
    deltaTreated: 0,
    deltaUntreated: 0,
    percentageTreated: 0,
    percentageUntreated: 0,
  });

const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);
const [showAll, setShowAll] = useState(false);


//fct pour reload automatiquement la page : 

const reloadStatusData = () => {
  Promise.all([
    fetch(`http://localhost:8000/alerts/interval-stats/?interval=${selectedTab}`).then((res) => res.json()),
    fetch(`http://localhost:8000/alerts/pourcentages/?interval=${selectedTab}`).then((res) => res.json()),
    fetch(`http://localhost:8000/alerts/status-delta/?interval=${selectedTab}`).then((res) => res.json()),
  ])
    .then(([status, percentages, deltas]) => {
      setStatusData({
        treated: status["traite"],
        untreated: status["non_traite"],
        deltaTreated: deltas["Traité"],
        deltaUntreated: deltas["Non traité"],
        percentageTreated: percentages["traite"],
        percentageUntreated: percentages["non_traite"],
      });
    })
    .catch((error) => {
      console.error("Erreur lors du rechargement des données :", error);
    });
};



//code jihane ajouté 


const getRelativeTime = (timestamp: string) => {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
if (diffHours > 0) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
if (diffMin > 0) return `Il y a ${diffMin} min`;

  return "À l'instant";
};

//code ajouté par jihane pour le traitement des alertes non traitées : 


const handleTreatAlert = async (alert: AlertType) => {
  try {
    const response = await fetch(`http://localhost:8000/alerts/${alert.alert_id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ statut: "Traité" }),
    });

    if (response.ok) {
      setAlerts((prev) => prev.filter((a) => a.alert_id !== alert.alert_id));
      setSelectedAlert(null);
      reloadStatusData();
    } else {
      console.error("Échec de la mise à jour du statut de l'alerte");
    }
  } catch (error) {
    console.error("Erreur lors de la requête PATCH :", error);
  }
};


//




  type AlertType = {
  alert_id: string;
  detection_type: string;
  location: string;
  timestamp: string;
  media_reference: string;
};

const [alerts, setAlerts] = useState<AlertType[]>([]);


//




 // 📊 Récupération stats incident (types et deltas)
useEffect(() => {
  fetch(`http://localhost:8000/alerts/stats/?interval=${selectedTab}`)
    .then((res) => res.json())
    .then((data) => {
      setStats(data); // le backend retourne déjà un objet plat avec les stats
    })
    .catch((err) =>
      console.error("Erreur lors de la récupération des statistiques :", err)
    );
}, [selectedTab]);

  useEffect(() => {
    // Appels parallèles aux trois routes
    Promise.all([
      fetch(
        `http://localhost:8000/alerts/interval-stats/?interval=${selectedTab}`
      ).then((res) => res.json()),
      fetch(
        `http://localhost:8000/alerts/pourcentages/?interval=${selectedTab}`
      ).then((res) => res.json()),
      fetch(
        `http://localhost:8000/alerts/status-delta/?interval=${selectedTab}`
      ).then((res) => res.json()),
    ])
      .then(([status, percentages, deltas]) => {
        setStatusData({
          treated: status["traite"],
          untreated: status["non_traite"],
          deltaTreated: deltas["Traité"],
          deltaUntreated: deltas["Non traité"],
          percentageTreated: percentages["traite"],
          percentageUntreated: percentages["non_traite"],
        });
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des données :", error);
      });
  }, [selectedTab]);

useEffect(() => {
  fetch("http://localhost:8000/alerts/unresolved")
    .then((res) => res.json())
    .then((data) => setAlerts(data))
    .catch((err) => console.error("Erreur chargement alertes :", err));
}, []);


const getSeverity = (type: string): "urgent" | "critical" | "moderate" => {
  if (type === "feu") return "urgent";
  if (type === "arme") return "critical";
  return "moderate";
};



  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tableau de Bord</h2>
        <div className="flex items-center gap-2">
          
        </div>
      </div>

      {/* <Tabs defaultValue="jour" className="space-y-4"> */}
      <Tabs
        defaultValue="jour"
        className="space-y-4"
        onValueChange={setSelectedTab}
      >
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
                <CardTitle>Statut des Incidents</CardTitle>
                <CardDescription>
                  Vue d'ensemble des incidents traités et non traités
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Incidents Traités
                      </h3>
                      <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-500 border-green-500/20"
                      >
                        Terminés
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold">
                          {statusData.treated || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {statusData.deltaTreated >= 0 ? "+" : ""}
                          {statusData.deltaTreated || 0} depuis hier
                        </p>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{
                          width: `${statusData.percentageTreated || 0}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {statusData.percentageUntreated || 0} des incidents totaux
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Incidents Non Traités
                      </h3>
                      <Badge
                        variant="outline"
                        className="bg-amber-500/10 text-amber-500 border-amber-500/20"
                      >
                        En attente
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <Clock className="h-6 w-6 text-amber-500" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold">
                          {statusData.untreated || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {statusData.deltaUntreated >= 0 ? "+" : ""}
                          {statusData.deltaUntreated || 0} depuis hier
                        </p>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{
                          width: `${statusData.percentageTreated || 0}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {statusData.percentageUntreated || 0} des incidents totaux
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="semaine" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Incidents
                </CardTitle>
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
                <CardTitle className="text-sm font-medium">
                  Détection Feu
                </CardTitle>
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
                <CardTitle className="text-sm font-medium">
                  Détection Armes
                </CardTitle>
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
                <CardTitle className="text-sm font-medium">
                  Visages Sensibles
                </CardTitle>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Incidents par Semaine</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <DashboardChartWeek />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Statut des Incidents</CardTitle>
                <CardDescription>
                  Vue d'ensemble des incidents traités et non traités
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Incidents Traités
                      </h3>
                      <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-500 border-green-500/20"
                      >
                        Terminés
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold">
                          {statusData.treated || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {statusData.deltaTreated >= 0 ? "+" : ""}
                          {statusData.deltaTreated || 0} depuis la semaine
                          dernière
                        </p>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{
                          width: `${statusData.percentageTreated || 0}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {statusData.percentageTreated || 0} des incidents totaux
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Incidents Non Traités
                      </h3>
                      <Badge
                        variant="outline"
                        className="bg-amber-500/10 text-amber-500 border-amber-500/20"
                      >
                        En attente
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <Clock className="h-6 w-6 text-amber-500" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold">
                          {statusData.untreated || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {statusData.deltaUntreated >= 0 ? "+" : ""}
                          {statusData.deltaUntreated || 0} depuis la semaine
                          dernière
                        </p>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{
                          width: `${statusData.percentageUntreated|| 0}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {statusData.percentageUntreated || 0} des incidents totaux
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mois" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Incidents
                </CardTitle>
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
                <CardTitle className="text-sm font-medium">
                  Détection Feu
                </CardTitle>
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
                <CardTitle className="text-sm font-medium">
                  Détection Armes
                </CardTitle>
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
                <CardTitle className="text-sm font-medium">
                  Visages Sensibles
                </CardTitle>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Incidents par Mois</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <DashboardChartMonth />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Statut des Incidents</CardTitle>
                <CardDescription>
                  Vue d'ensemble des incidents traités et non traités
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Incidents Traités
                      </h3>
                      <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-500 border-green-500/20"
                      >
                        Terminés
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold">
                          {statusData.treated || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {statusData.deltaTreated >= 0 ? "+" : ""}
                          {statusData.deltaTreated || 0} depuis le mois dernier
                        </p>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{
                          width: `${statusData.percentageTreated || 0}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {statusData.percentageTreated || 0} des incidents totaux
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Incidents Non Traités
                      </h3>
                      <Badge
                        variant="outline"
                        className="bg-amber-500/10 text-amber-500 border-amber-500/20"
                      >
                        En attente
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <Clock className="h-6 w-6 text-amber-500" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold">
                          {statusData.untreated || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {statusData.deltaUntreated >= 0 ? "+" : ""}
                          {statusData.deltaUntreated || 0} depuis le mois
                          dernier
                        </p>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{
                          width: `${statusData.percentageUntreated || 0}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {statusData.percentageUntreated || 0} des incidents totaux
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

     <h3 className="text-xl font-semibold mt-6 mb-4">Incidents en Direct</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(showAll ? alerts : alerts.slice(0, 3)).map((alert) => (
          <IncidentCard
            key={alert.alert_id}
            type={
              alert.detection_type === "feu"
                ? "fire"
                : alert.detection_type === "arme"
                ? "weapon"
                : "face"
            }
            title={
              alert.detection_type === "feu"
                ? "Détection de feu"
                : alert.detection_type === "arme"
                ? "Détection d'arme"
                : "Visage sensible détecté"
            }
            location={alert.location}
            time={getRelativeTime(alert.timestamp)}
            severity={getSeverity(alert.detection_type)}
            image={`http://localhost:8000/${alert.media_reference}`}
            alertId={alert.alert_id}
            onTreat={() => setSelectedAlert(alert)}
          />
        ))}
      </div>

      <div className="mt-6">
        <Button variant="outline" className="w-full" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Afficher moins" : "Voir tous les incidents"} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <AlertDialogPopup
  alert={selectedAlert}
  onClose={() => setSelectedAlert(null)}
  onTreatConfirm={handleTreatAlert}
/>

    </div>
  );
}
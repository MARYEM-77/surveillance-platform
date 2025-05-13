"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CheckCircle,
  Filter,
  FlameIcon as Fire,
  PenIcon as Gun,
  Plus,
  Search,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";

import Image from "next/image";

type Alert = {
  alert_id: string;
  media_reference: string;
  detection_type: "feu" | "arme" | "criminel";
  location: string;
  timestamp: string;
  statut: "Traité" | "Non traité";
};

function isValidMediaReference(url?: string): boolean {
  if (!url || typeof url !== "string") return false;

  try {
    // On accepte aussi les chemins relatifs ("/images/abc.jpg")
    if (url.startsWith("/")) return true;

    // Sinon, on teste si c'est une URL absolue valide
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function AlertesPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const pageSize = 5;
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [showDateFilter, setShowDateFilter] = useState<boolean>(false);
  const [statutFilter, setStatutFilter] = useState("all");

  const fetchAlerts = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      search,
      type: typeFilter,
      statut: statutFilter,
      skip: ((page - 1) * pageSize).toString(),
      limit: pageSize.toString(),
      ...(startDate ? { date_from: startDate } : {}),
      ...(endDate ? { date_to: endDate } : {}),
    });

    try {
      const res = await fetch(
        `http://localhost:8000/alerts/AllaLerts?${params}`
      );
      const json = await res.json();
      setAlerts(json.data);
      setTotal(json.total);
    } catch (error) {
      console.error("Erreur lors du chargement des alertes :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [search, typeFilter, statutFilter, page, startDate, endDate]);

  const handleTreatAlert = async (alert: Alert) => {
    const result = await MySwal.fire({
      title: "Confirmation",
      text: "Voulez-vous vraiment traiter cette alerte ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, traiter",
      cancelButtonText: "Annuler",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(
        `http://localhost:8000/alerts/${alert.alert_id}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ statut: "Traité" }),
        }
      );

      if (response.ok) {
        await fetchAlerts();
        MySwal.fire({
          title: "Succès",
          text: "L'alerte a été traitée avec succès.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        MySwal.fire({
          title: "Erreur",
          text: "Échec de la mise à jour du statut de l'alerte.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la requête PATCH :", error);
      MySwal.fire({
        title: "Erreur",
        text: "Une erreur est survenue lors de la requête.",
        icon: "error",
      });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Alertes</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="grid flex-1 gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher des alertes..."
              className="pl-8"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Select
              value={typeFilter}
              onValueChange={(val) => {
                setTypeFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="all">Tous types</SelectItem>
                <SelectItem value="feu">Feu</SelectItem>
                <SelectItem value="arme">Arme</SelectItem>
                <SelectItem value="criminel">Criminel</SelectItem>
              </SelectContent>
            </Select>
            <div>
              <Select
                value={statutFilter}
                onValueChange={(val) => {
                  setStatutFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger id="statut">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="Traité">Traité</SelectItem>
                  <SelectItem value="Non traité">Non traité</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            variant="outline"
            className="sm:w-[150px]"
            onClick={() => setShowDateFilter((prev) => !prev)}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Filtrer par date
          </Button>

          {/* Affichage des champs de dates quand on clique sur le bouton */}
          {showDateFilter && (
            <div className="flex gap-2">
              <Input
                type="date"
                value={startDate || ""}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Date de début"
              />
              <Input
                type="date"
                value={endDate || ""}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Date de fin"
              />
            </div>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Alert_id</TableHead>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date & Heure</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7}>Chargement...</TableCell>
              </TableRow>
            ) : (alerts?.length ?? 0) === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>Aucune alerte trouvée.</TableCell>
              </TableRow>
            ) : (
              alerts.map((alert) => (
                <TableRow key={alert.alert_id}>
                  <TableCell>{alert.alert_id}</TableCell>
                  <TableCell>
                    <div className="w-[80px] h-[45px] relative rounded overflow-hidden">
                      <Image
                        src={
                          isValidMediaReference(alert.media_reference)
                            ? alert.media_reference!
                            : "/placeholder.svg"
                        }
                        alt="Incident"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {alert.detection_type === "feu" && (
                        <Fire className="h-4 w-4 text-rose-500" />
                      )}
                      {alert.detection_type === "arme" && (
                        <Gun className="h-4 w-4 text-amber-500" />
                      )}
                      {alert.detection_type === "criminel" && (
                        <User className="h-4 w-4 text-violet-500" />
                      )}

                      <span>
                        {alert.detection_type === "feu"
                          ? "Détection de feu"
                          : alert.detection_type === "arme"
                            ? "Détection d'arme"
                            : "Visage sensible détecté"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{alert.location}</TableCell>
                  <TableCell>
                    {new Date(alert.timestamp).toLocaleString("fr-FR")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        alert.statut === "Traité"
                          ? "border-green-500 text-green-500"
                          : "border-amber-500 text-amber-500"
                      }
                    >
                      {alert.statut}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          // Appelle une fonction de traitement ici
                          handleTreatAlert(alert);
                        }}
                        disabled={alert.statut === "Traité"} // désactive si déjà traité
                      >
                        <CheckCircle
                          className={`h-4 w-4 ${
                            alert.statut === "Traité"
                              ? "text-gray-400"
                              : "text-green-500"
                          }`}
                        />
                      </Button>
                      <Button
  variant="ghost"
  size="icon"
  onClick={() => {
    const downloadUrl = `http://localhost:8000/alerts/${alert.alert_id}/pdf`;
    window.open(downloadUrl, "_blank");
  }}
  title="Télécharger le rapport PDF"
>
  <Download className="h-4 w-4" />
</Button>

                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Affichage de {alerts?.length ?? 0} alertes sur {total ?? 0} au total
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page * pageSize >= total}
            onClick={() => setPage(page + 1)}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}

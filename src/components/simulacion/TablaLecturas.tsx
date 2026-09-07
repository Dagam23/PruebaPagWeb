import { ArrowUpDown, Download, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { DEFAULT_SETPOINTS, SetpointConfig, VARIABLES } from "@/lib/constants";
import {
  descargarCSV,
  estadoGeneral,
  telemetryService,
  type Lectura,
} from "@/services/telemetryService";

const POR_PAGINA = 10;

interface TablaLecturasProps {
  datos: Lectura[];
  setpoints?: SetpointConfig;
}

export function TablaLecturas({
  datos,
  setpoints = DEFAULT_SETPOINTS,
}: TablaLecturasProps) {
  const [orden, setOrden] = useState<"desc" | "asc">("desc");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);

  const filtradas = useMemo(() => {
    const base = datos.filter((d) => {
      const est = estadoGeneral(d, setpoints);
      if (estadoFiltro !== "todos" && est !== estadoFiltro) return false;
      if (busqueda) {
        const f = new Date(d.t).toLocaleString("es-CO").toLowerCase();
        if (!f.includes(busqueda.toLowerCase())) return false;
      }
      return true;
    });
    return [...base].sort((a, b) => (orden === "desc" ? b.t - a.t : a.t - b.t));
  }, [datos, orden, estadoFiltro, busqueda, setpoints]);

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const visibles = filtradas.slice(
    (paginaActual - 1) * POR_PAGINA,
    paginaActual * POR_PAGINA
  );

  return (
    <section className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-end sm:justify-between border-b border-border/40 pb-4">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">
            Registro Histórico de Telemetría
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Explora, filtra y descarga las lecturas continuas de los sensores
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPagina(1);
              }}
              placeholder="Buscar por hora o fecha..."
              aria-label="Filtrar lecturas por fecha u hora"
              className="w-52 pl-8 h-9 text-xs"
            />
          </div>

          <Select
            value={estadoFiltro}
            onValueChange={(v) => {
              setEstadoFiltro(v);
              setPagina(1);
            }}
          >
            <SelectTrigger className="w-36 h-9 text-xs" aria-label="Filtrar por estado">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="advertencia">Advertencia</SelectItem>
              <SelectItem value="critico">Crítico</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setOrden((o) => (o === "desc" ? "asc" : "desc"))}
            className="h-9 text-xs gap-1.5"
          >
            <ArrowUpDown aria-hidden className="h-3.5 w-3.5" />
            {orden === "desc" ? "Más recientes" : "Más antiguas"}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              descargarCSV(
                `telemetria-acuaponica-${new Date().toISOString().slice(0, 10)}.csv`,
                telemetryService.aCSV(filtradas)
              )
            }
            className="h-9 text-xs gap-1.5"
          >
            <Download aria-hidden className="h-3.5 w-3.5" /> Exportar CSV
          </Button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Fecha</TableHead>
              <TableHead className="text-xs">Hora</TableHead>
              {VARIABLES.map((v) => (
                <TableHead key={v.id} className="whitespace-nowrap text-xs">
                  {v.nombre.replace("del agua", "")} {v.unidad && `(${v.unidad})`}
                </TableHead>
              ))}
              <TableHead className="text-xs">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-10 text-center text-xs text-muted-foreground">
                  No hay lecturas que coincidan con los filtros aplicados.
                </TableCell>
              </TableRow>
            ) : (
              visibles.map((d) => {
                const est = estadoGeneral(d, setpoints);
                return (
                  <TableRow key={d.t} className="hover:bg-muted/40 text-xs">
                    <TableCell className="font-mono">{new Date(d.t).toLocaleDateString("es-CO")}</TableCell>
                    <TableCell className="font-mono">{new Date(d.t).toLocaleTimeString("es-CO")}</TableCell>
                    {VARIABLES.map((v) => (
                      <TableCell key={v.id} className="font-medium">
                        {d[v.id].toFixed(v.decimales)}
                      </TableCell>
                    ))}
                    <TableCell>
                      <Badge
                        variant={
                          est === "normal"
                            ? "secondary"
                            : est === "advertencia"
                            ? "default"
                            : "destructive"
                        }
                        className="text-[10px]"
                      >
                        {est}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>
          Página {paginaActual} de {totalPaginas} · {filtradas.length} lecturas
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={paginaActual <= 1}
            onClick={() => setPagina(paginaActual - 1)}
            className="h-8 text-xs"
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={paginaActual >= totalPaginas}
            onClick={() => setPagina(paginaActual + 1)}
            className="h-8 text-xs"
          >
            Siguiente
          </Button>
        </div>
      </div>
    </section>
  );
}

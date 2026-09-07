import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DEFAULT_SETPOINTS,
  SetpointConfig,
  VARIABLE_MAP,
  VARIABLES,
  type VariableId,
} from "@/lib/constants";
import type { Lectura } from "@/services/telemetryService";
import { Clock, Grid, Layers, Play, Pause, RotateCw } from "lucide-react";

const INTERVALOS = [
  { id: "15m", label: "15 min", ms: 15 * 60 * 1000 },
  { id: "1h", label: "1 hora", ms: 60 * 60 * 1000 },
  { id: "6h", label: "6 horas", ms: 6 * 60 * 60 * 1000 },
  { id: "12h", label: "12 horas", ms: 12 * 60 * 60 * 1000 },
  { id: "hoy", label: "24 horas", ms: 24 * 60 * 60 * 1000 },
  { id: "48h", label: "48 horas", ms: 48 * 60 * 60 * 1000 },
] as const;

const GRUPOS: { id: string; nombre: string; variables: VariableId[] }[] = [
  {
    id: "todos",
    nombre: "Todas las variables",
    variables: ["temperatura", "ph", "oxigeno", "amonio", "nitrito", "nitrato"],
  },
  {
    id: "fisico",
    nombre: "Físico-químico (T, pH, OD)",
    variables: ["temperatura", "ph", "oxigeno"],
  },
  {
    id: "nitrogeno",
    nombre: "Ciclo del Nitrógeno (NH₄, NO₂, NO₃)",
    variables: ["amonio", "nitrito", "nitrato"],
  },
];

interface GraficasDiaProps {
  datos: Lectura[];
  setpoints?: SetpointConfig;
  isSimRunning?: boolean;
  onToggleSim?: () => void;
  onRegenerateData?: () => void;
}

export function GraficasDia({
  datos,
  setpoints = DEFAULT_SETPOINTS,
  isSimRunning = true,
  onToggleSim,
  onRegenerateData,
}: GraficasDiaProps) {
  const [intervalo, setIntervalo] = useState<(typeof INTERVALOS)[number]["id"]>("6h");
  const [modoVista, setModoVista] = useState<"todas" | "unificada">("todas");
  const [grupo, setGrupo] = useState("fisico");
  const [ocultas, setOcultas] = useState<VariableId[]>([]);

  const activo = GRUPOS.find((g) => g.id === grupo) ?? GRUPOS[0];
  const visibles = activo.variables.filter((v) => !ocultas.includes(v));

  // Filtrado temporal
  const serie = useMemo(() => {
    const ms = INTERVALOS.find((i) => i.id === intervalo)?.ms ?? 6 * 3600_000;
    const desde = Date.now() - ms;
    return datos
      .filter((d) => d.t >= desde)
      .map((d) => ({
        ...d,
        hora: new Date(d.t).toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
  }, [datos, intervalo]);

  const alternar = (id: VariableId) =>
    setOcultas((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]));

  return (
    <section className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
      {/* Barra superior de controles */}
      <div className="grid gap-4 border-b border-border/40 pb-4 lg:flex lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-bold text-foreground">
              Comportamiento Temporal & Telemetría Gráfica
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Analiza la dinámica temporal individual o todas las variables simultáneamente
          </p>
        </div>

        {/* Selector de modo de vista: Todas a la vez vs Unificada */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-lg border border-border bg-muted/40 p-1">
            <button
              type="button"
              onClick={() => setModoVista("todas")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                modoVista === "todas"
                  ? "bg-card text-primary shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid className="h-3.5 w-3.5" />
              Ver todas a la vez (Matriz)
            </button>
            <button
              type="button"
              onClick={() => setModoVista("unificada")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                modoVista === "unificada"
                  ? "bg-card text-primary shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              Gráfica Consolidada
            </button>
          </div>

          {onToggleSim && (
            <Button
              size="sm"
              variant={isSimRunning ? "outline" : "default"}
              onClick={onToggleSim}
              className="flex items-center gap-1.5 text-xs"
            >
              {isSimRunning ? (
                <>
                  <Pause className="h-3.5 w-3.5" /> Pausar Tiempo
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" /> Reanudar
                </>
              )}
            </Button>
          )}

          {onRegenerateData && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onRegenerateData}
              title="Regenerar datos simulados del ciclo"
              className="h-8 w-8 p-0"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Selector de Modificación del Tiempo (Intervalos) */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-muted-foreground mr-1">
            Ventana temporal:
          </span>
          {INTERVALOS.map((i) => (
            <Button
              key={i.id}
              size="sm"
              variant={intervalo === i.id ? "default" : "outline"}
              onClick={() => setIntervalo(i.id)}
              className="h-7 text-xs px-2.5"
            >
              {i.label}
            </Button>
          ))}
        </div>

        <Badge variant="outline" className="text-[11px] font-mono">
          {serie.length} muestras analizadas
        </Badge>
      </div>

      {/* ========================================================
          MODO 1: VER TODAS LAS GRÁFICAS A LA VEZ (MATRIZ 6 VARIABLES)
         ======================================================== */}
      {modoVista === "todas" ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VARIABLES.map((v) => {
            const sp = setpoints[v.id];
            const ultimaLectura = serie[serie.length - 1];
            const valorActual = ultimaLectura ? ultimaLectura[v.id] : null;

            return (
              <div
                key={v.id}
                className="rounded-xl border border-border/70 bg-card/60 p-3 shadow-2xs"
              >
                <div className="mb-2 flex items-center justify-between border-b border-border/40 pb-2">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{v.nombre}</h4>
                    <span className="text-[10px] text-muted-foreground">
                      Rango setpoint: {sp.min} – {sp.max} {v.unidad}
                    </span>
                  </div>
                  {valorActual !== null && (
                    <span className="font-display text-sm font-bold" style={{ color: v.color }}>
                      {valorActual.toFixed(v.decimales)} {v.unidad}
                    </span>
                  )}
                </div>

                <div className="h-48 w-full">
                  {serie.length === 0 ? (
                    <p className="grid h-full place-items-center text-xs text-muted-foreground">
                      Sin datos en este rango.
                    </p>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={serie} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.6} />
                        <XAxis dataKey="hora" tick={{ fontSize: 9 }} minTickGap={20} />
                        <YAxis
                          tick={{ fontSize: 9 }}
                          domain={["auto", "auto"]}
                          width={32}
                        />
                        <Tooltip
                          labelFormatter={(l) => `Hora: ${l}`}
                          formatter={(val: number) => [`${val} ${v.unidad}`, v.nombre]}
                          contentStyle={{
                            backgroundColor: "var(--color-card)",
                            borderColor: "var(--color-border)",
                            fontSize: "11px",
                            borderRadius: "8px",
                          }}
                        />
                        {/* Área de rango de setpoint normal */}
                        <ReferenceArea
                          y1={sp.min}
                          y2={sp.max}
                          fill={v.color}
                          fillOpacity={0.12}
                        />
                        <Line
                          type="monotone"
                          dataKey={v.id}
                          stroke={v.color}
                          strokeWidth={2}
                          dot={false}
                          isAnimationActive={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ========================================================
           MODO 2: VISTA UNIFICADA / COMPARATIVA CON GRUPOS
           ======================================================== */
        <div className="mt-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {GRUPOS.map((g) => (
                <Button
                  key={g.id}
                  size="sm"
                  variant={grupo === g.id ? "secondary" : "ghost"}
                  onClick={() => setGrupo(g.id)}
                  className="h-7 text-xs"
                >
                  {g.nombre}
                </Button>
              ))}
            </div>

            {/* Alternar variables individuales */}
            <div className="flex flex-wrap gap-1.5">
              {activo.variables.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => alternar(v)}
                  aria-pressed={!ocultas.includes(v)}
                  className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
                    ocultas.includes(v)
                      ? "border-border text-muted-foreground opacity-60"
                      : "border-primary bg-primary/10 text-primary font-medium"
                  }`}
                >
                  {VARIABLE_MAP[v].nombre}
                </button>
              ))}
            </div>
          </div>

          <div className="h-80 w-full rounded-xl border border-border bg-card p-4">
            {serie.length === 0 ? (
              <p className="grid h-full place-items-center text-sm text-muted-foreground">
                No hay lecturas en este intervalo de tiempo.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={serie}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="hora" tick={{ fontSize: 11 }} minTickGap={30} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    labelFormatter={(l) => `Hora: ${l}`}
                    formatter={(valor: number, nombre: string) => {
                      const def = VARIABLES.find((v) => v.nombre === nombre);
                      return [`${valor} ${def?.unidad ?? ""}`, nombre];
                    }}
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      borderColor: "var(--color-border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  {visibles.length === 1 && visibles[0] && (
                    <ReferenceArea
                      y1={setpoints[visibles[0]].min}
                      y2={setpoints[visibles[0]].max}
                      fill="var(--color-ok)"
                      fillOpacity={0.15}
                      label={{ value: "Rango Setpoint Normal", fontSize: 11, fill: "currentColor" }}
                    />
                  )}
                  {visibles.map((v) => (
                    <Line
                      key={v}
                      type="monotone"
                      dataKey={v}
                      name={VARIABLE_MAP[v].nombre}
                      stroke={VARIABLE_MAP[v].color}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            💡 En la vista unificada, selecciona una sola variable para ver sombreado su rango de consigna (setpoint).
          </p>
        </div>
      )}
    </section>
  );
}

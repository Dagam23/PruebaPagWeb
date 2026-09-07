import {
  Activity,
  Droplet,
  FlaskConical,
  Thermometer,
  TrendingDown,
  TrendingUp,
  Wind,
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_SETPOINTS, SetpointConfig, VARIABLES, type VariableId } from "@/lib/constants";
import { estadoVariable, type Lectura } from "@/services/telemetryService";

const ICONOS: Record<VariableId, typeof Thermometer> = {
  temperatura: Thermometer,
  ph: FlaskConical,
  oxigeno: Wind,
  amonio: Droplet,
  nitrito: Activity,
  nitrato: Activity,
};

const ETIQUETA_ESTADO = {
  normal: "Normal",
  advertencia: "Advertencia",
  critico: "Crítico",
  desconectado: "Desconectado",
} as const;

interface TarjetasVariablesProps {
  datos: Lectura[];
  setpoints?: SetpointConfig;
  onSelectVariable?: (v: VariableId) => void;
}

export function TarjetasVariables({
  datos,
  setpoints = DEFAULT_SETPOINTS,
  onSelectVariable,
}: TarjetasVariablesProps) {
  const ultima = datos[datos.length - 1];
  const anterior = datos[datos.length - 2];
  if (!ultima) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {VARIABLES.map((v) => {
        const Icono = ICONOS[v.id];
        const valor = ultima[v.id];
        const delta = anterior ? valor - anterior[v.id] : 0;
        const estado = estadoVariable(v.id, valor, setpoints);
        const sp = setpoints[v.id];
        const mini = datos.slice(-30).map((d) => ({ x: d.t, y: d[v.id] }));

        return (
          <article
            key={v.id}
            onClick={() => onSelectVariable?.(v.id)}
            className={`cursor-pointer rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-all hover:border-primary hover:shadow-sm`}
          >
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icono aria-hidden className="h-4 w-4" />
                </div>
                <h3 className="truncate text-sm font-semibold text-foreground">{v.nombre}</h3>
              </div>
              <Badge
                variant={
                  estado === "normal"
                    ? "secondary"
                    : estado === "advertencia"
                    ? "default"
                    : "destructive"
                }
              >
                {ETIQUETA_ESTADO[estado]}
              </Badge>
            </div>

            <p className="mt-3 font-display text-3xl font-bold text-foreground">
              {valor.toFixed(v.decimales)}
              <span className="ml-1 text-base font-medium text-muted-foreground">{v.unidad}</span>
            </p>

            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              {delta >= 0 ? (
                <TrendingUp aria-hidden className="h-3.5 w-3.5 text-primary" />
              ) : (
                <TrendingDown aria-hidden className="h-3.5 w-3.5 text-muted-foreground" />
              )}
              {delta >= 0 ? "+" : ""}
              {delta.toFixed(v.decimales)} {v.unidad} vs lectura anterior
            </p>

            <div className="mt-3 h-12 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mini}>
                  <Line
                    type="monotone"
                    dataKey="y"
                    stroke={v.color}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2 text-xs text-muted-foreground">
              <span>
                Objetivo: {sp.objetivo} {v.unidad}
              </span>
              <span>
                Rango: {sp.min} – {sp.max}
              </span>
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground/80">
              Actualizado: {new Date(ultima.t).toLocaleTimeString("es-CO")}
            </p>
          </article>
        );
      })}
    </div>
  );
}

import { PRESETS_ESPECIES, SetpointConfig, VARIABLES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Sliders, Sparkles } from "lucide-react";

interface PanelSetpointsProps {
  setpoints: SetpointConfig;
  onChangeSetpoints: (newSetpoints: SetpointConfig) => void;
  onReset: () => void;
}

export function PanelSetpoints({
  setpoints,
  onChangeSetpoints,
  onReset,
}: PanelSetpointsProps) {
  const aplicarPreset = (presetId: string) => {
    const p = PRESETS_ESPECIES.find((item) => item.id === presetId);
    if (p) {
      onChangeSetpoints(p.setpoints);
    }
  };

  const actualizarValor = (
    param: keyof SetpointConfig,
    campo: "min" | "max" | "objetivo",
    val: number
  ) => {
    onChangeSetpoints({
      ...setpoints,
      [param]: {
        ...setpoints[param],
        [campo]: val,
      },
    });
  };

  return (
    <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
      {/* Encabezado */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-foreground">
              Configuración de Puntos de Consigna (Setpoints)
            </h3>
            <p className="text-xs text-muted-foreground">
              Ajusta los rangos objetivo de la simulación. Los actuadores y alertas se calibrarán automáticamente.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Restablecer Valores FAO
        </Button>
      </div>

      {/* Presets rápidos por especie */}
      <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
            Perfiles Recomendados según Especie Simbiótica
          </h4>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-3">
          {PRESETS_ESPECIES.map((pr) => (
            <button
              key={pr.id}
              type="button"
              onClick={() => aplicarPreset(pr.id)}
              className="rounded-lg border border-border/60 bg-card p-3 text-left transition-all hover:border-primary hover:shadow-sm focus:outline-none"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-foreground">{pr.nombre}</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                {pr.descripcion}
              </p>
              <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>T: {pr.setpoints.temperatura.objetivo}°C</span>
                <span>pH: {pr.setpoints.ph.objetivo}</span>
                <span>OD: &gt;{pr.setpoints.oxigeno.min} mg/L</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sliders y Controles de Setpoints */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {VARIABLES.map((v) => {
          const sp = setpoints[v.id];
          if (!sp) return null;

          return (
            <div
              key={v.id}
              className="flex flex-col justify-between rounded-xl border border-border/60 bg-muted/20 p-4 transition-colors hover:border-border"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-foreground">{v.nombre}</span>
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    {v.unidad}
                  </Badge>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                  {v.descripcion}
                </p>

                {/* Valor Objetivo Actual */}
                <div className="mt-3 flex items-baseline justify-between border-y border-border/40 py-2">
                  <span className="text-xs text-muted-foreground">Punto Objetivo:</span>
                  <span className="font-display text-lg font-bold text-primary">
                    {sp.objetivo} {v.unidad}
                  </span>
                </div>

                {/* Controles de Rango Mínimo / Máximo */}
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Límite Mínimo Aceptable:</span>
                    <span className="font-semibold text-foreground">{sp.min} {v.unidad}</span>
                  </div>
                  <Slider
                    value={[sp.min]}
                    min={v.id === "nitrato" ? 0 : 0}
                    max={v.id === "nitrato" ? 100 : v.id === "temperatura" ? 30 : 10}
                    step={v.id === "nitrato" ? 5 : 0.1}
                    onValueChange={([val]) => actualizarValor(v.id, "min", val)}
                  />

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-muted-foreground">Límite Máximo Aceptable:</span>
                    <span className="font-semibold text-foreground">{sp.max} {v.unidad}</span>
                  </div>
                  <Slider
                    value={[sp.max]}
                    min={v.id === "nitrato" ? 30 : 5}
                    max={v.id === "nitrato" ? 150 : v.id === "temperatura" ? 35 : 14}
                    step={v.id === "nitrato" ? 5 : 0.1}
                    onValueChange={([val]) => actualizarValor(v.id, "max", val)}
                  />
                </div>
              </div>

              <div className="mt-3 text-[10px] text-muted-foreground/80">
                Rango calibrado: {sp.min} a {sp.max} {v.unidad}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

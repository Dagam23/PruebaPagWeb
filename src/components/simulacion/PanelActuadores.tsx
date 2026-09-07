import { useState } from "react";
import { Fish, Power, RefreshCw, Sun, Thermometer, Wind } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ActuadoresState } from "./DiagramaSistema";

interface PanelActuadoresProps {
  actuadores: ActuadoresState;
  onToggle: (key: keyof ActuadoresState) => void;
}

export function PanelActuadores({ actuadores, onToggle }: PanelActuadoresProps) {
  const [modoAutomatico, setModoAutomatico] = useState<Record<string, boolean>>({
    bomba: true,
    aireador: true,
    alimentador: false,
    luz: true,
    calentador: true,
  });

  const toggleModo = (key: string) => {
    setModoAutomatico((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const secciones = [
    {
      zona: "Zona 1: Tanque de Peces y Calidad de Agua",
      items: [
        {
          key: "aireador" as const,
          nombre: "Soplador / Aireador",
          desc: "Difusor de microburbujas sumergido para elevar OD",
          potencia: "18W · 12V DC",
          gpio: "Relé 1 (GPIO 26)",
          icono: Wind,
          activo: actuadores.aireador,
        },
        {
          key: "alimentador" as const,
          nombre: "Alimentador Automático",
          desc: "Dispensador de pellets temporizado con tolva",
          potencia: "5W · Servomotor",
          gpio: "PWM 1 (GPIO 18)",
          icono: Fish,
          activo: actuadores.alimentador,
        },
        {
          key: "calentador" as const,
          nombre: "Termostato / Calentador",
          desc: "Mantiene temperatura en setpoint durante la noche",
          potencia: "50W · 110V AC",
          gpio: "Relé 2 (GPIO 27)",
          icono: Thermometer,
          activo: actuadores.calentador ?? false,
        },
      ],
    },
    {
      zona: "Zona 2: Recirculación & Biofiltración",
      items: [
        {
          key: "bomba" as const,
          nombre: "Bomba Principal de Recirculación",
          desc: "Impulsión de agua biofiltrada hacia las camas",
          potencia: "25W · Caudal 1200 L/h",
          gpio: "Relé 3 (GPIO 14)",
          icono: RefreshCw,
          activo: actuadores.bomba,
        },
      ],
    },
    {
      zona: "Zona 3: Cama Hidropónica de Cultivo",
      items: [
        {
          key: "luz" as const,
          nombre: "Luminaria LED Fotosintética",
          desc: "Espectro completo PAR (400-700nm) para cultivo indoor",
          potencia: "45W · Fotoperiodo 14h",
          gpio: "Relé 4 (GPIO 15)",
          icono: Sun,
          activo: actuadores.luz,
        },
      ],
    },
  ];

  return (
    <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Power className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-foreground">
              Panel de Actuadores y Relés del Prototipo
            </h3>
            <p className="text-xs text-muted-foreground">
              Ubicación modular por zonas físicas del circuito con control automático o manual
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {Object.values(actuadores).filter(Boolean).length} Actuadores Encendidos
          </Badge>
        </div>
      </div>

      <div className="space-y-5">
        {secciones.map((sec) => (
          <div key={sec.zona} className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {sec.zona}
            </h4>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sec.items.map((act) => {
                const Icono = act.icono;
                const esAuto = modoAutomatico[act.key] ?? false;

                return (
                  <div
                    key={act.key}
                    className={`flex flex-col justify-between rounded-xl border p-4 transition-all ${
                      act.activo
                        ? "border-primary/50 bg-primary/5 shadow-xs"
                        : "border-border/60 bg-muted/20 opacity-80"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                              act.activo
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <Icono className="h-4 w-4" />
                          </div>
                          <span className="text-xs font-bold text-foreground line-clamp-1">
                            {act.nombre}
                          </span>
                        </div>
                        <Switch
                          checked={act.activo}
                          onCheckedChange={() => onToggle(act.key)}
                          aria-label={`Encender o apagar ${act.nombre}`}
                        />
                      </div>

                      <p className="text-[11px] text-muted-foreground line-clamp-2 mb-2">
                        {act.desc}
                      </p>
                    </div>

                    <div className="mt-2 border-t border-border/40 pt-2 text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Potencia: {act.potencia}</span>
                        <span className="font-mono text-[10px]">{act.gpio}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-muted-foreground">Modo control:</span>
                        <button
                          type="button"
                          onClick={() => toggleModo(act.key)}
                          className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
                            esAuto
                              ? "bg-primary/15 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {esAuto ? "Automático (PID/Setpoint)" : "Manual Forzado"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

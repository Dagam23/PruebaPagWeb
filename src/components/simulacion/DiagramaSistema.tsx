import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AVISO_INSTRUMENTACION,
  DEFAULT_SETPOINTS,
  SetpointConfig,
  VARIABLE_MAP,
  type VariableId,
} from "@/lib/constants";
import { estadoVariable, type Lectura } from "@/services/telemetryService";
import { Sliders } from "lucide-react";

interface Punto {
  id: VariableId | "nivel";
  x: number;
  y: number;
  etiqueta: string;
  nombreCorto: string;
  ubicacion: string;
  descripcion: string;
}

const PUNTOS: Punto[] = [
  {
    id: "temperatura",
    x: 95,
    y: 250,
    etiqueta: "T",
    nombreCorto: "Temperatura",
    ubicacion: "Interior del tanque de peces (sonda sumergible DS18B20)",
    descripcion: "Supervisa la temperatura del agua vital para la tasa metabólica de los peces.",
  },
  {
    id: "ph",
    x: 145,
    y: 280,
    etiqueta: "pH",
    nombreCorto: "Sensor pH",
    ubicacion: "Salida del tanque hacia el filtro mecánico",
    descripcion: "Electrodo de vidrio para acidez/alcalinidad antes del tratamiento biológico.",
  },
  {
    id: "oxigeno",
    x: 55,
    y: 215,
    etiqueta: "OD",
    nombreCorto: "Oxígeno Disuelto",
    ubicacion: "Zona de difusores de aireación del estanque",
    descripcion: "Sonda galvánica de oxígeno disuelto para prevenir asfixia de peces y bacterias.",
  },
  {
    id: "amonio",
    x: 275,
    y: 205,
    etiqueta: "NH₄",
    nombreCorto: "Sensor Amonio",
    ubicacion: "Entrada del sedimentador / filtro mecánico",
    descripcion: "Mide amonio ionizado residual generado por la excreción de peces.",
  },
  {
    id: "nitrito",
    x: 390,
    y: 205,
    etiqueta: "NO₂",
    nombreCorto: "Sensor Nitrito",
    ubicacion: "Interior de la cámara del biofiltro nitrificante",
    descripcion: "Indica el progreso de la conversión biológica de amonio a nitrato.",
  },
  {
    id: "nitrato",
    x: 520,
    y: 115,
    etiqueta: "NO₃",
    nombreCorto: "Sensor Nitrato",
    ubicacion: "Línea de impulsión hacia la cama hidropónica",
    descripcion: "Verifica la biodisponibilidad de macronutrientes para las plantas.",
  },
  {
    id: "nivel",
    x: 185,
    y: 185,
    etiqueta: "N/Q",
    nombreCorto: "Nivel y Caudal",
    ubicacion: "Tanque principal y línea de retorno",
    descripcion: "Sensor ultrasónico de nivel de agua y sensor de flujo por efecto Hall.",
  },
];

export interface ActuadoresState {
  bomba: boolean;
  aireador: boolean;
  alimentador: boolean;
  luz: boolean;
  calentador?: boolean;
}

interface DiagramaSistemaProps {
  lectura: Lectura;
  setpoints?: SetpointConfig;
  actuadores?: ActuadoresState;
  onToggleActuador?: (key: keyof ActuadoresState) => void;
  onOpenSetpoints?: () => void;
}

export function DiagramaSistema({
  lectura,
  setpoints = DEFAULT_SETPOINTS,
  actuadores = { bomba: true, aireador: true, alimentador: false, luz: true, calentador: false },
  onToggleActuador,
  onOpenSetpoints,
}: DiagramaSistemaProps) {
  const [activo, setActivo] = useState<Punto | null>(null);

  const valor = (p: Punto) => (p.id === "nivel" ? null : lectura[p.id]);
  const def = (p: Punto) => (p.id === "nivel" ? null : VARIABLE_MAP[p.id]);

  const colorSensor = (p: Punto) => {
    if (p.id === "nivel") return "var(--color-aqua)";
    const e = estadoVariable(p.id, lectura[p.id], setpoints);
    return e === "critico"
      ? "var(--color-destructive)"
      : e === "advertencia"
      ? "var(--color-warn)"
      : "var(--color-ok)";
  };

  return (
    <div className="rounded-xl border border-border/70 bg-card p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
        <div>
          <h3 className="font-display text-base font-semibold text-foreground">
            Gemelo Digital: Prototipo Acuapónico & Ubicación de Sensores/Actuadores
          </h3>
          <p className="text-xs text-muted-foreground">
            Haz clic en los sensores circulares (T, pH, OD, etc.) o actuadores para inspeccionar su estado
          </p>
        </div>
        {onOpenSetpoints && (
          <Button
            size="sm"
            variant="outline"
            onClick={onOpenSetpoints}
            className="flex items-center gap-1.5 text-xs"
          >
            <Sliders className="h-3.5 w-3.5 text-primary" />
            Configurar Setpoints
          </Button>
        )}
      </div>

      <div className="relative w-full">
        <svg
          viewBox="0 0 740 350"
          className="h-auto w-full select-none"
          role="img"
          aria-label="Diagrama del prototipo acuapónico con ubicación de sensores y actuadores"
        >
          <defs>
            <marker
              id="flecha-sis"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L6,3 L0,6 z" fill="var(--color-aqua)" />
            </marker>

            {/* Filtros de brillo para actuadores activos */}
            <filter id="glow-actuador" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ========================================================
              ESTRUCTURA PRINCIPAL: TANQUE DE PECES
             ======================================================== */}
          <rect
            x="20"
            y="170"
            width="180"
            height="130"
            rx="10"
            fill="var(--color-aqua)"
            opacity="0.14"
          />
          <rect
            x="20"
            y="170"
            width="180"
            height="130"
            rx="10"
            fill="none"
            stroke="var(--color-aqua)"
            strokeWidth="2"
          />
          <text
            x="110"
            y="194"
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            fill="currentColor"
          >
            Tanque de peces
          </text>
          <text x="110" y="275" textAnchor="middle" fontSize="22">
            🐟
          </text>

          {/* ========================================================
              ACTUADORES EN SUS UBICACIONES FÍSICAS PRECISAS
             ======================================================== */}

          {/* 1. ALIMENTADOR AUTOMÁTICO: Ubicado sobre el tanque de peces */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => onToggleActuador?.("alimentador")}
            role="button"
            tabIndex={0}
            aria-label="Alternar alimentador automático"
          >
            <rect
              x="85"
              y="120"
              width="65"
              height="26"
              rx="5"
              fill={actuadores.alimentador ? "var(--color-warn)" : "var(--color-background)"}
              stroke="var(--color-warn)"
              strokeWidth="2"
              filter={actuadores.alimentador ? "url(#glow-actuador)" : undefined}
            />
            <text
              x="117"
              y="137"
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill={actuadores.alimentador ? "#000" : "currentColor"}
            >
              Alimentador
            </text>
            {/* Tolva hacia el tanque */}
            <polygon points="110,146 125,146 120,158 115,158" fill="var(--color-warn)" />
            {actuadores.alimentador && (
              <text x="117" y="168" textAnchor="middle" fontSize="10" fill="var(--color-warn)">
                •••
              </text>
            )}
          </g>

          {/* 2. AIREADOR / SOPLADOR: Bomba en x=40,y=120 con manguera y difusor sumergido */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => onToggleActuador?.("aireador")}
            role="button"
            tabIndex={0}
            aria-label="Alternar aireador"
          >
            <circle
              cx="45"
              cy="133"
              r="16"
              fill={actuadores.aireador ? "var(--color-chart-3)" : "var(--color-background)"}
              stroke="var(--color-chart-3)"
              strokeWidth="2"
              filter={actuadores.aireador ? "url(#glow-actuador)" : undefined}
            />
            <text
              x="45"
              y="137"
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill={actuadores.aireador ? "#fff" : "currentColor"}
            >
              Air
            </text>
            <text x="45" y="112" textAnchor="middle" fontSize="10" fontWeight="600" fill="currentColor">
              Aireador
            </text>
            {/* Manguera de aire que baja al fondo del tanque */}
            <path
              d="M45 149 L45 270 L60 270"
              fill="none"
              stroke="var(--color-chart-3)"
              strokeWidth="2"
              strokeDasharray="3 2"
            />
            {/* Piedra difusora */}
            <rect x="55" y="266" width="18" height="8" rx="3" fill="var(--color-chart-3)" />
            {actuadores.aireador && (
              <>
                <circle cx="60" cy="255" r="2.5" fill="var(--color-chart-3)" opacity="0.8" />
                <circle cx="66" cy="245" r="2" fill="var(--color-chart-3)" opacity="0.6" />
                <circle cx="62" cy="235" r="3" fill="var(--color-chart-3)" opacity="0.5" />
              </>
            )}
          </g>

          {/* 3. CALENTADOR / TERMOSTATO: Sumergido en el lateral del tanque */}
          <g
            className="cursor-pointer"
            onClick={() => onToggleActuador?.("calentador")}
            role="button"
            tabIndex={0}
            aria-label="Alternar calentador"
          >
            <rect
              x="165"
              y="220"
              width="10"
              height="60"
              rx="4"
              fill={actuadores.calentador ? "var(--color-destructive)" : "var(--color-border)"}
              stroke="currentColor"
              strokeWidth="1"
            />
            <text x="170" y="212" textAnchor="middle" fontSize="9" fill="currentColor">
              Clima
            </text>
          </g>

          {/* FILTRO MECÁNICO */}
          <rect
            x="230"
            y="200"
            width="90"
            height="75"
            rx="8"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="2"
          />
          <text x="275" y="234" textAnchor="middle" fontSize="11" fontWeight="600" fill="currentColor">
            Filtro
          </text>
          <text x="275" y="250" textAnchor="middle" fontSize="11" fill="currentColor">
            mecánico
          </text>
          <line x1="235" y1="262" x2="315" y2="262" stroke="var(--color-border)" strokeDasharray="3 2" />

          {/* BIOFILTRO */}
          <rect
            x="345"
            y="200"
            width="95"
            height="75"
            rx="8"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="2"
          />
          <text x="392" y="234" textAnchor="middle" fontSize="11" fontWeight="600" fill="currentColor">
            Biofiltro
          </text>
          <text x="392" y="250" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.8">
            Nitrificación
          </text>

          {/* 4. BOMBA DE IMPULSIÓN (Sumidero / Cámara de bombeo) */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => onToggleActuador?.("bomba")}
            role="button"
            tabIndex={0}
            aria-label="Alternar bomba principal"
          >
            <circle
              cx="495"
              cy="235"
              r="28"
              fill={actuadores.bomba ? "var(--color-primary)" : "var(--color-background)"}
              stroke="var(--color-primary)"
              strokeWidth="2.5"
              filter={actuadores.bomba ? "url(#glow-actuador)" : undefined}
            />
            <text
              x="495"
              y="232"
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill={actuadores.bomba ? "#fff" : "currentColor"}
            >
              Bomba
            </text>
            <text
              x="495"
              y="247"
              textAnchor="middle"
              fontSize="9"
              fill={actuadores.bomba ? "#fff" : "currentColor"}
              opacity={actuadores.bomba ? 0.9 : 0.6}
            >
              {actuadores.bomba ? "Activa" : "Parada"}
            </text>
          </g>

          {/* ========================================================
              CAMA DE CULTIVO HIDROPÓNICO
             ======================================================== */}
          <rect
            x="330"
            y="55"
            width="370"
            height="85"
            rx="10"
            fill="var(--color-primary)"
            opacity="0.12"
          />
          <rect
            x="330"
            y="55"
            width="370"
            height="85"
            rx="10"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="2"
          />
          <text
            x="515"
            y="76"
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            fill="currentColor"
          >
            Cama de cultivo hidropónico
          </text>
          <text x="515" y="116" textAnchor="middle" fontSize="18">
            🌿 🌿 🌿 🌿 🌿
          </text>

          {/* 5. LUMINARIA LED / ILUMINACIÓN: Reubicada directamente sobre la cama de cultivo */}
          <g
            className="cursor-pointer transition-transform hover:scale-102"
            onClick={() => onToggleActuador?.("luz")}
            role="button"
            tabIndex={0}
            aria-label="Alternar iluminación hortícola LED"
          >
            <rect
              x="360"
              y="18"
              width="310"
              height="22"
              rx="6"
              fill={actuadores.luz ? "var(--color-warn)" : "var(--color-background)"}
              stroke="var(--color-warn)"
              strokeWidth="2"
              filter={actuadores.luz ? "url(#glow-actuador)" : undefined}
            />
            <text
              x="515"
              y="33"
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill={actuadores.luz ? "#000" : "currentColor"}
            >
              💡 Luminaria LED Fotosintética ({actuadores.luz ? "ENCENDIDA" : "APAGADA"})
            </text>
            {actuadores.luz && (
              <>
                <line x1="410" y1="40" x2="400" y2="54" stroke="var(--color-warn)" strokeWidth="1.5" opacity="0.6" />
                <line x1="460" y1="40" x2="455" y2="54" stroke="var(--color-warn)" strokeWidth="1.5" opacity="0.6" />
                <line x1="515" y1="40" x2="515" y2="54" stroke="var(--color-warn)" strokeWidth="1.5" opacity="0.6" />
                <line x1="570" y1="40" x2="575" y2="54" stroke="var(--color-warn)" strokeWidth="1.5" opacity="0.6" />
                <line x1="620" y1="40" x2="630" y2="54" stroke="var(--color-warn)" strokeWidth="1.5" opacity="0.6" />
              </>
            )}
          </g>

          {/* ========================================================
              TUBERÍAS Y LÍNEAS DE FLUJO
             ======================================================== */}
          {/* Tanque -> Filtro */}
          <path d="M200 235 L228 235" stroke="var(--color-aqua)" strokeWidth="3" markerEnd="url(#flecha-sis)" />
          {/* Filtro -> Biofiltro */}
          <path d="M320 235 L343 235" stroke="var(--color-aqua)" strokeWidth="3" markerEnd="url(#flecha-sis)" />
          {/* Biofiltro -> Bomba */}
          <path d="M440 235 L465 235" stroke="var(--color-aqua)" strokeWidth="3" markerEnd="url(#flecha-sis)" />
          {/* Bomba -> Cultivo (Impulsión) */}
          <path
            d="M523 235 L640 235 L640 145"
            fill="none"
            stroke="var(--color-aqua)"
            strokeWidth="3"
            markerEnd="url(#flecha-sis)"
          />
          {/* Cultivo -> Tanque (Retorno por gravedad) */}
          <path
            d="M330 95 L250 95 L250 165 L110 165"
            fill="none"
            stroke="var(--color-aqua)"
            strokeWidth="3"
            strokeDasharray="7 5"
            markerEnd="url(#flecha-sis)"
          />

          {/* ========================================================
              SENSORES INTERACTIVOS (PUNTOS CON ESTADO Y CLICK)
             ======================================================== */}
          {PUNTOS.map((p) => {
            const val = valor(p);
            const unidad = def(p)?.unidad ?? "";
            const color = colorSensor(p);

            return (
              <g
                key={p.id}
                role="button"
                tabIndex={0}
                aria-label={`Ver información del sensor ${p.nombreCorto}`}
                className="cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                onClick={() => setActivo(p)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActivo(p);
                  }
                }}
              >
                {/* Aura de pulso */}
                <circle cx={p.x} cy={p.y} r="18" fill={color} opacity="0.3" />
                <circle cx={p.x} cy={p.y} r="14" fill={color} />
                <circle cx={p.x} cy={p.y} r="14" fill="none" stroke="#ffffff" strokeWidth="1.5" />
                <text
                  x={p.x}
                  y={p.y + 4}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="800"
                  fill="#ffffff"
                >
                  {p.etiqueta}
                </text>
                {/* Etiqueta de valor flotante */}
                {val !== null && (
                  <text
                    x={p.x}
                    y={p.y + 24}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="600"
                    fill="currentColor"
                    className="bg-card/80 px-1"
                  >
                    {val} {unidad}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground border-t border-border/40 pt-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-ok)]" /> Normal / Óptimo
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-warn)]" /> Advertencia
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-destructive)]" /> Crítico
          </span>
        </div>
        <p className="italic text-[11px]">{AVISO_INSTRUMENTACION}.</p>
      </div>

      {/* Modal de Detalle e Inspección del Sensor */}
      <Dialog open={!!activo} onOpenChange={(o) => !o && setActivo(null)}>
        <DialogContent className="sm:max-w-md">
          {activo && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between pr-4">
                  <DialogTitle className="flex items-center gap-2">
                    <span
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: colorSensor(activo) }}
                    >
                      {activo.etiqueta}
                    </span>
                    {def(activo)?.nombre ?? "Punto de Medición"}
                  </DialogTitle>
                  <Badge
                    variant={
                      activo.id === "nivel"
                        ? "outline"
                        : estadoVariable(activo.id, lectura[activo.id], setpoints) === "normal"
                        ? "secondary"
                        : estadoVariable(activo.id, lectura[activo.id], setpoints) === "advertencia"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {activo.id === "nivel"
                      ? "Provisional"
                      : estadoVariable(activo.id, lectura[activo.id], setpoints).toUpperCase()}
                  </Badge>
                </div>
                <DialogDescription className="pt-2">{activo.descripcion}</DialogDescription>
              </DialogHeader>

              <div className="mt-2 grid grid-cols-2 gap-3 rounded-lg bg-muted/50 p-3 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground block">Última lectura</span>
                  <span className="font-display text-xl font-bold text-foreground">
                    {valor(activo) !== null
                      ? `${valor(activo)} ${def(activo)?.unidad ?? ""}`
                      : "En calibración"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Punto Consigna (Setpoint)</span>
                  <span className="font-display text-lg font-semibold text-primary">
                    {activo.id !== "nivel"
                      ? `${setpoints[activo.id].objetivo} ${def(activo)?.unidad ?? ""}`
                      : "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Rango Recomendado</span>
                  <span className="text-xs font-medium text-foreground">
                    {activo.id !== "nivel"
                      ? `${setpoints[activo.id].min} – ${setpoints[activo.id].max} ${def(activo)?.unidad ?? ""}`
                      : "80 – 100 %"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Timestamp</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(lectura.t).toLocaleTimeString("es-CO")}
                  </span>
                </div>
              </div>

              <div className="rounded-md border border-border/70 p-2.5 text-xs">
                <span className="font-semibold text-foreground">Ubicación Física: </span>
                <span className="text-muted-foreground">{activo.ubicacion}</span>
              </div>

              {onOpenSetpoints && activo.id !== "nivel" && (
                <div className="flex justify-end pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setActivo(null);
                      onOpenSetpoints();
                    }}
                    className="flex items-center gap-1 text-xs"
                  >
                    <Sliders className="h-3.5 w-3.5 text-primary" /> Modificar Setpoint de este parámetro
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

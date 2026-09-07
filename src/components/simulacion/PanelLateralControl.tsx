import { useState, useEffect } from "react";
import {
  Power,
  Sliders,
  FileText,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  RotateCcw,
  Wind,
  RefreshCw,
  Sun,
  Fish,
  Thermometer,
  CheckCircle2,
  AlertCircle,
  Tag,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_SETPOINTS,
  PRESETS_ESPECIES,
  SetpointConfig,
  VARIABLES,
  VariableId,
} from "@/lib/constants";
import { ActuadoresState } from "./DiagramaSistema";

export interface NotaSetpoint {
  id: string;
  timestamp: number;
  variable: VariableId | "general";
  valorObjetivo?: number;
  unidad?: string;
  texto: string;
}

const NOTAS_STORAGE_KEY = "cemos_aquaponics_setpoint_notes";

const NOTAS_INICIALES: NotaSetpoint[] = [
  {
    id: "note-1",
    timestamp: Date.now() - 1000 * 60 * 45, // 45 mins ago
    variable: "temperatura",
    valorObjetivo: 25.0,
    unidad: "°C",
    texto: "Ajuste de temperatura a 25°C para estabilización de alevines de Tilapia.",
  },
  {
    id: "note-2",
    timestamp: Date.now() - 1000 * 60 * 120, // 2 hours ago
    variable: "oxigeno",
    valorObjetivo: 6.5,
    unidad: "mg/L",
    texto: "Aireador activado al 100% tras alimentación de la mañana.",
  },
];

interface PanelLateralControlProps {
  actuadores: ActuadoresState;
  onToggleActuador: (key: keyof ActuadoresState) => void;
  setpoints: SetpointConfig;
  onChangeSetpoints: (newSetpoints: SetpointConfig) => void;
  onResetSetpoints: () => void;
  onSelectVariableNote?: (varId: VariableId) => void;
}

export function PanelLateralControl({
  actuadores,
  onToggleActuador,
  setpoints,
  onChangeSetpoints,
  onResetSetpoints,
}: PanelLateralControlProps) {
  const [subTab, setSubTab] = useState<"actuadores" | "setpoints" | "notas">("actuadores");

  // Notas state con persistencia en localStorage
  const [notas, setNotas] = useState<NotaSetpoint[]>(() => {
    try {
      const guardadas = localStorage.getItem(NOTAS_STORAGE_KEY);
      if (guardadas) return JSON.parse(guardadas);
    } catch {
      // Fallback si error de parseo
    }
    return NOTAS_INICIALES;
  });

  // Formulario de nueva nota
  const [varSeleccionada, setVarSeleccionada] = useState<VariableId | "general">("temperatura");
  const [textoNota, setTextoNota] = useState("");
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(NOTAS_STORAGE_KEY, JSON.stringify(notas));
    } catch {
      // Silenciar error de cuota si aplica
    }
  }, [notas]);

  const handleAgregarNota = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!textoNota.trim()) return;

    const nuevaNota: NotaSetpoint = {
      id: "note-" + Date.now(),
      timestamp: Date.now(),
      variable: varSeleccionada,
      valorObjetivo:
        varSeleccionada !== "general" ? setpoints[varSeleccionada]?.objetivo : undefined,
      unidad:
        varSeleccionada !== "general"
          ? VARIABLES.find((v) => v.id === varSeleccionada)?.unidad
          : undefined,
      texto: textoNota.trim(),
    };

    setNotas((prev) => [nuevaNota, ...prev]);
    setTextoNota("");
    setGuardadoExitoso(true);
    setTimeout(() => setGuardadoExitoso(false), 2500);
  };

  const handleEliminarNota = (id: string) => {
    setNotas((prev) => prev.filter((n) => n.id !== id));
  };

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

  // Definición compacta de actuadores con agrupación
  const listaActuadores = [
    {
      key: "bomba" as const,
      nombre: "Bomba Recirculación",
      desc: "Caudal 1200 L/h hacia camas",
      potencia: "25W · 12V",
      icono: RefreshCw,
      activo: actuadores.bomba,
      color: "text-blue-500",
    },
    {
      key: "aireador" as const,
      nombre: "Soplador Oxígeno",
      desc: "Difusión de microburbujas en tanque",
      potencia: "18W · 12V",
      icono: Wind,
      activo: actuadores.aireador,
      color: "text-cyan-500",
    },
    {
      key: "calentador" as const,
      nombre: "Termostato Calentador",
      desc: "Mantiene temperatura del agua",
      potencia: "50W · 110V",
      icono: Thermometer,
      activo: actuadores.calentador ?? false,
      color: "text-red-500",
    },
    {
      key: "alimentador" as const,
      nombre: "Alimentador Auto",
      desc: "Tolva de pellets temporizada",
      potencia: "5W · Servo",
      icono: Fish,
      activo: actuadores.alimentador,
      color: "text-amber-500",
    },
    {
      key: "luz" as const,
      nombre: "Clarificador UV / Luz",
      desc: "Esterilización germicida",
      potencia: "15W · UV-C",
      icono: Sun,
      activo: actuadores.luz,
      color: "text-emerald-500",
    },
  ];

  return (
    <aside className="glass-card flex flex-col h-full rounded-2xl border border-border/80 shadow-md overflow-hidden">
      {/* Cabecera del Panel Lateral */}
      <div className="p-4 border-b border-border/60 bg-muted/40 flex items-center justify-between">
        <div>
          <h2 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Control & Consignas
          </h2>
          <p className="text-[11px] text-muted-foreground">Acceso rápido sin desplazamiento</p>
        </div>

        <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
          Lateral Dock
        </Badge>
      </div>

      {/* Sub-Pestañas de Navegación Lateral */}
      <div className="p-2 border-b border-border/60 bg-muted/20">
        <div className="grid grid-cols-3 gap-1 bg-muted/70 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setSubTab("actuadores")}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
              subTab === "actuadores"
                ? "bg-card text-foreground shadow-sm font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Power className="h-3.5 w-3.5 text-primary" />
            <span>Actuadores</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab("setpoints")}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
              subTab === "setpoints"
                ? "bg-card text-foreground shadow-sm font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sliders className="h-3.5 w-3.5 text-primary" />
            <span>Setpoints</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab("notas")}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all relative ${
              subTab === "notas"
                ? "bg-card text-foreground shadow-sm font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-primary" />
            <span>Notas</span>
            {notas.length > 0 && (
              <span className="ml-0.5 px-1 py-0.2 rounded-full text-[9px] bg-primary/20 text-primary font-bold">
                {notas.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Contenedor con Scroll Interno Exclusivo (Zero-Scroll para la página) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[750px]">
        {/* ========================================================
            SUB-PESTAÑA 1: ACTUADORES EN VIVO
           ======================================================== */}
        {subTab === "actuadores" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground pb-1">
              <span>Conmutación en tiempo real</span>
              <span className="text-[10px]">
                {listaActuadores.filter((a) => a.activo).length} de {listaActuadores.length} activos
              </span>
            </div>

            {listaActuadores.map((act) => {
              const Icono = act.icono;
              return (
                <div
                  key={act.key}
                  className={`p-3.5 rounded-xl border transition-all ${
                    act.activo
                      ? "border-primary/50 bg-primary/5 shadow-sm"
                      : "border-border/60 bg-card/60 opacity-80"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                          act.activo
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icono className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-xs text-foreground">{act.nombre}</h4>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              act.activo
                                ? "bg-primary/20 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {act.activo ? "ON" : "OFF"}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">{act.desc}</p>
                        <p className="text-[10px] text-muted-foreground/80 font-mono mt-0.5">
                          {act.potencia}
                        </p>
                      </div>
                    </div>

                    <Switch
                      checked={act.activo}
                      onCheckedChange={() => onToggleActuador(act.key)}
                      aria-label={act.nombre}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================
            SUB-PESTAÑA 2: SETPOINTS & PUNTOS DE CONSIGNA
           ======================================================== */}
        {subTab === "setpoints" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">Presets FAO Recomendados</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetSetpoints}
                className="h-7 text-[10px] text-muted-foreground hover:text-foreground px-2"
              >
                <RotateCcw className="h-3 w-3 mr-1" /> Reset
              </Button>
            </div>

            {/* Presets rápidos */}
            <div className="grid grid-cols-1 gap-1.5">
              {PRESETS_ESPECIES.map((pr) => (
                <button
                  key={pr.id}
                  type="button"
                  onClick={() => aplicarPreset(pr.id)}
                  className="rounded-lg border border-border/60 bg-muted/30 p-2 text-left transition-all hover:border-primary/60 hover:bg-card text-xs flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-foreground text-[11px]">{pr.nombre}</p>
                    <p className="text-[10px] text-muted-foreground">
                      T: {pr.setpoints.temperatura.objetivo}°C · pH: {pr.setpoints.ph.objetivo} · OD: &gt;{pr.setpoints.oxigeno.min}
                    </p>
                  </div>
                  <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 ml-1" />
                </button>
              ))}
            </div>

            {/* Lista compacta de Sliders de Setpoints */}
            <div className="space-y-3 pt-2 border-t border-border/50">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Calibración Manual</span>
                <span className="text-[10px]">Rangos y Objetivos</span>
              </div>

              {VARIABLES.map((v) => {
                const sp = setpoints[v.id];
                if (!sp) return null;

                return (
                  <div
                    key={v.id}
                    className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">{v.nombre}</span>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="secondary" className="font-mono text-[10px] py-0 px-1.5">
                          Obj: {sp.objetivo} {v.unidad}
                        </Badge>
                        <button
                          type="button"
                          title="Crear nota para este setpoint"
                          onClick={() => {
                            setVarSeleccionada(v.id);
                            setSubTab("notas");
                          }}
                          className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-muted"
                        >
                          <FileText className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>Límite Mínimo:</span>
                        <span className="font-semibold text-foreground font-mono">{sp.min} {v.unidad}</span>
                      </div>
                      <Slider
                        value={[sp.min]}
                        min={v.id === "nitrato" ? 0 : 0}
                        max={v.id === "nitrato" ? 80 : v.id === "temperatura" ? 28 : 9}
                        step={v.id === "nitrato" ? 5 : 0.1}
                        onValueChange={([val]) => actualizarValor(v.id, "min", val)}
                      />

                      <div className="flex justify-between text-[10px] text-muted-foreground pt-1">
                        <span>Límite Máximo:</span>
                        <span className="font-semibold text-foreground font-mono">{sp.max} {v.unidad}</span>
                      </div>
                      <Slider
                        value={[sp.max]}
                        min={v.id === "nitrato" ? 20 : 5}
                        max={v.id === "nitrato" ? 150 : v.id === "temperatura" ? 35 : 14}
                        step={v.id === "nitrato" ? 5 : 0.1}
                        onValueChange={([val]) => actualizarValor(v.id, "max", val)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            SUB-PESTAÑA 3: BITÁCORA Y NOTAS DE SETPOINTS
           ======================================================== */}
        {subTab === "notas" && (
          <div className="space-y-4">
            <div className="border-b border-border/50 pb-2">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-primary" />
                Bitácora de Observaciones & Setpoints
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Registra cambios de consignas y eventos biológicos u operativos.
              </p>
            </div>

            {/* Formulario de registro de nueva nota */}
            <form onSubmit={handleAgregarNota} className="rounded-xl border border-primary/30 bg-primary/5 p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-foreground">Nueva Anotación</span>
                {varSeleccionada !== "general" && (
                  <Badge variant="outline" className="text-[9px] font-mono border-primary/40 text-primary">
                    Consigna: {setpoints[varSeleccionada]?.objetivo}{" "}
                    {VARIABLES.find((v) => v.id === varSeleccionada)?.unidad}
                  </Badge>
                )}
              </div>

              {/* Selector de variable */}
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground">Variable o ámbito:</label>
                <select
                  value={varSeleccionada}
                  onChange={(e) => setVarSeleccionada(e.target.value as VariableId | "general")}
                  className="w-full bg-card rounded-lg px-2.5 py-1.5 text-xs text-foreground border border-border outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="general">📋 General / Sistema Integral</option>
                  <option value="temperatura">🌡️ Temperatura del Agua</option>
                  <option value="ph">💧 pH del Agua</option>
                  <option value="oxigeno">💨 Oxígeno Disuelto (OD)</option>
                  <option value="amonio">🐟 Amonio Total (NH₃)</option>
                  <option value="nitrito">🧪 Nitrito (NO₂)</option>
                  <option value="nitrato">🌱 Nitrato (NO₃)</option>
                </select>
              </div>

              {/* Input de texto de la observación */}
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground">Observación / Motivo:</label>
                <textarea
                  rows={2}
                  value={textoNota}
                  onChange={(e) => setTextoNota(e.target.value)}
                  placeholder="Ej: Calibración de sensor, ajuste por noche fría, dosificación..."
                  className="w-full bg-card rounded-lg p-2 text-xs text-foreground border border-border outline-none focus:ring-1 focus:ring-primary resize-none placeholder:text-muted-foreground/60"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                {guardadoExitoso ? (
                  <span className="text-[10px] font-semibold text-primary flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Registrado en bitácora
                  </span>
                ) : (
                  <span className="text-[10px] text-muted-foreground">Guardado local activo</span>
                )}
                <Button
                  type="submit"
                  size="sm"
                  disabled={!textoNota.trim()}
                  className="h-7 px-3 text-xs gradient-nature border-0 text-primary-foreground font-semibold flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> Guardar
                </Button>
              </div>
            </form>

            {/* Listado cronológico de notas guardadas */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Historial Registrado ({notas.length})</span>
                {notas.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setNotas([])}
                    className="text-[10px] text-destructive hover:underline"
                  >
                    Vaciar historial
                  </button>
                )}
              </div>

              {notas.length === 0 ? (
                <div className="text-center py-6 px-3 rounded-xl border border-dashed border-border/80 text-muted-foreground text-xs">
                  <Clock className="h-6 w-6 mx-auto mb-1.5 opacity-40" />
                  <p>Sin observaciones aún.</p>
                  <p className="text-[10px]">Registra cualquier calibración para trazabilidad.</p>
                </div>
              ) : (
                notas.map((nota) => {
                  const fecha = new Date(nota.timestamp);
                  const horaStr = fecha.toLocaleTimeString("es-CO", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const fechaStr = fecha.toLocaleDateString("es-CO", {
                    day: "numeric",
                    month: "short",
                  });

                  return (
                    <div
                      key={nota.id}
                      className="p-2.5 rounded-xl border border-border/70 bg-card/70 space-y-1.5 text-xs hover:border-border transition-colors group"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge
                            variant="outline"
                            className="text-[9px] py-0 px-1.5 capitalize font-semibold border-primary/40 text-primary bg-primary/5"
                          >
                            <Tag className="h-2.5 w-2.5 mr-0.5" />
                            {nota.variable}
                          </Badge>
                          {nota.valorObjetivo !== undefined && (
                            <span className="text-[10px] font-mono font-bold text-foreground">
                              {nota.valorObjetivo} {nota.unidad}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-muted-foreground">
                            {fechaStr} · {horaStr}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleEliminarNota(nota.id)}
                            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity p-0.5 rounded"
                            title="Eliminar nota"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      <p className="text-foreground/90 text-[11px] leading-relaxed break-words">
                        {nota.texto}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

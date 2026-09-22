import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Thermometer,
  Droplets,
  Wind,
  Fish,
  Sun,
  Zap,
  Gauge,
  Waves,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Radio,
  Cpu,
  LineChart as ChartIcon,
  Table as TableIcon,
} from "lucide-react";
import Layout from "@/components/Layout";

// Componentes integrados de la estación de monitoreo
import { DiagramaSistema, ActuadoresState } from "@/components/simulacion/DiagramaSistema";
import { PanelLateralControl } from "@/components/simulacion/PanelLateralControl";
import { GraficasDia } from "@/components/simulacion/GraficasDia";
import { TablaLecturas } from "@/components/simulacion/TablaLecturas";

// Servicios y constantes
import { DEFAULT_SETPOINTS, SetpointConfig } from "@/lib/constants";
import { telemetryService, type Lectura } from "@/services/telemetryService";

interface TelemetryData {
  temperatura: number;
  ph: number;
  oxigeno: number;
  nivelAgua: number;
  conductividad: number;
  turbidez: number;
  flujoBomba: number;
  amonio: number;
}

const Monitoreo = () => {
  // 1. Estado de Puntos de Consigna (Setpoints)
  const [setpoints, setSetpoints] = useState<SetpointConfig>(DEFAULT_SETPOINTS);

  // 2. Estado de Actuadores (conmutables desde el lateral o desde el diagrama)
  const [actuadores, setActuadores] = useState<ActuadoresState>({
    bomba: true,
    aireador: true,
    alimentador: false,
    luz: true,
    calentador: false,
  });

  const handleToggleActuador = (key: keyof ActuadoresState) => {
    setActuadores((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 3. Telemetría y flujo dinámico en tiempo real
  const [datos, setDatos] = useState<Lectura[]>(() =>
    telemetryService.generarLecturasHistoricas(24, 6, DEFAULT_SETPOINTS)
  );
  const [isSimRunning, setIsSimRunning] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [selectedModule, setSelectedModule] = useState<string>("todos");
  const [vistaCentral, setVistaCentral] = useState<"sensores" | "graficas" | "csv">("sensores");

  // Loop de simulación IoT cada 3.5 segundos con reactividad biológica y física
  useEffect(() => {
    if (!isSimRunning) return;

    const interval = setInterval(() => {
      setDatos((prev) => {
        const ultima = prev[prev.length - 1];
        if (!ultima) return prev;
        const nueva = telemetryService.generarSiguienteLectura(ultima, setpoints, actuadores);
        return [...prev.slice(-179), nueva];
      });

      const now = new Date();
      setLastUpdated(now.toLocaleTimeString("es-CO"));
    }, 3500);

    return () => clearInterval(interval);
  }, [isSimRunning, setpoints, actuadores]);

  // Lectura actual instantánea calculada a partir del flujo de telemetría
  const lecturaActual = useMemo(() => {
    return (
      datos[datos.length - 1] ?? {
        t: Date.now(),
        temperatura: setpoints.temperatura.objetivo,
        ph: setpoints.ph.objetivo,
        oxigeno: setpoints.oxigeno.objetivo,
        amonio: setpoints.amonio.objetivo,
        nitrito: setpoints.nitrito.objetivo,
        nitrato: setpoints.nitrato.objetivo,
      }
    );
  }, [datos, setpoints]);

  // Datos normalizados para la matriz de 8 sensores IoT de Monitoreo
  const sensorData: TelemetryData = useMemo(() => {
    const flujoEstimado = actuadores.bomba ? +(18.5 + (Math.random() * 1.5 - 0.7)).toFixed(1) : 0;
    const turbidezEstimada = actuadores.bomba ? +(3.8 + (Math.random() * 0.8)).toFixed(1) : 6.5;
    const nivelEstimado = actuadores.bomba ? 92 : 85;
    const ecEstimada = Math.round(1150 + lecturaActual.nitrato * 4.5);

    return {
      temperatura: +lecturaActual.temperatura.toFixed(1),
      ph: +lecturaActual.ph.toFixed(1),
      oxigeno: +lecturaActual.oxigeno.toFixed(1),
      nivelAgua: nivelEstimado,
      conductividad: ecEstimada,
      turbidez: turbidezEstimada,
      flujoBomba: flujoEstimado,
      amonio: +lecturaActual.amonio.toFixed(2),
    };
  }, [lecturaActual, actuadores.bomba]);

  const handleRegenerateData = () => {
    setDatos(telemetryService.generarLecturasHistoricas(24, 6, setpoints));
  };

  const getStatus = (val: number, min: number, max: number): "ok" | "warn" | "danger" => {
    if (val >= min && val <= max) return "ok";
    if (val >= min * 0.85 && val <= max * 1.15) return "warn";
    return "danger";
  };

  // Matriz de sensores IoT con sus umbrales óptimos
  const sensors = [
    {
      id: "temp",
      module: "tanque",
      icon: <Thermometer className="h-6 w-6" />,
      label: "Temperatura Tanque",
      value: sensorData.temperatura,
      unit: "°C",
      range: `${setpoints.temperatura.min} - ${setpoints.temperatura.max} °C`,
      status: getStatus(sensorData.temperatura, setpoints.temperatura.min, setpoints.temperatura.max),
    },
    {
      id: "ph",
      module: "agua",
      icon: <Droplets className="h-6 w-6" />,
      label: "pH del Agua",
      value: sensorData.ph,
      unit: "",
      range: `${setpoints.ph.min} - ${setpoints.ph.max}`,
      status: getStatus(sensorData.ph, setpoints.ph.min, setpoints.ph.max),
    },
    {
      id: "oxigeno",
      module: "tanque",
      icon: <Wind className="h-6 w-6" />,
      label: "Oxígeno Disuelto",
      value: sensorData.oxigeno,
      unit: "mg/L",
      range: `> ${setpoints.oxigeno.min} mg/L`,
      status: getStatus(sensorData.oxigeno, setpoints.oxigeno.min, setpoints.oxigeno.max),
    },
    {
      id: "nivel",
      module: "agua",
      icon: <Gauge className="h-6 w-6" />,
      label: "Nivel de Agua",
      value: sensorData.nivelAgua,
      unit: "%",
      range: "80 - 100 %",
      status: getStatus(sensorData.nivelAgua, 80, 100),
    },
    {
      id: "ec",
      module: "hidroponia",
      icon: <Zap className="h-6 w-6" />,
      label: "Conductividad (EC)",
      value: sensorData.conductividad,
      unit: "µS/cm",
      range: "1000 - 1500",
      status: getStatus(sensorData.conductividad, 1000, 1500),
    },
    {
      id: "turbidez",
      module: "agua",
      icon: <Waves className="h-6 w-6" />,
      label: "Turbidez del Agua",
      value: sensorData.turbidez,
      unit: "NTU",
      range: "< 10 NTU",
      status: getStatus(sensorData.turbidez, 0, 8),
    },
    {
      id: "flujo",
      module: "hidroponia",
      icon: <Activity className="h-6 w-6" />,
      label: "Flujo de Recirculación",
      value: sensorData.flujoBomba,
      unit: "L/min",
      range: "15 - 22 L/min",
      status: actuadores.bomba ? getStatus(sensorData.flujoBomba, 15, 22) : "danger",
    },
    {
      id: "amonio",
      module: "tanque",
      icon: <Fish className="h-6 w-6" />,
      label: "Amonio Total (NH₃)",
      value: sensorData.amonio,
      unit: "ppm",
      range: `< ${setpoints.amonio.max} ppm`,
      status: getStatus(sensorData.amonio, 0, setpoints.amonio.max),
    },
  ];

  const filteredSensors =
    selectedModule === "todos"
      ? sensors
      : sensors.filter((s) => s.module === selectedModule);

  return (
    <Layout>
      <div className="container py-10 md:py-14">
        {/* Cabecera Principal */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
            <Radio className="h-4 w-4 animate-pulse text-primary" /> Estación Telemetría IoT & Gemelo Digital — Semillero CEMOS UIS
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Monitoreo en Tiempo Real
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
            Supervisa en vivo el diagrama de flujo del tanque, analiza los sensores IoT de cada subsistema y opera actuadores y consignas desde el dock lateral con bitácora técnica.
          </p>
        </motion.div>

        {/* Barra de Estado IoT */}
        <div className="glass-card p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <div>
              <p className="text-xs font-medium text-foreground">
                Estado del Sistema: <span className="text-primary font-bold">ONLINE</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Última actualización: {lastUpdated || "Actualizando..."}
              </p>
            </div>
          </div>

          {/* Filtros de Módulo de Sensores */}
          <div className="flex items-center gap-1 bg-muted p-1 rounded-lg text-xs">
            {[
              { id: "todos", label: "Todos los Módulos" },
              { id: "tanque", label: "Tanque Peces" },
              { id: "hidroponia", label: "Camas Cultivo" },
              { id: "agua", label: "Calidad Agua" },
            ].map((mod) => (
              <button
                key={mod.id}
                type="button"
                onClick={() => setSelectedModule(mod.id)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  selectedModule === mod.id
                    ? "bg-card text-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {mod.label}
              </button>
            ))}
          </div>
        </div>

        {/* =========================================================================
            LAYOUT PRINCIPAL: ÁREA CENTRAL DE PROCESO + PANEL LATERAL ZERO-SCROLL
           ========================================================================= */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* COLUMNA PRINCIPAL: GEMELO DIGITAL, SENSORES Y TELEMETRÍA (8 de 12 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* AÑADIDO PRINCIPAL: DIAGRAMA INTERACTIVO DEL TANQUE (GEMELO DIGITAL 2D) */}
            <motion.section
              className="space-y-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-primary" />
                  <h2 className="font-display font-bold text-lg text-foreground">
                    Diagrama del Sistema & Gemelo Digital
                  </h2>
                </div>
                <span className="text-[11px] text-muted-foreground hidden sm:inline-block">
                  Sincronizado con actuadores y sensores en tiempo real
                </span>
              </div>

              <DiagramaSistema
                lectura={lecturaActual}
                setpoints={setpoints}
                actuadores={actuadores}
                onToggleActuador={handleToggleActuador}
                onOpenSetpoints={() => {
                  // Acceso directo a calibración de consignas
                }}
              />
            </motion.section>

            {/* BARRA DE SUB-PESTAÑAS DE MONITOREO CENTRAL */}
            <div className="flex items-center justify-between border-b border-border/60 pb-2 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setVistaCentral("sensores")}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    vistaCentral === "sensores"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Activity className="h-4 w-4" />
                  <span>Matriz de Sensores ({filteredSensors.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVistaCentral("graficas")}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    vistaCentral === "graficas"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <ChartIcon className="h-4 w-4" />
                  <span>Telemetría Temporal (24h)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVistaCentral("csv")}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    vistaCentral === "csv"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <TableIcon className="h-4 w-4" />
                  <span>Registro CSV</span>
                </button>
              </div>

              <span className="text-[11px] text-muted-foreground hidden md:inline-block">
                Ciclo: 3.5s
              </span>
            </div>

            {/* VISTA 1: MATRIZ DE SENSORES EN TIEMPO REAL (COMPONENTES ORIGINALES DE MONITOREO) */}
            {vistaCentral === "sensores" && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredSensors.map((s) => (
                  <motion.div
                    key={s.id}
                    className="glass-card p-4 flex flex-col justify-between"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                          s.status === "ok"
                            ? "bg-primary/10 text-primary"
                            : s.status === "warn"
                            ? "bg-accent/20 text-accent-foreground"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {s.icon}
                      </div>
                      <span
                        className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-full tracking-wider ${
                          s.status === "ok"
                            ? "bg-primary/15 text-primary"
                            : s.status === "warn"
                            ? "bg-accent/20 text-accent-foreground"
                            : "bg-destructive/15 text-destructive"
                        }`}
                      >
                        {s.status === "ok" ? "Óptimo" : s.status === "warn" ? "Alerta" : "Crítico"}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-1 line-clamp-1">{s.label}</p>
                      <div className="flex items-baseline gap-1 mb-1.5">
                        <span className="font-display font-bold text-2xl text-foreground">
                          {s.value}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">
                          {s.unit}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground/70">Ideal: {s.range}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* VISTA 2: GRÁFICAS DE TELEMETRÍA (CONSOLIDADA DE SIMULACIÓN A MONITOREO) */}
            {vistaCentral === "graficas" && (
              <div className="space-y-6">
                <GraficasDia
                  datos={datos}
                  setpoints={setpoints}
                  isSimRunning={isSimRunning}
                  onToggleSim={() => setIsSimRunning((r) => !r)}
                  onRegenerateData={handleRegenerateData}
                />
              </div>
            )}

            {/* VISTA 3: REGISTRO HISTÓRICO Y TABLA CSV */}
            {vistaCentral === "csv" && (
              <div className="space-y-6">
                <TablaLecturas datos={datos} setpoints={setpoints} />
              </div>
            )}

            {/* RESUMEN DE SALUD Y DIAGNÓSTICO (COMPONENTES ORIGINALES DE MONITOREO) */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="glass-card p-5 flex items-start gap-3.5">
                <CheckCircle2 className="h-7 w-7 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-semibold text-sm text-foreground mb-1">
                    Diagnóstico Automático
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Todos los parámetros del ciclo del nitrógeno (Amonio, Nitritos y Nitratos) se encuentran dentro del umbral ideal para Tilapia Roja y Lechuga Hidropónica.
                  </p>
                </div>
              </div>

              <div className="glass-card p-5 flex items-start gap-3.5">
                <AlertTriangle className="h-7 w-7 text-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-semibold text-sm text-foreground mb-1">
                    Mantenimiento Sugerido
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Próxima limpieza de sedimentadores y cambio parcial del 5% del volumen de agua programada en 48 horas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              COLUMNA LATERAL: DOCK DE ACTUADORES, SETPOINTS Y BITÁCORA DE NOTAS (4 cols)
              Acceso rápido sin necesidad de desplazamiento vertical (Zero-Scroll)
             ========================================================================= */}
          <div className="lg:col-span-4 lg:sticky lg:top-20">
            <PanelLateralControl
              actuadores={actuadores}
              onToggleActuador={handleToggleActuador}
              setpoints={setpoints}
              onChangeSetpoints={setSetpoints}
              onResetSetpoints={() => setSetpoints(DEFAULT_SETPOINTS)}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Monitoreo;

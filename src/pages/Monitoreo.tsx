import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Thermometer,
  Droplets,
  Wind,
  Fish,
  Leaf,
  Sun,
  Zap,
  Gauge,
  Waves,
  RefreshCw,
  Power,
  AlertTriangle,
  CheckCircle2,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

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

interface ActuatorState {
  bombaPrincipal: boolean;
  oxigenador: boolean;
  alimentadorAuto: boolean;
  luzUV: boolean;
}

const Monitoreo = () => {
  // Telemetry real-time simulation state
  const [data, setData] = useState<TelemetryData>({
    temperatura: 24.8,
    ph: 7.1,
    oxigeno: 6.8,
    nivelAgua: 92,
    conductividad: 1250,
    turbidez: 4.2,
    flujoBomba: 18.5,
    amonio: 0.15,
  });

  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [selectedModule, setSelectedModule] = useState<string>("todos");

  // Actuators state
  const [actuators, setActuators] = useState<ActuatorState>({
    bombaPrincipal: true,
    oxigenador: true,
    alimentadorAuto: false,
    luzUV: true,
  });

  // Simulated live IoT data updates
  useEffect(() => {
    const updateData = () => {
      setData({
        temperatura: +(24 + Math.random() * 2.5).toFixed(1),
        ph: +(6.8 + Math.random() * 0.8).toFixed(1),
        oxigeno: +(6.2 + Math.random() * 1.5).toFixed(1),
        nivelAgua: Math.min(100, Math.max(80, +(90 + (Math.random() * 10 - 5)).toFixed(0))),
        conductividad: +(1200 + Math.random() * 100).toFixed(0),
        turbidez: +(3.5 + Math.random() * 1.5).toFixed(1),
        flujoBomba: +(17.5 + Math.random() * 2).toFixed(1),
        amonio: +(0.1 + Math.random() * 0.2).toFixed(2),
      });
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString("es-CO"));
    };

    updateData();
    const interval = setInterval(updateData, 4000);
    return () => clearInterval(interval);
  }, []);

  const toggleActuator = (key: keyof ActuatorState) => {
    setActuators((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getStatus = (val: number, min: number, max: number): "ok" | "warn" | "danger" => {
    if (val >= min && val <= max) return "ok";
    if (val >= min * 0.85 && val <= max * 1.15) return "warn";
    return "danger";
  };

  const sensors = [
    {
      id: "temp",
      module: "tanque",
      icon: <Thermometer className="h-6 w-6" />,
      label: "Temperatura Tanque",
      value: data.temperatura,
      unit: "°C",
      range: "22 - 28 °C",
      status: getStatus(data.temperatura, 22, 28),
    },
    {
      id: "ph",
      module: "agua",
      icon: <Droplets className="h-6 w-6" />,
      label: "pH del Agua",
      value: data.ph,
      unit: "",
      range: "6.5 - 7.5",
      status: getStatus(data.ph, 6.5, 7.5),
    },
    {
      id: "oxigeno",
      module: "tanque",
      icon: <Wind className="h-6 w-6" />,
      label: "Oxígeno Disuelto",
      value: data.oxigeno,
      unit: "mg/L",
      range: "5.0 - 8.0 mg/L",
      status: getStatus(data.oxigeno, 5, 8),
    },
    {
      id: "nivel",
      module: "agua",
      icon: <Gauge className="h-6 w-6" />,
      label: "Nivel de Agua",
      value: data.nivelAgua,
      unit: "%",
      range: "80 - 100 %",
      status: getStatus(data.nivelAgua, 80, 100),
    },
    {
      id: "ec",
      module: "hidroponia",
      icon: <Zap className="h-6 w-6" />,
      label: "Conductividad (EC)",
      value: data.conductividad,
      unit: "µS/cm",
      range: "1000 - 1500",
      status: getStatus(data.conductividad, 1000, 1500),
    },
    {
      id: "turbidez",
      module: "agua",
      icon: <Waves className="h-6 w-6" />,
      label: "Turbidez del Agua",
      value: data.turbidez,
      unit: "NTU",
      range: "< 10 NTU",
      status: getStatus(data.turbidez, 0, 8),
    },
    {
      id: "flujo",
      module: "hidroponia",
      icon: <Activity className="h-6 w-6" />,
      label: "Flujo de Recirculación",
      value: data.flujoBomba,
      unit: "L/min",
      range: "15 - 22 L/min",
      status: getStatus(data.flujoBomba, 15, 22),
    },
    {
      id: "amonio",
      module: "tanque",
      icon: <Fish className="h-6 w-6" />,
      label: "Amonio Total (NH₃)",
      value: data.amonio,
      unit: "ppm",
      range: "< 0.5 ppm",
      status: getStatus(data.amonio, 0, 0.4),
    },
  ];

  const filteredSensors =
    selectedModule === "todos"
      ? sensors
      : sensors.filter((s) => s.module === selectedModule);

  return (
    <Layout>
      <div className="container py-16">
        {/* Header section */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
            <Radio className="h-4 w-4 animate-pulse text-primary" /> Estación Telemetría IoT — Semillero CEMOS UIS
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">
            Monitoreo en Tiempo Real
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
            Supervisa los datos de los sensores IoT del sistema acuapónico y controla los actuadores del prototipo.
          </p>
        </motion.div>

        {/* Live Status Bar */}
        <div className="glass-card p-4 mb-8 flex flex-wrap items-center justify-between gap-4 max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <div>
              <p className="text-xs font-medium text-foreground">Estado del Sistema: <span className="text-primary font-bold">ONLINE</span></p>
              <p className="text-xs text-muted-foreground">Última actualización: {lastUpdated || "Cargando..."}</p>
            </div>
          </div>

          {/* Module Filter buttons */}
          <div className="flex items-center gap-1 bg-muted p-1 rounded-lg text-xs">
            {[
              { id: "todos", label: "Todos" },
              { id: "tanque", label: "Tanque Peces" },
              { id: "hidroponia", label: "Camas Cultivo" },
              { id: "agua", label: "Calidad Agua" },
            ].map((mod) => (
              <button
                key={mod.id}
                onClick={() => setSelectedModule(mod.id)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  selectedModule === mod.id
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {mod.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Sensors */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12">
          {filteredSensors.map((s) => (
            <motion.div
              key={s.id}
              className="glass-card p-5 flex flex-col justify-between"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`h-11 w-11 rounded-xl flex items-center justify-center ${
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
                  className={`px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full ${
                    s.status === "ok"
                      ? "bg-primary/10 text-primary"
                      : s.status === "warn"
                      ? "bg-accent/20 text-accent-foreground"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {s.status === "ok" ? "Óptimo" : s.status === "warn" ? "Alerta" : "Crítico"}
                </span>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="font-display font-bold text-2xl text-foreground">
                    {s.value}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {s.unit}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground/70">Rango ideal: {s.range}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Actuators & Control Panel */}
        <motion.div
          className="glass-card p-8 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Power className="h-6 w-6 text-primary" />
            <div>
              <h2 className="font-display font-bold text-xl text-foreground">Panel de Control de Actuadores</h2>
              <p className="text-xs text-muted-foreground">Simula la activación o apagado remoto de los relés del sistema IoT</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                key: "bombaPrincipal" as const,
                label: "Bomba Principal",
                desc: "Recirculación de agua 24W",
                icon: <RefreshCw className="h-5 w-5" />,
              },
              {
                key: "oxigenador" as const,
                label: "Soplador Oxígeno",
                desc: "Aireador estanque de peces",
                icon: <Wind className="h-5 w-5" />,
              },
              {
                key: "alimentadorAuto" as const,
                label: "Alimentador Auto",
                desc: "Dispensador temporizado",
                icon: <Fish className="h-5 w-5" />,
              },
              {
                key: "luzUV" as const,
                label: "Clarificador UV",
                desc: "Lámpara germicida agua",
                icon: <Sun className="h-5 w-5" />,
              },
            ].map((act) => {
              const active = actuators[act.key];
              return (
                <div
                  key={act.key}
                  className={`p-4 rounded-xl border transition-all ${
                    active
                      ? "border-primary/50 bg-primary/5 shadow-sm"
                      : "border-border bg-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {act.icon}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        active
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {active ? "ENCENDIDO" : "APAGADO"}
                    </span>
                  </div>

                  <h3 className="font-display font-semibold text-sm text-foreground mb-1">
                    {act.label}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">{act.desc}</p>

                  <Button
                    size="sm"
                    variant={active ? "outline" : "default"}
                    className={`w-full text-xs font-semibold ${
                      !active ? "gradient-nature border-0 text-primary-foreground" : ""
                    }`}
                    onClick={() => toggleActuator(act.key)}
                  >
                    {active ? "Desactivar" : "Activar"}
                  </Button>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* System Health Summary */}
        <div className="mt-8 max-w-5xl mx-auto grid sm:grid-cols-2 gap-4">
          <div className="glass-card p-6 flex items-start gap-4">
            <CheckCircle2 className="h-8 w-8 text-primary shrink-0 mt-1" />
            <div>
              <h4 className="font-display font-semibold text-foreground mb-1">Diagnóstico Automático</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Todos los parámetros del ciclo del nitrógeno (Amonio, Nitritos y Nitratos) se encuentran dentro del umbral ideal para Tilapia Roja y Lechuga Hidropónica.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 flex items-start gap-4">
            <AlertTriangle className="h-8 w-8 text-accent shrink-0 mt-1" />
            <div>
              <h4 className="font-display font-semibold text-foreground mb-1">Mantenimiento Sugerido</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Próxima limpieza de sedimentadores y cambio parcial del 5% del volumen de agua programada en 48 horas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Monitoreo;

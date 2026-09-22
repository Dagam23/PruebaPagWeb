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
  temperaturaAmbiente: number;
  humedadAmbiente: number;
  temperaturaAgua: number;
  phAgua: number;
  odis: number;
}

const Monitoreo = () => {
  // 1. Estado de Puntos de Consigna (Setpoints)
  const [setpoints, setSetpoints] = useState<SetpointConfig>(DEFAULT_SETPOINTS);

  // 2. Estado de Actuadores (conmutables desde el lateral o desde el diagrama)
  const [actuadores, setActuadores] = useState<ActuadoresState>({
    bomba: true,
    aireador: true,
    luz: true,
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
    return {
      temperaturaAmbiente: +(24 + Math.random() * 2).toFixed(1),
      humedadAmbiente: +(65 + Math.random() * 5).toFixed(1),
      temperaturaAgua: +lecturaActual.temperatura.toFixed(1),
      phAgua: +lecturaActual.ph.toFixed(1),
      odis: +lecturaActual.oxigeno.toFixed(1),
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
      id: "tempAmbiente",
      module: "ambiente",
      icon: <Thermometer className="h-6 w-6" />,
      label: "Temperatura ambiental",
      value: sensorData.temperaturaAmbiente,
      unit: "°C",
      range: "20 - 30 °C",
      status: getStatus(sensorData.temperaturaAmbiente, 20, 30),
    },
    {
      id: "humedadAmbiente",
      module: "ambiente",
      icon: <Wind className="h-6 w-6" />,
      label: "Humedad Ambiental",
      value: sensorData.humedadAmbiente,
      unit: "%",
      range: "50 - 80 %",
      status: getStatus(sensorData.humedadAmbiente, 50, 80),
    },
    {
      id: "tempAgua",
      module: "tanque",
      icon: <Thermometer className="h-6 w-6" />,
      label: "Temperatura Agua",
      value: sensorData.temperaturaAgua,
      unit: "°C",
      range: `${setpoints.temperatura.min} - ${setpoints.temperatura.max} °C`,
      status: getStatus(sensorData.temperaturaAgua, setpoints.temperatura.min, setpoints.temperatura.max),
    },
    {
      id: "phAgua",
      module: "agua",
      icon: <Droplets className="h-6 w-6" />,
      label: "PH Agua",
      value: sensorData.phAgua,
      unit: "",
      range: `${setpoints.ph.min} - ${setpoints.ph.max}`,
      status: getStatus(sensorData.phAgua, setpoints.ph.min, setpoints.ph.max),
    },
    {
      id: "odisH2o",
      module: "tanque",
      icon: <Wind className="h-6 w-6" />,
      label: "ODis H20",
      value: sensorData.odis,
      unit: "mg/L",
      range: `> ${setpoints.oxigeno.min} mg/L`,
      status: getStatus(sensorData.odis, setpoints.oxigeno.min, setpoints.oxigeno.max),
    }
  ];



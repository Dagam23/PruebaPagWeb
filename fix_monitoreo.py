import re

with open('src/pages/Monitoreo.tsx.orig', 'r') as f:
    content = f.read()

# 1. Update TelemetryData interface
content = content.replace(
"""interface TelemetryData {
  temperatura: number;
  ph: number;
  oxigeno: number;
  nivelAgua: number;
  conductividad: number;
  turbidez: number;
  flujoBomba: number;
  amonio: number;
}""", 
"""interface TelemetryData {
  temperaturaAmbiente: number;
  humedadAmbiente: number;
  temperaturaAgua: number;
  phAgua: number;
  odis: number;
}""")

# 2. Update sensorData useMemo
sensor_data_str = """  const sensorData: TelemetryData = useMemo(() => {
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
  }, [lecturaActual, actuadores.bomba]);"""

new_sensor_data_str = """  const sensorData: TelemetryData = useMemo(() => {
    return {
      temperaturaAmbiente: +(24 + Math.random() * 2).toFixed(1),
      humedadAmbiente: +(65 + Math.random() * 5).toFixed(1),
      temperaturaAgua: +lecturaActual.temperatura.toFixed(1),
      phAgua: +lecturaActual.ph.toFixed(1),
      odis: +lecturaActual.oxigeno.toFixed(1),
    };
  }, [lecturaActual, actuadores.bomba]);"""

content = content.replace(sensor_data_str, new_sensor_data_str)

# 3. Replace sensors array
idx_start = content.find("  const sensors = [")
idx_end = content.find("  const filteredSensors =")

new_sensors_str = """  const sensors = [
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

"""

if idx_start != -1 and idx_end != -1:
    content = content[:idx_start] + new_sensors_str + content[idx_end:]
else:
    print(f"Error finding indices: {idx_start}, {idx_end}")

# 4. Actuadores removal from default state and types
content = content.replace("""const [actuadores, setActuadores] = useState<ActuadoresState>({
    bomba: true,
    aireador: true,
    alimentador: false,
    luz: true,
    calentador: false,
  });""", """const [actuadores, setActuadores] = useState<ActuadoresState>({
    bomba: true,
    aireador: true,
    luz: true,
  });""")

with open('src/pages/Monitoreo.tsx', 'w') as f:
    f.write(content)

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator, Thermometer, Droplets, Wind, Activity, Fish, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

// Simulation calculator
interface SimParams {
  espacio: number;
  peces: number;
  plantas: number;
  agua: number;
}

function calcRequirements(p: SimParams) {
  return {
    tanqueLitros: Math.max(p.peces * 40, p.agua),
    camasM2: Math.ceil(p.plantas / 12),
    bombaW: Math.ceil(p.agua * 0.05 + 10),
    alimentoKgMes: +(p.peces * 0.15).toFixed(1),
    cosechaKgMes: +(p.plantas * 0.3).toFixed(1),
    aguaDiaria: +(p.agua * 0.02).toFixed(1),
    energiaMes: +((p.agua * 0.05 + 10) * 24 * 30 / 1000).toFixed(1),
  };
}

// Simulated real-time data
function useRealtimeData() {
  const [data, setData] = useState({
    temperatura: 24.5,
    ph: 7.0,
    oxigeno: 6.5,
    amonio: 0.25,
    nitrito: 0.1,
    nitrato: 40,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData({
        temperatura: +(24 + Math.random() * 3).toFixed(1),
        ph: +(6.5 + Math.random() * 1.5).toFixed(1),
        oxigeno: +(5.5 + Math.random() * 2).toFixed(1),
        amonio: +(Math.random() * 0.5).toFixed(2),
        nitrito: +(Math.random() * 0.3).toFixed(2),
        nitrato: +(20 + Math.random() * 40).toFixed(0),
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return data;
}

const MetricCard = ({ icon, label, value, unit, status }: { icon: React.ReactNode; label: string; value: number; unit: string; status: "ok" | "warn" | "danger" }) => (
  <div className="glass-card p-4 flex items-center gap-4">
    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
      status === "ok" ? "bg-primary/10 text-primary" : status === "warn" ? "bg-accent/20 text-accent-foreground" : "bg-destructive/10 text-destructive"
    }`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-display font-bold text-xl text-foreground">{value} <span className="text-sm font-normal text-muted-foreground">{unit}</span></p>
    </div>
    <div className={`ml-auto h-3 w-3 rounded-full ${
      status === "ok" ? "bg-primary" : status === "warn" ? "bg-accent" : "bg-destructive"
    } animate-pulse`} />
  </div>
);

const Simulacion = () => {
  const [params, setParams] = useState<SimParams>({ espacio: 10, peces: 20, plantas: 50, agua: 500 });
  const [results, setResults] = useState<ReturnType<typeof calcRequirements> | null>(null);
  const realtime = useRealtimeData();

  const handleCalc = () => setResults(calcRequirements(params));

  const getStatus = (val: number, min: number, max: number): "ok" | "warn" | "danger" => {
    if (val >= min && val <= max) return "ok";
    if (val >= min * 0.8 && val <= max * 1.2) return "warn";
    return "danger";
  };

  return (
    <Layout>
      <div className="container py-16">
        <motion.div className="text-center mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Simulación y Métricas</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Calcula los requerimientos de tu sistema y monitorea parámetros en tiempo real.</p>
        </motion.div>

        {/* Calculator */}
        <motion.div className="glass-card p-8 max-w-3xl mx-auto mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="h-6 w-6 text-primary" />
            <h2 className="font-display font-bold text-xl text-foreground">Calculadora de Requerimientos</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {([
              { key: "espacio", label: "Espacio disponible (m²)", min: 1, max: 500 },
              { key: "peces", label: "Cantidad de peces", min: 1, max: 500 },
              { key: "plantas", label: "Cantidad de plantas", min: 1, max: 1000 },
              { key: "agua", label: "Volumen de agua (L)", min: 50, max: 10000 },
            ] as const).map((field) => (
              <div key={field.key}>
                <label className="text-sm font-medium text-foreground mb-1 block">{field.label}</label>
                <input
                  type="number"
                  min={field.min}
                  max={field.max}
                  value={params[field.key]}
                  onChange={(e) => setParams((p) => ({ ...p, [field.key]: Number(e.target.value) || 0 }))}
                  className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring text-foreground"
                />
              </div>
            ))}
          </div>

          <Button onClick={handleCalc} className="gradient-nature border-0 text-primary-foreground w-full font-semibold">
            Calcular Requerimientos
          </Button>

          {results && (
            <motion.div className="mt-6 grid sm:grid-cols-2 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {([
                { label: "Tanque necesario", value: `${results.tanqueLitros} L` },
                { label: "Camas de cultivo", value: `${results.camasM2} m²` },
                { label: "Potencia bomba", value: `${results.bombaW} W` },
                { label: "Alimento/mes", value: `${results.alimentoKgMes} kg` },
                { label: "Cosecha estimada/mes", value: `${results.cosechaKgMes} kg` },
                { label: "Reposición agua/día", value: `${results.aguaDiaria} L` },
                { label: "Consumo energético/mes", value: `${results.energiaMes} kWh` },
              ]).map((r) => (
                <div key={r.label} className="bg-muted rounded-lg p-4">
                  <p className="text-xs text-muted-foreground">{r.label}</p>
                  <p className="font-display font-bold text-lg text-foreground">{r.value}</p>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Real-time Metrics */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6 justify-center">
            <Activity className="h-6 w-6 text-secondary" />
            <h2 className="font-display font-bold text-xl text-foreground">Monitoreo en Tiempo Real</h2>
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          </div>
          <p className="text-center text-muted-foreground text-sm mb-8">Datos simulados de un sistema acuapónico activo</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <MetricCard icon={<Thermometer className="h-6 w-6" />} label="Temperatura" value={realtime.temperatura} unit="°C" status={getStatus(realtime.temperatura, 22, 28)} />
            <MetricCard icon={<Droplets className="h-6 w-6" />} label="pH del Agua" value={realtime.ph} unit="" status={getStatus(realtime.ph, 6.5, 7.5)} />
            <MetricCard icon={<Wind className="h-6 w-6" />} label="Oxígeno Disuelto" value={realtime.oxigeno} unit="mg/L" status={getStatus(realtime.oxigeno, 5, 8)} />
            <MetricCard icon={<Activity className="h-6 w-6" />} label="Amonio (NH₃)" value={realtime.amonio} unit="ppm" status={getStatus(realtime.amonio, 0, 0.5)} />
            <MetricCard icon={<Fish className="h-6 w-6" />} label="Nitrito (NO₂)" value={realtime.nitrito} unit="ppm" status={getStatus(realtime.nitrito, 0, 0.25)} />
            <MetricCard icon={<Leaf className="h-6 w-6" />} label="Nitrato (NO₃)" value={Number(realtime.nitrato)} unit="ppm" status={getStatus(Number(realtime.nitrato), 10, 80)} />
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Simulacion;

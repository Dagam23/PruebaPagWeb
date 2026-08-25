import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator } from "lucide-react";
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

const Simulacion = () => {
  const [params, setParams] = useState<SimParams>({ espacio: 10, peces: 20, plantas: 50, agua: 500 });
  const [results, setResults] = useState<ReturnType<typeof calcRequirements> | null>(null);

  const handleCalc = () => setResults(calcRequirements(params));

  return (
    <Layout>
      <div className="container py-16">
        <motion.div className="text-center mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Simulación y Dimensionamiento</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Calcula los requerimientos físicos, energéticos y nutricionales ideales para tu prototipo acuapónico.</p>
        </motion.div>

        {/* Calculator */}
        <motion.div className="glass-card p-8 max-w-3xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
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
            <motion.div className="mt-8 pt-6 border-t border-border grid sm:grid-cols-2 gap-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {([
                { label: "Tanque necesario", value: `${results.tanqueLitros} L` },
                { label: "Camas de cultivo", value: `${results.camasM2} m²` },
                { label: "Potencia bomba", value: `${results.bombaW} W` },
                { label: "Alimento/mes", value: `${results.alimentoKgMes} kg` },
                { label: "Cosecha estimada/mes", value: `${results.cosechaKgMes} kg` },
                { label: "Reposición agua/día", value: `${results.aguaDiaria} L` },
                { label: "Consumo energético/mes", value: `${results.energiaMes} kWh` },
              ]).map((r) => (
                <div key={r.label} className="bg-muted/60 rounded-xl p-4 border border-border/40">
                  <p className="text-xs text-muted-foreground mb-1">{r.label}</p>
                  <p className="font-display font-bold text-lg text-foreground">{r.value}</p>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Simulacion;

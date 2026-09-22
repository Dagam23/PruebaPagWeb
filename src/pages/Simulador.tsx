import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Printer, RotateCcw, TriangleAlert } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Layout from "@/components/Layout";
import { BocetoSistema } from "@/components/simulacion/BocetoSistema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AVISO_SIMULADOR,
  ENTRADA_POR_DEFECTO,
  OBJETIVOS,
  TIPOS_CULTIVO,
  TIPOS_PEZ,
  calcularSimulacion,
  type EntradaSimulacion,
} from "@/lib/simulacion";

const NUMERICOS: { id: keyof EntradaSimulacion; label: string; unidad: string; paso?: number }[] = [
  { id: "espacioM2", label: "Espacio disponible", unidad: "m²", paso: 0.5 },
  { id: "volumenTanqueDisponibleL", label: "Volumen disponible del tanque", unidad: "L", paso: 10 },
  { id: "volumenAguaL", label: "Volumen de agua", unidad: "L", paso: 10 },
  { id: "cantidadPeces", label: "Cantidad de peces", unidad: "unidades", paso: 1 },
  { id: "pesoPromedioG", label: "Peso promedio por pez", unidad: "g", paso: 10 },
  { id: "cantidadPlantas", label: "Cantidad de plantas", unidad: "unidades", paso: 1 },
  { id: "temperaturaAmbienteC", label: "Temperatura ambiente", unidad: "°C", paso: 0.5 },
  { id: "horasIluminacion", label: "Horas de iluminación", unidad: "h/día", paso: 1 },
];

const Dato = ({ label, valor }: { label: string; valor: string }) => (
  <div className="bg-muted rounded-lg p-4">
    <dt className="text-xs text-muted-foreground">{label}</dt>
    <dd className="font-display font-bold text-lg text-foreground">{valor}</dd>
  </div>
);

const Simulador = () => {
  const [entrada, setEntrada] = useState<EntradaSimulacion>(ENTRADA_POR_DEFECTO);
  const resultado = useMemo(() => calcularSimulacion(entrada), [entrada]);

  const set = (id: keyof EntradaSimulacion, valor: string | number) =>
    setEntrada((e) => ({ ...e, [id]: valor }));

  const comparacion = [
    {
      nombre: "Volumen agua (L)",
      declarado: entrada.volumenAguaL,
      recomendado: resultado.volumenTanqueRecomendadoL,
    },
    { nombre: "Espacio (m²)", declarado: entrada.espacioM2, recomendado: resultado.areaCultivoM2 },
    {
      nombre: "Temperatura (°C)",
      declarado: entrada.temperaturaAmbienteC,
      recomendado: (resultado.rangoTemperatura[0] + resultado.rangoTemperatura[1]) / 2,
    },
  ];

  return (
    <Layout>
      <div className="container py-16">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="font-display text-4xl font-bold text-foreground">
            Simulador de diseño acuapónico
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Calculadora educativa para explorar un sistema acuapónico pequeño. Los resultados se
            recalculan al modificar cualquier dato.
          </p>
        </motion.div>

        <p className="glass-card mt-6 p-4 text-sm text-muted-foreground border-l-4 border-l-accent">
          {AVISO_SIMULADOR}
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)]">
          {/* Formulario */}
          <form className="glass-card space-y-4 p-6 h-fit" onSubmit={(e) => e.preventDefault()}>
            <h2 className="font-display text-xl font-bold text-foreground">Datos de entrada</h2>

            {NUMERICOS.map((c) => (
              <div key={c.id} className="space-y-1.5">
                <label htmlFor={c.id} className="text-sm font-medium text-foreground block">
                  {c.label} <span className="text-muted-foreground">({c.unidad})</span>
                </label>
                <Input
                  id={c.id}
                  type="number"
                  min={0}
                  step={c.paso ?? 1}
                  value={String(entrada[c.id])}
                  onChange={(e) => set(c.id, Number(e.target.value) || 0)}
                />
              </div>
            ))}

            <div className="space-y-1.5">
              <label htmlFor="tipoPez" className="text-sm font-medium text-foreground block">
                Tipo de pez
              </label>
              <Select value={entrada.tipoPez} onValueChange={(v) => set("tipoPez", v)}>
                <SelectTrigger id="tipoPez"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIPOS_PEZ.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="tipoCultivo" className="text-sm font-medium text-foreground block">
                Tipo de cultivo
              </label>
              <Select value={entrada.tipoCultivo} onValueChange={(v) => set("tipoCultivo", v)}>
                <SelectTrigger id="tipoCultivo"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIPOS_CULTIVO.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="objetivo" className="text-sm font-medium text-foreground block">
                Objetivo
              </label>
              <Select value={entrada.objetivo} onValueChange={(v) => set("objetivo", v)}>
                <SelectTrigger id="objetivo"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {OBJETIVOS.map((o) => (
                    <SelectItem key={o.id} value={o.id}>{o.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setEntrada(ENTRADA_POR_DEFECTO)}>
                <RotateCcw aria-hidden className="h-4 w-4" /> Reiniciar
              </Button>
              <Button
                type="button"
                onClick={() => window.print()}
                className="gradient-nature border-0 text-primary-foreground"
              >
                <Printer aria-hidden className="h-4 w-4" /> Imprimir
              </Button>
            </div>
          </form>

          {/* Resultados */}
          <div className="space-y-10">
            <section>
              <h2 className="font-display text-xl font-bold text-foreground">Resultados estimados</h2>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Dato label="Biomasa estimada" valor={`${resultado.biomasaKg} kg`} />
                <Dato label="Volumen recomendado del tanque" valor={`${resultado.volumenTanqueRecomendadoL} L`} />
                <Dato label="Área aproximada de cultivo" valor={`${resultado.areaCultivoM2} m²`} />
                <Dato label="Caudal recomendado de bomba" valor={`${resultado.caudalBombaLh} L/h`} />
                <Dato label="Tasa de recirculación" valor={`${resultado.recirculacionesPorHora} vol/h`} />
                <Dato label="Oxígeno requerido" valor={`≈ ${resultado.oxigenoRequeridoGDia} g O₂/día`} />
                <Dato label="Alimento mensual" valor={`${resultado.alimentoMensualKg} kg`} />
                <Dato label="Reposición de agua" valor={`${resultado.reposicionAguaLMes} L/mes`} />
                <Dato label="Potencia eléctrica" valor={`${resultado.potenciaW} W`} />
                <Dato label="Consumo mensual" valor={`${resultado.consumoMensualKWh} kWh`} />
                <Dato label="Temperatura recomendada" valor={`${resultado.rangoTemperatura[0]} – ${resultado.rangoTemperatura[1]} °C`} />
                <Dato label="pH recomendado" valor={`${resultado.rangoPh[0]} – ${resultado.rangoPh[1]}`} />
                <Dato label="Oxígeno disuelto recomendado" valor={`${resultado.rangoOxigeno[0]} – ${resultado.rangoOxigeno[1]} mg/L`} />
              </dl>
            </section>

            {resultado.advertencias.length > 0 && (
              <section className="rounded-xl border border-accent/60 bg-accent/15 p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-accent-foreground">
                  <TriangleAlert aria-hidden className="h-4 w-4" /> Advertencias
                </h3>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-accent-foreground">
                  {resultado.advertencias.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h2 className="font-display text-xl font-bold text-foreground">
                Boceto automático del sistema
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Esquema orientativo; no es un plano de ingeniería definitivo.
              </p>
              <div className="glass-card mt-4 p-4">
                <BocetoSistema
                  volumenL={entrada.volumenAguaL}
                  areaCultivoM2={resultado.areaCultivoM2}
                  caudalLh={resultado.caudalBombaLh}
                  plantas={entrada.cantidadPlantas}
                  peces={entrada.cantidadPeces}
                />
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground">
                Valores declarados vs. recomendados
              </h2>
              <div className="glass-card mt-4 h-72 w-full p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparacion}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="nombre" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.75rem",
                        color: "hsl(var(--foreground))",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="declarado" name="Declarado" fill="hsl(var(--secondary))" radius={4} />
                    <Bar dataKey="recomendado" name="Recomendado" fill="hsl(var(--primary))" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Simulador;

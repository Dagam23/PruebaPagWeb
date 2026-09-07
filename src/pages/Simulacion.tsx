import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  Sliders,
  Cpu,
  LineChart as ChartIcon,
  Table as TableIcon,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";

// Componentes del simulador
import { BocetoSistema } from "@/components/simulacion/BocetoSistema";
import { DiagramaSistema, ActuadoresState } from "@/components/simulacion/DiagramaSistema";
import { PanelActuadores } from "@/components/simulacion/PanelActuadores";
import { PanelSetpoints } from "@/components/simulacion/PanelSetpoints";
import { TarjetasVariables } from "@/components/simulacion/TarjetasVariables";
import { GraficasDia } from "@/components/simulacion/GraficasDia";
import { TablaLecturas } from "@/components/simulacion/TablaLecturas";

// Servicios y constantes
import { DEFAULT_SETPOINTS, SetpointConfig } from "@/lib/constants";
import { telemetryService, type Lectura } from "@/services/telemetryService";

interface SimParams {
  espacio: number;
  peces: number;
  plantas: number;
  agua: number;
}

function calcRequirements(p: SimParams) {
  const tanqueLitros = Math.max(p.peces * 40, p.agua);
  const camasM2 = Math.ceil(p.plantas / 12);
  const bombaW = Math.ceil(p.agua * 0.05 + 10);
  const caudalLh = Math.round(tanqueLitros * 1.8);

  return {
    tanqueLitros,
    camasM2,
    bombaW,
    caudalLh,
    alimentoKgMes: +(p.peces * 0.15).toFixed(1),
    cosechaKgMes: +(p.plantas * 0.3).toFixed(1),
    aguaDiaria: +(p.agua * 0.02).toFixed(1),
    energiaMes: +((bombaW * 24 * 30) / 1000).toFixed(1),
  };
}

const Simulacion = () => {
  // 1. Estado de la Calculadora de Dimensionamiento
  const [params, setParams] = useState<SimParams>({
    espacio: 10,
    peces: 25,
    plantas: 60,
    agua: 600,
  });

  const [results, setResults] = useState<ReturnType<typeof calcRequirements>>(() =>
    calcRequirements({ espacio: 10, peces: 25, plantas: 60, agua: 600 })
  );

  const handleCalc = () => {
    setResults(calcRequirements(params));
  };

  // 2. Estado de Puntos de Consigna (Setpoints)
  const [setpoints, setSetpoints] = useState<SetpointConfig>(DEFAULT_SETPOINTS);

  // 3. Estado de Actuadores (reubicados con control por zonas)
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

  // 4. Datos de Telemetría Simulada e Histórico
  const [datos, setDatos] = useState<Lectura[]>(() =>
    telemetryService.generarLecturasHistoricas(24, 6, DEFAULT_SETPOINTS)
  );
  const [isSimRunning, setIsSimRunning] = useState(true);
  const [tabActiva, setTabActiva] = useState("dimensionamiento");

  // Loop de simulación en tiempo real cada 3.5 segundos
  useEffect(() => {
    if (!isSimRunning) return;

    const interval = setInterval(() => {
      setDatos((prev) => {
        const ultima = prev[prev.length - 1];
        if (!ultima) return prev;
        const nueva = telemetryService.generarSiguienteLectura(ultima, setpoints, actuadores);
        // Mantener hasta 180 muestras en memoria
        return [...prev.slice(-179), nueva];
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isSimRunning, setpoints, actuadores]);

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

  const handleRegenerateData = () => {
    setDatos(telemetryService.generarLecturasHistoricas(24, 6, setpoints));
  };

  return (
    <Layout>
      <div className="container py-12 md:py-16">
        {/* Cabecera Principal */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
            <Sparkles className="h-4 w-4 text-primary" /> Sistema Integrado de Simulación & Gemelo Digital
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Simulador Acuapónico Integral
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
            Dimensiona los requerimientos biológicos y energéticos, supervisa el gemelo digital en 2D,
            modifica los puntos de consigna (setpoints), conmuta actuadores y analiza la dinámica temporal
            de todas las variables físico-químicas.
          </p>
        </motion.div>

        {/* Pestañas de Navegación del Simulador */}
        <Tabs value={tabActiva} onValueChange={setTabActiva} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 sm:grid-cols-5 h-auto p-1.5 gap-1 bg-muted/60 border border-border/60 rounded-xl">
              <TabsTrigger
                value="dimensionamiento"
                className="flex items-center gap-2 py-2.5 px-3 text-xs md:text-sm"
              >
                <Calculator className="h-4 w-4" />
                <span>Dimensionamiento</span>
              </TabsTrigger>
              <TabsTrigger
                value="gemelo"
                className="flex items-center gap-2 py-2.5 px-3 text-xs md:text-sm"
              >
                <Cpu className="h-4 w-4" />
                <span>Gemelo & Actuadores</span>
              </TabsTrigger>
              <TabsTrigger
                value="graficas"
                className="flex items-center gap-2 py-2.5 px-3 text-xs md:text-sm"
              >
                <ChartIcon className="h-4 w-4" />
                <span>Telemetría & Gráficas</span>
              </TabsTrigger>
              <TabsTrigger
                value="setpoints"
                className="flex items-center gap-2 py-2.5 px-3 text-xs md:text-sm"
              >
                <Sliders className="h-4 w-4" />
                <span>Setpoints</span>
              </TabsTrigger>
              <TabsTrigger
                value="historico"
                className="flex items-center gap-2 py-2.5 px-3 text-xs md:text-sm col-span-2 sm:col-span-1"
              >
                <TableIcon className="h-4 w-4" />
                <span>Registro CSV</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ========================================================
              PESTAÑA 1: DIMENSIONAMIENTO Y BOCETO 2D REACTIVO
             ======================================================== */}
          <TabsContent value="dimensionamiento" className="space-y-8">
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Calculadora de entrada */}
              <div className="lg:col-span-5 glass-card p-6 border border-border/70 shadow-sm">
                <div className="flex items-center gap-2.5 mb-5 border-b border-border/40 pb-3">
                  <Calculator className="h-5 w-5 text-primary" />
                  <div>
                    <h2 className="font-display font-bold text-lg text-foreground">
                      Calculadora de Parámetros
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Modifica los valores para redimensionar el sistema
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {([
                    {
                      key: "espacio",
                      label: "Espacio disponible",
                      unit: "m²",
                      min: 1,
                      max: 500,
                      help: "Área total disponible para el sistema",
                    },
                    {
                      key: "peces",
                      label: "Biomasa de peces objetivo",
                      unit: "individuos",
                      min: 1,
                      max: 500,
                      help: "Densidad recomendada: 1 pez / 35-40 litros",
                    },
                    {
                      key: "plantas",
                      label: "Cantidad de plántulas",
                      unit: "plantas",
                      min: 1,
                      max: 1000,
                      help: "Densidad típica: 20-25 lechugas / m²",
                    },
                    {
                      key: "agua",
                      label: "Volumen de agua total",
                      unit: "Litros",
                      min: 50,
                      max: 10000,
                      help: "Suma del estanque + biofiltro + sumidero",
                    },
                  ] as const).map((field) => (
                    <div key={field.key} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <label className="font-semibold text-foreground">
                          {field.label} ({field.unit})
                        </label>
                        <span className="text-[11px] text-muted-foreground">{field.help}</span>
                      </div>
                      <input
                        type="number"
                        min={field.min}
                        max={field.max}
                        value={params[field.key]}
                        onChange={(e) =>
                          setParams((p) => ({
                            ...p,
                            [field.key]: Number(e.target.value) || 0,
                          }))
                        }
                        className="w-full bg-muted/70 rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring text-foreground border border-border/50"
                      />
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleCalc}
                  className="gradient-nature border-0 text-primary-foreground w-full font-semibold shadow-sm"
                >
                  Recalcular Requerimientos
                </Button>

                {/* Métricas calculadas */}
                {results && (
                  <div className="mt-6 pt-5 border-t border-border/60 grid grid-cols-2 gap-3">
                    {[
                      { label: "Tanque necesario", value: `${results.tanqueLitros} L` },
                      { label: "Camas de cultivo", value: `${results.camasM2} m²` },
                      { label: "Potencia de bomba", value: `${results.bombaW} W` },
                      { label: "Caudal recirculación", value: `${results.caudalLh} L/h` },
                      { label: "Alimento / mes", value: `${results.alimentoKgMes} kg` },
                      { label: "Cosecha estimada", value: `${results.cosechaKgMes} kg/mes` },
                      { label: "Reposición diaria", value: `${results.aguaDiaria} L` },
                      { label: "Consumo energía", value: `${results.energiaMes} kWh/mes` },
                    ].map((r) => (
                      <div key={r.label} className="bg-muted/40 rounded-lg p-3 border border-border/40">
                        <p className="text-[11px] text-muted-foreground mb-0.5">{r.label}</p>
                        <p className="font-display font-bold text-sm text-foreground">{r.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Boceto 2D del sistema sincronizado con la calculadora */}
              <div className="lg:col-span-7 space-y-4">
                <BocetoSistema
                  volumenL={results.tanqueLitros}
                  areaCultivoM2={results.camasM2}
                  caudalLh={results.caudalLh}
                  plantas={params.plantas}
                  peces={params.peces}
                />

                <div className="glass-card p-4 text-xs text-muted-foreground flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">
                      Relación Biológica y Dinámica del Boceto:
                    </p>
                    <p className="leading-relaxed">
                      El esquema actualiza sus valores calculando una tasa de recirculación de al menos
                      1.5 a 2 veces el volumen del tanque por hora ({results.caudalLh} L/h) para
                      garantizar la oxigenación y el arrastre de amonio hacia el filtro mecánico y biofiltro.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ========================================================
              PESTAÑA 2: GEMELO DIGITAL, SENSORES Y ACTUADORES
             ======================================================== */}
          <TabsContent value="gemelo" className="space-y-6">
            <div className="space-y-6">
              {/* Diagrama con reubicación precisa de actuadores y sensores interactivos */}
              <DiagramaSistema
                lectura={lecturaActual}
                setpoints={setpoints}
                actuadores={actuadores}
                onToggleActuador={handleToggleActuador}
                onOpenSetpoints={() => setTabActiva("setpoints")}
              />

              {/* Panel de Actuadores organizado por zonas físicas */}
              <PanelActuadores
                actuadores={actuadores}
                onToggle={handleToggleActuador}
              />
            </div>
          </TabsContent>

          {/* ========================================================
              PESTAÑA 3: TELEMETRÍA Y GRÁFICAS (TODAS A LA VEZ)
             ======================================================== */}
          <TabsContent value="graficas" className="space-y-6">
            {/* Tarjetas de Variables con sparklines y deltas */}
            <TarjetasVariables
              datos={datos}
              setpoints={setpoints}
              onSelectVariable={() => setTabActiva("setpoints")}
            />

            {/* Gráficas del día con opción de ver todas a la vez y modificación del tiempo */}
            <GraficasDia
              datos={datos}
              setpoints={setpoints}
              isSimRunning={isSimRunning}
              onToggleSim={() => setIsSimRunning((r) => !r)}
              onRegenerateData={handleRegenerateData}
            />
          </TabsContent>

          {/* ========================================================
              PESTAÑA 4: PUNTOS DE CONSIGNA (SETPOINTS)
             ======================================================== */}
          <TabsContent value="setpoints" className="space-y-6">
            <PanelSetpoints
              setpoints={setpoints}
              onChangeSetpoints={setSetpoints}
              onReset={() => setSetpoints(DEFAULT_SETPOINTS)}
            />
          </TabsContent>

          {/* ========================================================
              PESTAÑA 5: REGISTRO HISTÓRICO Y EXPORTACIÓN CSV
             ======================================================== */}
          <TabsContent value="historico" className="space-y-6">
            <TablaLecturas datos={datos} setpoints={setpoints} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Simulacion;

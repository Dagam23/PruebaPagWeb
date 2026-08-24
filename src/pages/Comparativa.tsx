import { motion } from "framer-motion";
import { Building2, TreePine, Check, X as XIcon } from "lucide-react";
import Layout from "@/components/Layout";
import urbanImg from "@/assets/urban-aquaponics.jpg";
import ruralImg from "@/assets/rural-aquaponics.jpg";

const urbanData = {
  title: "Acuaponía Urbana",
  icon: <Building2 className="h-8 w-8" />,
  img: urbanImg,
  desc: "Sistemas compactos diseñados para espacios reducidos en ciudades: balcones, terrazas, interiores y techos verdes.",
  pros: ["Accesible en ciudades", "Espacios pequeños", "Producción local", "Educación comunitaria", "Menor transporte"],
  cons: ["Espacio limitado", "Mayor costo inicial/m²", "Dependencia eléctrica", "Menor volumen de producción"],
  components: ["Tanque 50-200L", "Camas hidropónicas verticales", "Bomba de bajo consumo", "Iluminación LED", "Sensores IoT"],
};

const ruralData = {
  title: "Acuaponía Rural",
  icon: <TreePine className="h-8 w-8" />,
  img: ruralImg,
  desc: "Sistemas de mayor escala en entornos rurales con acceso a terreno, agua natural y condiciones climáticas favorables.",
  pros: ["Gran escala", "Menor costo/m²", "Luz natural", "Integración con granjas", "Alta producción"],
  cons: ["Requiere terreno", "Menor acceso tecnológico", "Logística de distribución", "Mantenimiento extenso"],
  components: ["Estanques 1,000-5,000L", "Invernaderos", "Sistemas de bombeo solar", "Camas de grava/arcilla", "Compostaje integrado"],
};

const comparisonTable = [
  { criterio: "Espacio requerido", urbano: "1-20 m²", rural: "50-500+ m²" },
  { criterio: "Inversión inicial", urbano: "$200-2,000 USD", rural: "$1,000-10,000 USD" },
  { criterio: "Producción mensual", urbano: "5-20 kg", rural: "50-500 kg" },
  { criterio: "Especies de peces", urbano: "Ornamentales, tilapia pequeña", rural: "Tilapia, trucha, bagre" },
  { criterio: "Plantas recomendadas", urbano: "Hierbas, lechugas, microgreens", rural: "Tomates, pepinos, fresas" },
  { criterio: "Energía", urbano: "Red eléctrica", rural: "Solar / mixta" },
  { criterio: "Mantenimiento", urbano: "Diario (15 min)", rural: "Diario (1-2 horas)" },
  { criterio: "Nivel de dificultad", urbano: "Principiante", rural: "Intermedio-Avanzado" },
];

const InfoBlock = ({ data, reverse }: { data: typeof urbanData; reverse?: boolean }) => (
  <motion.div
    className={`grid md:grid-cols-2 gap-8 items-center ${reverse ? "md:direction-rtl" : ""}`}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
  >
    <div className={reverse ? "md:order-2" : ""}>
      <img src={data.img} alt={data.title} className="rounded-xl shadow-card w-full" loading="lazy" width={800} height={512} />
    </div>
    <div className={reverse ? "md:order-1" : ""}>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-12 w-12 rounded-xl gradient-nature flex items-center justify-center text-primary-foreground">
          {data.icon}
        </div>
        <h3 className="font-display font-bold text-2xl text-foreground">{data.title}</h3>
      </div>
      <p className="text-muted-foreground mb-6 leading-relaxed">{data.desc}</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h4 className="font-semibold text-sm text-primary mb-2">Ventajas</h4>
          {data.pros.map((p) => (
            <div key={p} className="flex items-center gap-2 text-sm text-foreground mb-1">
              <Check className="h-4 w-4 text-primary flex-shrink-0" /> {p}
            </div>
          ))}
        </div>
        <div>
          <h4 className="font-semibold text-sm text-destructive mb-2">Desventajas</h4>
          {data.cons.map((c) => (
            <div key={c} className="flex items-center gap-2 text-sm text-foreground mb-1">
              <XIcon className="h-4 w-4 text-destructive flex-shrink-0" /> {c}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-sm text-secondary mb-2">Componentes clave</h4>
        <div className="flex flex-wrap gap-2">
          {data.components.map((c) => (
            <span key={c} className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs">{c}</span>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

const Comparativa = () => (
  <Layout>
    <div className="container py-16">
      <motion.div className="text-center mb-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="font-display text-4xl font-bold text-foreground mb-4">Comparativa: Urbano vs Rural</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Cada entorno tiene sus ventajas. Descubre cuál se adapta mejor a tus necesidades y recursos.
        </p>
      </motion.div>

      <div className="space-y-20">
        <InfoBlock data={urbanData} />
        <InfoBlock data={ruralData} reverse />
      </div>

      {/* Comparison Table */}
      <motion.div className="mt-20" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="font-display text-2xl font-bold text-center mb-8 text-foreground">Tabla Comparativa</h2>
        <div className="overflow-x-auto glass-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-display font-semibold text-foreground">Criterio</th>
                <th className="text-left p-4 font-display font-semibold text-primary">🏙️ Urbano</th>
                <th className="text-left p-4 font-display font-semibold text-secondary">🌾 Rural</th>
              </tr>
            </thead>
            <tbody>
              {comparisonTable.map((row, i) => (
                <tr key={row.criterio} className={i % 2 === 0 ? "bg-muted/30" : ""}>
                  <td className="p-4 font-medium text-foreground">{row.criterio}</td>
                  <td className="p-4 text-muted-foreground">{row.urbano}</td>
                  <td className="p-4 text-muted-foreground">{row.rural}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  </Layout>
);

export default Comparativa;

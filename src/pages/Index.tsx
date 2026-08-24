import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Droplets, Fish, Leaf, Sun, Target, Eye, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import heroImg from "@/assets/hero-aquaponics.jpg";
import aquaLogo from "@/assets/aquaponics-logo.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6 } }),
};

const modules = [
  {
    title: "Comparativa Urbano vs Rural",
    desc: "Explora las diferencias entre sistemas acuapónicos urbanos y rurales.",
    icon: <Sun className="h-8 w-8" />,
    path: "/comparativa",
    color: "from-primary to-secondary",
  },
  {
    title: "Minijuego Educativo",
    desc: "Aprende jugando: alimenta peces, cultiva plantas y mantén tu sistema.",
    icon: <Fish className="h-8 w-8" />,
    path: "/juego",
    color: "from-secondary to-primary",
  },
  {
    title: "Simulación y Métricas",
    desc: "Calcula requerimientos y monitorea métricas en tiempo real.",
    icon: <Droplets className="h-8 w-8" />,
    path: "/simulacion",
    color: "from-primary to-accent",
  },
];

const Index = () => (
  <Layout>
    {/* Hero */}
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImg} alt="Sistema acuapónico" className="w-full h-full object-cover" width={1920} height={800} />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/40" />
      </div>
      <div className="relative container py-24 md:py-36">
        <motion.div initial="hidden" animate="visible" className="max-w-2xl">
          <motion.h1 variants={fadeUp} custom={0} className="font-display text-4xl md:text-6xl font-bold text-primary-foreground leading-tight">
            Acuaponía <span className="text-accent">Sostenible</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={1} className="mt-4 text-lg text-primary-foreground/80 leading-relaxed">
            Semillero CEMOS — Investigación, educación y desarrollo de sistemas acuapónicos para un futuro más verde.
          </motion.p>
          <motion.div variants={fadeUp} custom={2} className="mt-8 flex gap-4 flex-wrap">
            <Button asChild size="lg" className="gradient-nature border-0 text-primary-foreground font-semibold shadow-nature">
              <Link to="/simulacion">Explorar Simulación <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gradient-nature border-0 text-primary-foreground font-semibold shadow-nature">
              <Link to="/comparativa">Ver Comparativa</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* About */}
    <section className="container py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <img src={aquaLogo} alt="Logo Acuaponía" className="w-64 mx-auto animate-float" width={512} height={512} />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">¿Qué es la Acuaponía?</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            La acuaponía es un ecosistema integrado que combina la acuicultura (cría de peces) y la hidroponía (cultivo sin suelo)
            en un ciclo cerrado. En este, bacterias beneficiosas transforman los desechos de los peces en nutrientes asimilables
             para las plantas, las cuales purifican el agua antes de retornar limpia al estanque
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <Leaf className="h-5 w-5 text-primary" />, label: "90% menos agua" },
              { icon: <Fish className="h-5 w-5 text-secondary" />, label: "Sin químicos" },
              { icon: <Droplets className="h-5 w-5 text-primary" />, label: "Ciclo cerrado" },
              { icon: <Sun className="h-5 w-5 text-accent" />, label: "Todo el año" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2 text-sm text-foreground">
                {f.icon} {f.label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    {/* Mission/Vision */}
    <section className="bg-muted/50 py-20">
      <div className="container grid md:grid-cols-3 gap-8">
        {[
          { icon: <Target className="h-8 w-8 text-primary" />, title: "Misión", text: "Investigar, desarrollar y difundir sistemas acuapónicos accesibles y sostenibles que contribuyan a la seguridad alimentaria en comunidades urbanas y rurales de Colombia." },
          { icon: <Eye className="h-8 w-8 text-secondary" />, title: "Visión", text: "Ser referentes nacionales en investigación aplicada en acuaponía, formando profesionales comprometidos con la producción alimentaria sostenible." },
          { icon: <Leaf className="h-8 w-8 text-primary" />, title: "Propósito", text: "Crear conciencia ambiental y ofrecer soluciones prácticas de producción sostenible a través de la educación, la tecnología y la investigación científica." },
        ].map((item) => (
          <motion.div key={item.title} className="glass-card p-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            {item.icon}
            <h3 className="font-display font-bold text-xl mt-4 mb-2 text-foreground">{item.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Modules */}
    <section className="container py-20">
      <h2 className="font-display text-3xl font-bold text-center mb-12 text-foreground">Módulos Educativos</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {modules.map((mod, i) => (
          <motion.div key={mod.path} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <Link to={mod.path} className="glass-card p-8 flex flex-col h-full group hover:shadow-nature transition-all duration-300 block">
              <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center text-primary-foreground mb-4 group-hover:scale-110 transition-transform`}>
                {mod.icon}
              </div>
              <h3 className="font-display font-bold text-lg mb-2 text-foreground">{mod.title}</h3>
              <p className="text-muted-foreground text-sm flex-1">{mod.desc}</p>
              <span className="mt-4 text-primary font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                Explorar <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Works */}
    <section className="bg-muted/50 py-20">
      <div className="container">
        <h2 className="font-display text-3xl font-bold text-center mb-8 text-foreground">Trabajos Realizados</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            { title: "Prototipo Urbano 2024", desc: "Sistema acuapónico de 50L instalado en terraza universitaria con tilapia y lechuga hidropónica." },
            { title: "Estudio Comparativo", desc: "Análisis de rendimiento de cultivos acuapónicos vs tradicionales en comunidades rurales del Valle." },
            { title: "Taller Comunitario", desc: "Capacitación a 120 familias campesinas en construcción y mantenimiento de sistemas caseros." },
            { title: "Monitoreo IoT", desc: "Implementación de sensores de pH, temperatura y oxígeno disuelto con dashboard en tiempo real." },
          ].map((w) => (
            <div key={w.title} className="glass-card p-6">
              <h4 className="font-display font-semibold text-foreground mb-1">{w.title}</h4>
              <p className="text-muted-foreground text-sm">{w.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Index;

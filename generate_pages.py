import os

index_content = """import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Droplets,
  ExternalLink,
  Eye,
  Fish,
  Leaf,
  Recycle,
  Sun,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import heroImg from "@/assets/hero-aquaponics.jpg";
import paginaPrincipalImg from "@/assets/Pagina-principal.png";
import directorImg from "@/assets/rodolfo-villamizar.png";
import { useQuery } from "@tanstack/react-query";
import { FALLBACK_PROJECTS, parseTSV, type Project } from "@/data/fallbackProjects";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6 } }),
};

const CICLO = [
  { icon: Fish, titulo: "1. Los peces generan nutrientes", texto: "Sus residuos contienen amonio.", bar: "bg-secondary" },
  { icon: Recycle, titulo: "2. Las bacterias transforman", texto: "Convierten amonio en nitrito y nitrato.", bar: "bg-primary" },
  { icon: Leaf, titulo: "3. Las plantas aprovechan", texto: "Absorben los nutrientes disueltos.", bar: "bg-accent" },
  { icon: Droplets, titulo: "4. El agua retorna", texto: "Vuelve limpia al tanque de peces.", bar: "gradient-nature" },
];

const TEXTOS = {
  sobre:
    "CEMOS Acuaponía es un semillero de investigación adscrito al Grupo CEMOS — Control, Electrónica, Modelado y Simulación de la Universidad Industrial de Santander. Promueve la formación de estudiantes mediante proyectos de automatización, instrumentación, control, IoT e inteligencia aplicada a sistemas acuapónicos.",
  mision:
    "Formar estudiantes capaces de diseñar, instrumentar y automatizar sistemas acuapónicos, integrando investigación, sostenibilidad y trabajo interdisciplinario.",
  vision:
    "Consolidar un espacio universitario de referencia en acuaponía inteligente, con soluciones educativas y tecnológicas que puedan transferirse a comunidades y proyectos productivos.",
  proposito:
    "Convertir el sistema acuapónico en un laboratorio vivo para aprender sobre sensores, control, producción sostenible, IoT, análisis de datos e inteligencia artificial.",
};

const FILTROS = [
  "Todos",
  "En desarrollo",
  "Finalizado",
  "Trabajo de grado",
  "Proyecto del semillero",
] as const;

const tsvUrl = import.meta.env.VITE_PROJECTS_TSV_URL;

const fetchProjects = async (): Promise<Project[]> => {
  if (!tsvUrl) {
    throw new Error("No TSV URL configured");
  }
  const response = await fetch(tsvUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch projects sheet");
  }
  const text = await response.text();
  return parseTSV(text);
};

const Index = () => {
  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]>("Todos");

  const { data: fetchedData, isLoading, isError } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    enabled: !!tsvUrl,
    retry: 1,
  });

  const projects = fetchedData || FALLBACK_PROJECTS;

  const visibles = projects.filter(
    (p) => filtro === "Todos" || p.estado === filtro || p.tipo === filtro,
  );

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    api.on("reInit", () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap());
    });

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Reiniciar el carrusel a la primera tarjeta al cambiar de filtro
  useEffect(() => {
    if (api) {
      api.scrollTo(0);
    }
  }, [filtro, api]);

  return (
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
                <Link to="/simulacion">Explorar Simulador <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gradient-nature border-0 text-primary-foreground font-semibold shadow-nature">
                <a href="#semillero">Conocer el semillero</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Un ecosistema en equilibrio (Fondo Degradado) */}
      <section className="gradient-nature py-20 text-primary-foreground shadow-inner">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <img
              src={paginaPrincipalImg}
              alt="Ilustración Ecosistema Acuapónico"
              className="w-72 md:w-96 mx-auto animate-float drop-shadow-2xl"
              width={512}
              height={512}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Un ecosistema en equilibrio
            </h2>
            <p className="text-primary-foreground/90 text-base leading-relaxed mb-6">
              La acuaponía es un ecosistema integrado que combina la acuicultura (cría de peces) y la hidroponía (cultivo sin suelo)
              en un ciclo cerrado. En este, bacterias beneficiosas transforman los desechos de los peces en nutrientes asimilables
              para las plantas, las cuales purifican el agua antes de retornar limpia al estanque.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Leaf className="h-5 w-5 text-accent" />, label: "90% menos agua" },
                { icon: <Fish className="h-5 w-5 text-accent" />, label: "Sin químicos" },
                { icon: <Droplets className="h-5 w-5 text-accent" />, label: "Ciclo cerrado" },
                { icon: <Sun className="h-5 w-5 text-accent" />, label: "Todo el año" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="flex items-center gap-2.5 text-sm font-medium text-primary-foreground bg-primary-foreground/10 px-3.5 py-2.5 rounded-lg backdrop-blur-sm border border-primary-foreground/15"
                >
                  {f.icon} <span>{f.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sobre el Semillero CEMOS Acuaponía (Fondo Claro/Muted) */}
      <section id="semillero" className="bg-muted/40 border-y border-border scroll-mt-20 py-20">
        <div className="container">
          <h2 className="font-display text-3xl font-bold text-foreground">
            Sobre el Semillero CEMOS Acuaponía
          </h2>
          <p className="mt-4 max-w-3xl text-base text-muted-foreground leading-relaxed">{TEXTOS.sobre}</p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { icon: <Target className="h-6 w-6 text-primary" />, titulo: "Misión", texto: TEXTOS.mision },
              { icon: <Eye className="h-6 w-6 text-secondary" />, titulo: "Visión", texto: TEXTOS.vision },
              { icon: <Leaf className="h-6 w-6 text-primary" />, titulo: "Propósito", texto: TEXTOS.proposito },
            ].map((b) => (
              <motion.div
                key={b.titulo}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card p-6 border border-border"
              >
                <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-3">
                  {b.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground">{b.titulo}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.texto}</p>
              </motion.div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Textos provisionales, pendientes de aprobación por el semillero.
          </p>
        </div>
      </section>

      {/* Dirección académica (Fondo Degradado) */}
      <section className="gradient-nature py-20 text-primary-foreground">
        <div className="container">
          <h2 className="font-display text-3xl font-bold text-primary-foreground">Dirección académica</h2>
          <div className="mt-8 grid gap-6 p-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur-sm shadow-xl">
            <img
              src={directorImg}
              alt="Retrato del Dr. Rodolfo Villamizar Mejía"
              loading="lazy"
              width={220}
              height={220}
              className="h-40 w-40 rounded-xl object-cover object-top border-2 border-primary-foreground/30 shadow-md"
            />
            <div className="min-w-0">
              <h3 className="font-display text-xl font-bold text-primary-foreground">Dr. Rodolfo Villamizar Mejía</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-primary-foreground/85">
                <li>• Director del Grupo de Investigación CEMOS</li>
                <li>• Profesor Titular de la E3T — UIS</li>
                <li>• Investigador Senior en supervisión, control y bioingeniería</li>
                <li>• Doctor en Tecnologías de la Información — Universitat de Girona</li>
              </ul>
              <a
                href="https://profesores.uis.edu.co/escuela-ingenierias-electrica-electronica-telecomunicaciones/rodolfo-villamizar-mejia-es/index.html"
                target="_blank"
                rel="noreferrer noopener"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent/80 underline-offset-4 hover:underline"
              >
                Ver perfil institucional <ExternalLink aria-hidden className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trabajos de grado y proyectos (Fondo Claro) */}
      <section className="bg-background py-20">
        <div className="container">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground">Trabajos de grado y proyectos</h2>
              <p className="mt-2 text-sm text-muted-foreground flex flex-wrap items-center gap-2">
                <span>Espacio administrable para trabajos de grado, proyectos y egresados vinculados.</span>
                {isError && (
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900/50">
                    (Cargando datos locales de respaldo - sin conexión)
                  </span>
                )}
                {!tsvUrl && (
                  <span className="text-xs text-muted-foreground italic bg-muted/50 px-2 py-0.5 rounded">
                    (Datos predeterminados)
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filtros de proyectos">
            {FILTROS.map((f) => (
              <Button
                key={f}
                size="sm"
                variant={filtro === f ? "default" : "outline"}
                onClick={() => setFiltro(f)}
              >
                {f}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="glass-card overflow-hidden animate-pulse">
                  <span className="block h-1.5 bg-muted" />
                  <CardHeader>
                    <div className="flex gap-2">
                      <div className="h-5 w-20 bg-muted rounded" />
                      <div className="h-5 w-16 bg-muted rounded" />
                    </div>
                    <div className="mt-3 h-6 w-3/4 bg-muted rounded" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="h-4 w-5/6 bg-muted rounded" />
                    <div className="h-4 w-2/3 bg-muted rounded" />
                    <div className="h-4 w-1/2 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : visibles.length === 0 ? (
            <p className="mt-8 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No hay elementos para este filtro.
            </p>
          ) : (
            <div className="mt-6 relative">
              <Carousel
                setApi={setApi}
                opts={{
                  align: "start",
                  loop: false,
                  breakpoints: {
                    "(min-width: 640px)": { slidesToScroll: 2 },
                    "(min-width: 1024px)": { slidesToScroll: 4 },
                  },
                }}
                className="w-full relative"
              >
                <CarouselContent className="-ml-4 py-2">
                  {visibles.map((p, i) => (
                    <CarouselItem
                      key={p.id || i}
                      className="pl-4 basis-full sm:basis-1/2 lg:basis-1/4"
                    >
                      <Card className="glass-card overflow-hidden flex flex-col justify-between h-full">
                        <div>
                          <span className={`block h-1.5 ${p.estado === "Finalizado" ? "bg-primary" : "bg-secondary"}`} />
                          <CardHeader>
                            <div className="flex flex-wrap gap-2">
                              {p.tipo && <Badge variant="secondary">{p.tipo}</Badge>}
                              {p.estado && (
                                <Badge variant={p.estado === "Finalizado" ? "outline" : "default"}>
                                  {p.estado}
                                </Badge>
                              )}
                              {p.id && <Badge variant="outline" className="text-xs">{p.id}</Badge>}
                            </div>
                            <CardTitle className="mt-2 text-base text-foreground font-bold line-clamp-2">
                              {p.titulo || "Sin título"}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm text-muted-foreground">
                            {p.integrantes && (
                              <p>
                                <span className="font-semibold text-foreground">Integrantes:</span> {p.integrantes}
                              </p>
                            )}
                            {p.director && (
                              <p>
                                <span className="font-semibold text-foreground">Director:</span> {p.director}
                              </p>
                            )}
                            {p.semestre && (
                              <p>
                                <span className="font-semibold text-foreground">Semestre:</span> {p.semestre}
                              </p>
                            )}
                            {p.resumen && (
                              <p className="line-clamp-3 mt-2 text-xs italic">
                                "{p.resumen}"
                              </p>
                            )}
                          </CardContent>
                        </div>
                        {p.enlace && (
                          <div className="p-6 pt-0 mt-auto">
                            <Button asChild size="sm" variant="outline" className="w-full mt-2">
                              <a href={p.enlace} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5">
                                Ver Documento <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                        )}
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Botones de navegación laterales flotantes superpuestos */}
                {count > 1 && (
                  <>
                    <CarouselPrevious className="left-2 z-10 bg-background/85 backdrop-blur-md border border-border shadow-lg hover:bg-background h-10 w-10 disabled:opacity-0 disabled:pointer-events-none transition-opacity" />
                    <CarouselNext className="right-2 z-10 bg-background/85 backdrop-blur-md border border-border shadow-lg hover:bg-background h-10 w-10 disabled:opacity-0 disabled:pointer-events-none transition-opacity" />
                  </>
                )}
              </Carousel>

              {/* Puntos indicadores de navegación */}
              {count > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  {Array.from({ length: count }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => api?.scrollTo(index)}
                      aria-label={`Ir al grupo ${index + 1}`}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        current === index
                          ? "w-8 bg-primary"
                          : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
"""

with open('src/pages/Index.tsx', 'w') as f:
    f.write(index_content)

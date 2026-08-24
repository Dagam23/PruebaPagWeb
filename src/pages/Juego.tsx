import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fish, Leaf, Droplets, Sun, Zap, Award, ArrowRight, RotateCcw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

interface Level {
  id: number;
  title: string;
  description: string;
  mission: string;
  icon: React.ReactNode;
  tasks: { id: string; label: string; hint: string }[];
  narrative: string;
}

const levels: Level[] = [
  {
    id: 1, title: "Conoce tu sistema", icon: <Droplets className="h-6 w-6" />,
    description: "Aprende los componentes básicos de un sistema acuapónico.",
    mission: "Identifica y activa cada componente del sistema.",
    narrative: "¡Bienvenido, joven acuaponista! Tu primera misión es conocer cada parte de tu nuevo sistema acuapónico.",
    tasks: [
      { id: "tank", label: "Instalar el tanque de peces", hint: "El tanque es el corazón del sistema" },
      { id: "pump", label: "Conectar la bomba de agua", hint: "La bomba mueve el agua del tanque a las plantas" },
      { id: "bed", label: "Preparar las camas de cultivo", hint: "Las camas filtran el agua y nutren las plantas" },
    ],
  },
  {
    id: 2, title: "Alimenta los peces", icon: <Fish className="h-6 w-6" />,
    description: "Los peces necesitan la cantidad correcta de alimento.",
    mission: "Alimenta a los peces sin sobrealimentar.",
    narrative: "Tus peces están hambrientos. Recuerda: muy poco alimento los debilita, demasiado contamina el agua.",
    tasks: [
      { id: "measure", label: "Medir la porción correcta (2% del peso)", hint: "Usa 2% del peso corporal de los peces" },
      { id: "feed", label: "Distribuir el alimento uniformemente", hint: "Esparce el alimento por toda la superficie" },
      { id: "observe", label: "Observar que coman en 5 minutos", hint: "Si sobra comida, reduce la próxima porción" },
    ],
  },
  {
    id: 3, title: "Ajusta la iluminación", icon: <Sun className="h-6 w-6" />,
    description: "Las plantas necesitan luz adecuada para crecer.",
    mission: "Configura el ciclo de luz para tus plantas.",
    narrative: "La luz es energía para tus plantas. Un ciclo de 14 horas de luz y 10 de oscuridad es ideal.",
    tasks: [
      { id: "timer", label: "Programar temporizador (14h luz/10h oscuridad)", hint: "Las plantas necesitan descanso nocturno" },
      { id: "height", label: "Ajustar altura de las lámparas", hint: "30-40 cm sobre las plantas es ideal" },
      { id: "spectrum", label: "Seleccionar espectro adecuado", hint: "Luz azul para crecimiento, roja para floración" },
    ],
  },
  {
    id: 4, title: "Planta tus cultivos", icon: <Leaf className="h-6 w-6" />,
    description: "Es hora de plantar semillas en las camas de cultivo.",
    mission: "Planta y cuida tus primeros cultivos.",
    narrative: "¡Manos a la tierra! Bueno, en acuaponía no hay tierra. Vamos a plantar en las camas de cultivo.",
    tasks: [
      { id: "select", label: "Seleccionar variedades compatibles", hint: "Lechuga y albahaca son ideales para empezar" },
      { id: "plant", label: "Trasplantar plántulas a las camas", hint: "Coloca las raíces con cuidado entre la arcilla" },
      { id: "space", label: "Respetar el espaciado entre plantas", hint: "15-20 cm entre lechugas, 30 cm para tomates" },
    ],
  },
  {
    id: 5, title: "Mantén el equilibrio", icon: <Zap className="h-6 w-6" />,
    description: "Monitorea y ajusta los parámetros del agua.",
    mission: "Mantén pH, temperatura y nitratos en rangos óptimos.",
    narrative: "El equilibrio es clave. Agua muy ácida daña a los peces, muy alcalina afecta a las plantas.",
    tasks: [
      { id: "ph", label: "Medir y ajustar pH (6.8-7.2)", hint: "Usa carbonato de calcio para subir, ácido fosfórico para bajar" },
      { id: "temp", label: "Verificar temperatura (22-28°C)", hint: "Un calentador o ventilador puede ayudar" },
      { id: "nitrate", label: "Revisar niveles de nitrato", hint: "10-80 ppm es el rango ideal para las plantas" },
    ],
  },
  {
    id: 6, title: "¡Cosecha!", icon: <Award className="h-6 w-6" />,
    description: "Tu sistema está maduro. Es hora de cosechar.",
    mission: "Realiza tu primera cosecha exitosa.",
    narrative: "¡Felicidades! Después de semanas de cuidado, tus plantas están listas. ¡Es hora de la recompensa!",
    tasks: [
      { id: "check", label: "Verificar madurez de los cultivos", hint: "Las hojas deben estar firmes y de color intenso" },
      { id: "harvest", label: "Cosechar sin dañar las raíces", hint: "Corta sobre la base para que rebrote" },
      { id: "replant", label: "Replantar para el siguiente ciclo", hint: "La producción continua es clave en acuaponía" },
    ],
  },
];

const Juego = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<Record<string, Set<string>>>({});
  const [gameStarted, setGameStarted] = useState(false);
  const [showNarrative, setShowNarrative] = useState(true);

  const level = levels[currentLevel];
  const completed = completedTasks[level.id] || new Set();
  const allDone = completed.size === level.tasks.length;
  const totalCompleted = Object.values(completedTasks).reduce((acc, s) => acc + s.size, 0);
  const totalTasks = levels.reduce((acc, l) => acc + l.tasks.length, 0);

  const toggleTask = useCallback((taskId: string) => {
    setCompletedTasks((prev) => {
      const current = new Set(prev[level.id] || []);
      if (current.has(taskId)) current.delete(taskId);
      else current.add(taskId);
      return { ...prev, [level.id]: current };
    });
  }, [level.id]);

  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel((p) => p + 1);
      setShowNarrative(true);
    }
  };

  const restart = () => {
    setCurrentLevel(0);
    setCompletedTasks({});
    setShowNarrative(true);
  };

  if (!gameStarted) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto">
            <div className="h-24 w-24 rounded-2xl gradient-nature flex items-center justify-center mx-auto mb-6 animate-float">
              <Fish className="h-12 w-12 text-primary-foreground" />
            </div>
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">AquaQuest</h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              ¡Embárcate en una aventura educativa! Aprende a construir y mantener un sistema acuapónico a través de 6 niveles progresivos.
            </p>
            <Button onClick={() => setGameStarted(true)} size="lg" className="gradient-nature border-0 text-primary-foreground font-semibold shadow-nature">
              Comenzar Aventura <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Progreso general</span>
            <span className="text-sm text-muted-foreground">{totalCompleted}/{totalTasks} tareas</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-nature rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(totalCompleted / totalTasks) * 100}%` }}
            />
          </div>
        </div>

        {/* Level selector */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {levels.map((l, i) => {
            const lCompleted = (completedTasks[l.id] || new Set()).size === l.tasks.length;
            return (
              <button
                key={l.id}
                onClick={() => { setCurrentLevel(i); setShowNarrative(true); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  i === currentLevel
                    ? "gradient-nature text-primary-foreground shadow-nature"
                    : lCompleted
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {lCompleted ? <CheckCircle2 className="h-4 w-4" /> : l.icon}
                <span className="hidden sm:inline">Nivel {l.id}</span>
              </button>
            );
          })}
          <button onClick={restart} className="px-3 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 text-sm">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {/* Current level */}
        <AnimatePresence mode="wait">
          <motion.div key={level.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {/* Narrative */}
            {showNarrative && (
              <motion.div className="glass-card p-8 mb-8 text-center max-w-2xl mx-auto" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="h-16 w-16 rounded-2xl gradient-nature flex items-center justify-center mx-auto mb-4 text-primary-foreground">
                  {level.icon}
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">Nivel {level.id}: {level.title}</h2>
                <p className="text-muted-foreground italic mb-4">"{level.narrative}"</p>
                <p className="text-sm text-foreground font-medium mb-4">🎯 Misión: {level.mission}</p>
                <Button onClick={() => setShowNarrative(false)} className="gradient-nature border-0 text-primary-foreground">
                  ¡Empezar! <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {/* Tasks */}
            {!showNarrative && (
              <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                  <h2 className="font-display text-2xl font-bold text-foreground">{level.title}</h2>
                  <p className="text-muted-foreground text-sm">{level.description}</p>
                </div>

                <div className="space-y-3">
                  {level.tasks.map((task, i) => {
                    const done = completed.has(task.id);
                    return (
                      <motion.button
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={`w-full text-left glass-card p-5 flex items-start gap-4 transition-all hover:shadow-nature ${done ? "ring-2 ring-primary/50" : ""}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                          {done ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-sm font-bold">{i + 1}</span>}
                        </div>
                        <div>
                          <p className={`font-medium ${done ? "text-primary line-through" : "text-foreground"}`}>{task.label}</p>
                          <p className="text-xs text-muted-foreground mt-1">💡 {task.hint}</p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {allDone && (
                  <motion.div className="mt-8 text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <p className="text-primary font-semibold text-lg mb-4">🎉 ¡Nivel completado!</p>
                    {currentLevel < levels.length - 1 ? (
                      <Button onClick={nextLevel} className="gradient-nature border-0 text-primary-foreground font-semibold shadow-nature">
                        Siguiente Nivel <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <div>
                        <p className="text-2xl mb-2">🏆</p>
                        <p className="font-display font-bold text-xl text-foreground">¡Has completado AquaQuest!</p>
                        <p className="text-muted-foreground text-sm mt-1">Ahora eres un experto en acuaponía.</p>
                        <Button onClick={restart} variant="outline" className="mt-4">Jugar de nuevo</Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default Juego;

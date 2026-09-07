export type VariableId =
  | "temperatura"
  | "ph"
  | "oxigeno"
  | "amonio"
  | "nitrito"
  | "nitrato";

export interface VariableDef {
  id: VariableId;
  nombre: string;
  unidad: string;
  decimales: number;
  min: number;
  max: number;
  color: string;
  descripcion: string;
  icono: string;
  puntoDiagrama: {
    x: number;
    y: number;
    etiqueta: string;
    ubicacion: string;
  };
}

export const VARIABLES: VariableDef[] = [
  {
    id: "temperatura",
    nombre: "Temperatura del agua",
    unidad: "°C",
    decimales: 1,
    min: 22,
    max: 28,
    color: "#ef4444",
    descripcion: "Temperatura óptima para el metabolismo de peces y bacterias nitrificantes.",
    icono: "Thermometer",
    puntoDiagrama: {
      x: 100,
      y: 250,
      etiqueta: "T",
      ubicacion: "Interior del tanque de peces",
    },
  },
  {
    id: "ph",
    nombre: "pH del agua",
    unidad: "pH",
    decimales: 1,
    min: 6.5,
    max: 7.5,
    color: "#3b82f6",
    descripcion: "Equilibrio ácido-base ideal para asimilación vegetal y salud biológica.",
    icono: "FlaskConical",
    puntoDiagrama: {
      x: 155,
      y: 285,
      etiqueta: "pH",
      ubicacion: "Salida del tanque hacia el filtro",
    },
  },
  {
    id: "oxigeno",
    nombre: "Oxígeno disuelto",
    unidad: "mg/L",
    decimales: 1,
    min: 5.0,
    max: 8.5,
    color: "#06b6d4",
    descripcion: "Oxigenación para la respiración de peces y biofiltración aerobia.",
    icono: "Wind",
    puntoDiagrama: {
      x: 60,
      y: 205,
      etiqueta: "OD",
      ubicacion: "Zona de aireación del tanque",
    },
  },
  {
    id: "amonio",
    nombre: "Amonio total (NH₄⁺)",
    unidad: "mg/L",
    decimales: 2,
    min: 0.0,
    max: 0.5,
    color: "#f59e0b",
    descripcion: "Desecho principal de los peces; debe ser filtrado rápidamente.",
    icono: "Droplet",
    puntoDiagrama: {
      x: 275,
      y: 205,
      etiqueta: "NH₄",
      ubicacion: "Entrada del filtro mecánico",
    },
  },
  {
    id: "nitrito",
    nombre: "Nitrito (NO₂⁻)",
    unidad: "mg/L",
    decimales: 2,
    min: 0.0,
    max: 0.3,
    color: "#8b5cf6",
    descripcion: "Producto intermedio tóxico del ciclo; oxidado por Nitrobacter.",
    icono: "Activity",
    puntoDiagrama: {
      x: 390,
      y: 205,
      etiqueta: "NO₂",
      ubicacion: "Interior del biofiltro",
    },
  },
  {
    id: "nitrato",
    nombre: "Nitrato (NO₃⁻)",
    unidad: "mg/L",
    decimales: 0,
    min: 20,
    max: 90,
    color: "#10b981",
    descripcion: "Nutriente final asimilable y beneficioso para el crecimiento vegetal.",
    icono: "Activity",
    puntoDiagrama: {
      x: 520,
      y: 110,
      etiqueta: "NO₃",
      ubicacion: "Línea de impulsión hacia el cultivo",
    },
  },
];

export const VARIABLE_MAP: Record<VariableId, VariableDef> = VARIABLES.reduce(
  (acc, v) => ({ ...acc, [v.id]: v }),
  {} as Record<VariableId, VariableDef>
);

export const AVISO_INSTRUMENTACION =
  "Instrumentación preliminar del prototipo semillero CEMOS UIS. Rangos basados en estándares acuapónicos FAO y calibración experimental";

export interface SetpointConfig {
  temperatura: { min: number; max: number; objetivo: number };
  ph: { min: number; max: number; objetivo: number };
  oxigeno: { min: number; max: number; objetivo: number };
  amonio: { min: number; max: number; objetivo: number };
  nitrito: { min: number; max: number; objetivo: number };
  nitrato: { min: number; max: number; objetivo: number };
}

export const DEFAULT_SETPOINTS: SetpointConfig = {
  temperatura: { min: 22, max: 28, objetivo: 25 },
  ph: { min: 6.5, max: 7.5, objetivo: 7.0 },
  oxigeno: { min: 5.0, max: 8.5, objetivo: 6.5 },
  amonio: { min: 0.0, max: 0.5, objetivo: 0.15 },
  nitrito: { min: 0.0, max: 0.3, objetivo: 0.05 },
  nitrato: { min: 20, max: 90, objetivo: 45 },
};

export interface EspeciePreset {
  id: string;
  nombre: string;
  descripcion: string;
  peces: string;
  plantas: string;
  setpoints: SetpointConfig;
}

export const PRESETS_ESPECIES: EspeciePreset[] = [
  {
    id: "tilapia_lechuga",
    nombre: "Tilapia Roja + Lechuga Mantecosa",
    descripcion: "Configuración más común en clima cálido/templado. Gran resistencia y alta tasa de nitrificación.",
    peces: "Oreochromis niloticus / Tilapia Roja",
    plantas: "Lactuca sativa (Lechuga)",
    setpoints: {
      temperatura: { min: 23, max: 29, objetivo: 26 },
      ph: { min: 6.6, max: 7.4, objetivo: 7.0 },
      oxigeno: { min: 5.0, max: 8.5, objetivo: 6.5 },
      amonio: { min: 0.0, max: 0.5, objetivo: 0.1 },
      nitrito: { min: 0.0, max: 0.25, objetivo: 0.05 },
      nitrato: { min: 25, max: 80, objetivo: 50 },
    },
  },
  {
    id: "trucha_albahaca",
    nombre: "Trucha Arcoíris + Albahaca",
    descripcion: "Especial para clima frío. Requiere alta saturación de oxígeno y agua más cristalina.",
    peces: "Oncorhynchus mykiss (Trucha)",
    plantas: "Ocimum basilicum (Albahaca)",
    setpoints: {
      temperatura: { min: 14, max: 19, objetivo: 16.5 },
      ph: { min: 6.5, max: 7.2, objetivo: 6.8 },
      oxigeno: { min: 6.5, max: 9.5, objetivo: 7.5 },
      amonio: { min: 0.0, max: 0.2, objetivo: 0.05 },
      nitrito: { min: 0.0, max: 0.15, objetivo: 0.03 },
      nitrato: { min: 20, max: 60, objetivo: 35 },
    },
  },
  {
    id: "carpa_tomate",
    nombre: "Carpa Común + Tomate Cherry",
    descripcion: "Cultivo intensivo con alta demanda de nutrientes (nitratos y potasio) y peces muy rústicos.",
    peces: "Cyprinus carpio (Carpa)",
    plantas: "Solanum lycopersicum (Tomate)",
    setpoints: {
      temperatura: { min: 20, max: 27, objetivo: 24 },
      ph: { min: 6.8, max: 7.8, objetivo: 7.2 },
      oxigeno: { min: 4.5, max: 8.0, objetivo: 6.0 },
      amonio: { min: 0.0, max: 0.6, objetivo: 0.2 },
      nitrito: { min: 0.0, max: 0.35, objetivo: 0.08 },
      nitrato: { min: 40, max: 120, objetivo: 75 },
    },
  },
];

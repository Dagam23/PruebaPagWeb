import { DEFAULT_SETPOINTS, SetpointConfig, VariableId, VARIABLES } from "@/lib/constants";

export interface Lectura {
  t: number; // timestamp in ms
  temperatura: number;
  ph: number;
  oxigeno: number;
  amonio: number;
  nitrito: number;
  nitrato: number;
}

export type EstadoLectura = "normal" | "advertencia" | "critico";

export function estadoVariable(
  id: VariableId,
  valor: number,
  setpoints: SetpointConfig = DEFAULT_SETPOINTS
): EstadoLectura {
  const sp = setpoints[id];
  if (!sp) return "normal";

  // Margen de tolerancia del 15% para advertencia
  const margen = (sp.max - sp.min) * 0.15;
  if (valor >= sp.min && valor <= sp.max) {
    return "normal";
  }
  if (valor >= sp.min - margen && valor <= sp.max + margen) {
    return "advertencia";
  }
  return "critico";
}

export function estadoGeneral(
  d: Lectura,
  setpoints: SetpointConfig = DEFAULT_SETPOINTS
): EstadoLectura {
  let peor: EstadoLectura = "normal";
  const vars: VariableId[] = ["temperatura", "ph", "oxigeno", "amonio", "nitrito", "nitrato"];

  for (const v of vars) {
    const est = estadoVariable(v, d[v], setpoints);
    if (est === "critico") return "critico";
    if (est === "advertencia") peor = "advertencia";
  }
  return peor;
}

export function descargarCSV(nombreArchivo: string, contenido: string) {
  const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", nombreArchivo);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

class TelemetryService {
  /**
   * Convierte un arreglo de lecturas a formato CSV
   */
  aCSV(lecturas: Lectura[]): string {
    const headers = [
      "Timestamp",
      "Fecha",
      "Hora",
      ...VARIABLES.map((v) => `${v.nombre} (${v.unidad})`),
      "Estado General",
    ];

    const rows = lecturas.map((l) => {
      const fecha = new Date(l.t).toLocaleDateString("es-CO");
      const hora = new Date(l.t).toLocaleTimeString("es-CO");
      const estado = estadoGeneral(l);
      return [
        l.t,
        fecha,
        hora,
        l.temperatura.toFixed(1),
        l.ph.toFixed(1),
        l.oxigeno.toFixed(1),
        l.amonio.toFixed(2),
        l.nitrito.toFixed(2),
        l.nitrato.toFixed(0),
        estado,
      ].join(",");
    });

    return [headers.join(","), ...rows].join("\n");
  }

  /**
   * Genera un conjunto de datos histórico coherente para simulación
   */
  generarLecturasHistoricas(
    horas = 24,
    puntosPorHora = 12,
    setpoints: SetpointConfig = DEFAULT_SETPOINTS
  ): Lectura[] {
    const totalPuntos = horas * puntosPorHora;
    const intervaloMs = (horas * 3600 * 1000) / totalPuntos;
    const ahora = Date.now();
    const resultado: Lectura[] = [];

    // Valores iniciales basados en los objetivos
    let temp = setpoints.temperatura.objetivo;
    let ph = setpoints.ph.objetivo;
    let oxigeno = setpoints.oxigeno.objetivo;
    let amonio = setpoints.amonio.objetivo;
    let nitrito = setpoints.nitrito.objetivo;
    let nitrato = setpoints.nitrato.objetivo;

    for (let i = totalPuntos; i >= 0; i--) {
      const t = ahora - i * intervaloMs;
      // Ciclo diurno suave
      const horaDelDia = new Date(t).getHours() + new Date(t).getMinutes() / 60;
      const cicloSolar = Math.sin(((horaDelDia - 9) / 24) * 2 * Math.PI); // pico a las 3pm

      // Fluctuaciones físicas
      temp = +(setpoints.temperatura.objetivo + cicloSolar * 1.5 + (Math.random() - 0.5) * 0.3).toFixed(1);
      ph = +(setpoints.ph.objetivo + cicloSolar * 0.15 + (Math.random() - 0.5) * 0.08).toFixed(2);
      oxigeno = +(setpoints.oxigeno.objetivo - cicloSolar * 0.4 + (Math.random() - 0.5) * 0.25).toFixed(1);

      // Fluctuaciones biológicas
      amonio = Math.max(0.01, +(setpoints.amonio.objetivo + (Math.random() - 0.5) * 0.06).toFixed(2));
      nitrito = Math.max(0.01, +(setpoints.nitrito.objetivo + (Math.random() - 0.5) * 0.03).toFixed(2));
      nitrato = Math.max(10, +(setpoints.nitrato.objetivo + (Math.random() - 0.5) * 4).toFixed(0));

      resultado.push({
        t,
        temperatura: temp,
        ph,
        oxigeno,
        amonio,
        nitrito,
        nitrato,
      });
    }

    return resultado;
  }

  /**
   * Genera la siguiente lectura en tiempo real respondiendo a actuadores y setpoints
   */
  generarSiguienteLectura(
    anterior: Lectura,
    setpoints: SetpointConfig = DEFAULT_SETPOINTS,
    actuadores?: {
      bomba?: boolean;
      aireador?: boolean;
      alimentador?: boolean;
      luz?: boolean;
    }
  ): Lectura {
    const ahora = Date.now();
    const hora = new Date(ahora).getHours() + new Date(ahora).getMinutes() / 60;
    const cicloSolar = Math.sin(((hora - 9) / 24) * 2 * Math.PI);

    const aireadorActivo = actuadores?.aireador ?? true;
    const bombaActiva = actuadores?.bomba ?? true;
    const alimentadorActivo = actuadores?.alimentador ?? false;

    // Oxígeno: sube si aireador está activo, cae si está inactivo
    const empujeOxigeno = aireadorActivo ? 0.08 : -0.15;
    const nuevoOxigeno = Math.min(
      9.5,
      Math.max(
        2.5,
        +(anterior.oxigeno + empujeOxigeno + (Math.random() - 0.5) * 0.1).toFixed(1)
      )
    );

    // Amonio: sube si alimentador está activo o bomba apagada, decae si filtración activa
    const empujeAmonio = alimentadorActivo ? 0.04 : bombaActiva ? -0.01 : 0.03;
    const nuevoAmonio = Math.min(
      1.5,
      Math.max(
        0.01,
        +(anterior.amonio + empujeAmonio + (Math.random() - 0.5) * 0.02).toFixed(2)
      )
    );

    // Nitrito: responde a la nitrificación
    const nuevoNitrito = Math.min(
      0.8,
      Math.max(
        0.01,
        +(anterior.nitrito + (nuevoAmonio > 0.3 ? 0.02 : -0.01) + (Math.random() - 0.5) * 0.01).toFixed(2)
      )
    );

    // Nitrato: sube lentamente con ciclo de nitrógeno
    const nuevoNitrato = Math.min(
      150,
      Math.max(
        15,
        +(anterior.nitrato + (bombaActiva ? 0.2 : -0.1) + (Math.random() - 0.5) * 1).toFixed(0)
      )
    );

    // Temperatura
    const nuevaTemp = +(
      setpoints.temperatura.objetivo +
      cicloSolar * 1.2 +
      (Math.random() - 0.5) * 0.15
    ).toFixed(1);

    // pH
    const nuevoPh = +(
      setpoints.ph.objetivo +
      (Math.random() - 0.5) * 0.05
    ).toFixed(2);

    return {
      t: ahora,
      temperatura: nuevaTemp,
      ph: nuevoPh,
      oxigeno: nuevoOxigeno,
      amonio: nuevoAmonio,
      nitrito: nuevoNitrito,
      nitrato: nuevoNitrato,
    };
  }
}

export const telemetryService = new TelemetryService();

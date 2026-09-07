/**
 * Boceto 2D interactivo y reactivo del sistema acuapónico.
 * Las etiquetas y dimensiones se actualizan en tiempo real con los
 * resultados calculados en el simulador.
 */
interface BocetoSistemaProps {
  volumenL: number;
  areaCultivoM2: number;
  caudalLh: number;
  plantas: number;
  peces: number;
  className?: string;
}

export function BocetoSistema({
  volumenL,
  areaCultivoM2,
  caudalLh,
  plantas,
  peces,
  className = "",
}: BocetoSistemaProps) {
  return (
    <div className={`w-full overflow-hidden rounded-xl border border-border/70 bg-card/60 p-4 shadow-sm backdrop-blur-sm ${className}`}>
      <div className="mb-2 flex items-center justify-between border-b border-border/40 pb-2">
        <div>
          <h3 className="font-display text-sm font-semibold text-foreground">
            Boceto 2D Dinámico del Circuito Acuapónico
          </h3>
          <p className="text-xs text-muted-foreground">
            Dimensiones y caudales ajustados a tus parámetros de simulación
          </p>
        </div>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
          Simulación Activa
        </span>
      </div>

      <svg
        viewBox="0 0 720 340"
        className="h-auto w-full"
        role="img"
        aria-label={`Boceto del sistema acuapónico: tanque de ${volumenL} litros con ${peces} peces, cama de cultivo de ${areaCultivoM2} metros cuadrados y bomba de ${caudalLh} litros por hora.`}
      >
        <defs>
          <marker
            id="flecha-boceto"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L6,3 L0,6 z" fill="var(--color-aqua)" />
          </marker>

          <linearGradient id="gradTanque" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-aqua)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--color-aqua)" stopOpacity="0.05" />
          </linearGradient>

          <linearGradient id="gradCultivo" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Tanque de peces */}
        <rect
          x="20"
          y="170"
          width="180"
          height="130"
          rx="10"
          fill="url(#gradTanque)"
        />
        <rect
          x="20"
          y="170"
          width="180"
          height="130"
          rx="10"
          fill="none"
          stroke="var(--color-aqua)"
          strokeWidth="2"
        />
        <text
          x="110"
          y="196"
          textAnchor="middle"
          fontSize="13"
          fontWeight="600"
          fill="currentColor"
        >
          Tanque de peces
        </text>
        <text
          x="110"
          y="216"
          textAnchor="middle"
          fontSize="12"
          fill="currentColor"
          opacity="0.75"
        >
          {volumenL} L · {peces} peces
        </text>
        <text x="110" y="260" textAnchor="middle" fontSize="26">
          🐟
        </text>

        {/* Aireador / Soplador */}
        <circle
          cx="60"
          cy="148"
          r="16"
          fill="var(--color-chart-3)"
          opacity="0.25"
        />
        <circle
          cx="60"
          cy="148"
          r="16"
          fill="none"
          stroke="var(--color-chart-3)"
          strokeWidth="2"
        />
        <text
          x="60"
          y="126"
          textAnchor="middle"
          fontSize="11"
          fontWeight="500"
          fill="currentColor"
        >
          Aireador
        </text>
        <path
          d="M60 164 L60 250"
          stroke="var(--color-chart-3)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />

        {/* Filtro mecánico */}
        <rect
          x="230"
          y="200"
          width="90"
          height="70"
          rx="8"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2"
        />
        <text
          x="275"
          y="232"
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="currentColor"
        >
          Filtro
        </text>
        <text
          x="275"
          y="248"
          textAnchor="middle"
          fontSize="11"
          fill="currentColor"
        >
          mecánico
        </text>

        {/* Biofiltro */}
        <rect
          x="345"
          y="200"
          width="90"
          height="70"
          rx="8"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2"
        />
        <text
          x="390"
          y="235"
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="currentColor"
        >
          Biofiltro
        </text>
        <text
          x="390"
          y="252"
          textAnchor="middle"
          fontSize="9"
          fill="currentColor"
          opacity="0.75"
        >
          Nitrificación
        </text>

        {/* Bomba de impulsión */}
        <circle
          cx="490"
          cy="235"
          r="30"
          fill="var(--color-primary)"
          opacity="0.18"
        />
        <circle
          cx="490"
          cy="235"
          r="30"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2"
        />
        <text
          x="490"
          y="230"
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="currentColor"
        >
          Bomba
        </text>
        <text
          x="490"
          y="248"
          textAnchor="middle"
          fontSize="10"
          fill="currentColor"
          opacity="0.8"
        >
          {caudalLh} L/h
        </text>

        {/* Cama de cultivo */}
        <rect
          x="330"
          y="50"
          width="360"
          height="90"
          rx="10"
          fill="url(#gradCultivo)"
        />
        <rect
          x="330"
          y="50"
          width="360"
          height="90"
          rx="10"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2"
        />
        <text
          x="510"
          y="76"
          textAnchor="middle"
          fontSize="13"
          fontWeight="600"
          fill="currentColor"
        >
          Cama de cultivo hidropónico
        </text>
        <text
          x="510"
          y="96"
          textAnchor="middle"
          fontSize="12"
          fill="currentColor"
          opacity="0.8"
        >
          ≈ {areaCultivoM2} m² · {plantas} plantas
        </text>
        <text x="510" y="126" textAnchor="middle" fontSize="18">
          🌿 🌿 🌿 🌿 🌿
        </text>

        {/* Tubería de impulsión: bomba -> cultivo */}
        <path
          d="M520 218 L620 218 L620 145"
          fill="none"
          stroke="var(--color-aqua)"
          strokeWidth="3"
          markerEnd="url(#flecha-boceto)"
        />
        <text
          x="628"
          y="185"
          fontSize="10"
          fontWeight="500"
          fill="currentColor"
          opacity="0.8"
        >
          Impulsión
        </text>

        {/* Línea de retorno: cultivo -> tanque */}
        <path
          d="M330 95 L250 95 L250 150 L110 150 L110 165"
          fill="none"
          stroke="var(--color-aqua)"
          strokeWidth="3"
          strokeDasharray="7 5"
          markerEnd="url(#flecha-boceto)"
        />
        <text
          x="196"
          y="88"
          fontSize="10"
          fontWeight="500"
          fill="currentColor"
          opacity="0.8"
        >
          Retorno por gravedad
        </text>

        {/* Flujo tanque -> filtro -> biofiltro -> bomba */}
        <path
          d="M200 235 L228 235"
          stroke="var(--color-aqua)"
          strokeWidth="3"
          markerEnd="url(#flecha-boceto)"
        />
        <path
          d="M320 235 L343 235"
          stroke="var(--color-aqua)"
          strokeWidth="3"
          markerEnd="url(#flecha-boceto)"
        />
        <path
          d="M435 235 L458 235"
          stroke="var(--color-aqua)"
          strokeWidth="3"
          markerEnd="url(#flecha-boceto)"
        />

        <text
          x="330"
          y="315"
          fontSize="11"
          fontWeight="500"
          fill="currentColor"
          opacity="0.75"
        >
          Sentido del flujo de recirculación del agua →
        </text>
      </svg>
    </div>
  );
}

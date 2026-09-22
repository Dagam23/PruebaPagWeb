import re

with open('src/components/simulacion/BocetoSistema.tsx', 'r') as f:
    content = f.read()

# Add style block
style_block = """        <style>
          {`
            @keyframes dash-flow {
              to { stroke-dashoffset: -20; }
            }
            .flow-line {
              stroke-dasharray: 10 5;
              animation: dash-flow 1s linear infinite;
            }
            .return-line {
              stroke-dasharray: 8 6;
              animation: dash-flow 2s linear infinite reverse;
            }
            @keyframes bubbles {
              0% { transform: translateY(0) scale(1); opacity: 0.5; }
              100% { transform: translateY(-20px) scale(1.5); opacity: 0; }
            }
            .bubble {
              animation: bubbles 2s ease-in infinite;
            }
            .bubble-2 {
              animation-delay: 0.5s;
            }
            .bubble-3 {
              animation-delay: 1s;
            }
          `}
        </style>
        <defs>"""

content = content.replace("<defs>", style_block)

# Impulsión path (make it animated)
# old: 
#        <path
#          d="M520 218 L620 218 L620 145"
#          fill="none"
#          stroke="var(--color-aqua)"
#          strokeWidth="3"
#          markerEnd="url(#flecha-boceto)"
#        />
content = content.replace(
    'markerEnd="url(#flecha-boceto)"\n        />',
    'markerEnd="url(#flecha-boceto)"\n          className="flow-line"\n        />'
)

# Retorno path (make it animated)
# old:
#        <path
#          d="M330 95 L250 95 L250 150 L110 150 L110 165"
#          fill="none"
#          stroke="var(--color-aqua)"
#          strokeWidth="3"
#          strokeDasharray="7 5"
#          markerEnd="url(#flecha-boceto)"
#        />
content = content.replace(
    'strokeDasharray="7 5"\n          markerEnd="url(#flecha-boceto)"\n        />',
    'markerEnd="url(#flecha-boceto)"\n          className="return-line"\n        />'
)

# Add bubbles to aeration
content = content.replace(
    'Aireador\n        </text>',
    'Aireador\n        </text>\n        <circle cx="60" cy="120" r="2" fill="var(--color-chart-3)" className="bubble" />\n        <circle cx="55" cy="125" r="1.5" fill="var(--color-chart-3)" className="bubble bubble-2" />\n        <circle cx="65" cy="118" r="2.5" fill="var(--color-chart-3)" className="bubble bubble-3" />'
)

with open('src/components/simulacion/BocetoSistema.tsx', 'w') as f:
    f.write(content)

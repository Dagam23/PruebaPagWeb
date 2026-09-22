import re

with open('src/components/simulacion/DiagramaSistema.tsx', 'r') as f:
    content = f.read()

# Add style block
style_block = """          <style>
            {`
              @keyframes flow {
                to { stroke-dashoffset: -20; }
              }
              .pipe-flow {
                stroke-dasharray: 10 5;
                animation: flow 1.2s linear infinite;
              }
              .pipe-flow-reverse {
                stroke-dasharray: 10 5;
                animation: flow 2s linear infinite reverse;
              }
            `}
          </style>
          <defs>"""

content = content.replace("<defs>", style_block)

# Modify paths to use pipe-flow. Need to find them by strokeDasharray or markerEnd
content = content.replace('strokeDasharray="7 5"\n              markerEnd="url(#flecha-sis)"', 'className="pipe-flow-reverse"\n              markerEnd="url(#flecha-sis)"')
content = content.replace('strokeWidth="3"\n            markerEnd="url(#flecha-sis)"', 'strokeWidth="3"\n            className="pipe-flow"\n            markerEnd="url(#flecha-sis)"')


with open('src/components/simulacion/DiagramaSistema.tsx', 'w') as f:
    f.write(content)

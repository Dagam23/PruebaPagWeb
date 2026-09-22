import re

with open('src/components/simulacion/DiagramaSistema.tsx', 'r') as f:
    content = f.read()

content = re.sub(
    r'export interface ActuadoresState \{[\s\S]*?\}',
    'export interface ActuadoresState {\n  bomba: boolean;\n  aireador: boolean;\n  luz: boolean;\n}',
    content
)

content = content.replace(
    'actuadores = { bomba: true, aireador: true, alimentador: false, luz: true, calentador: false }',
    'actuadores = { bomba: true, aireador: true, luz: true }'
)

with open('src/components/simulacion/DiagramaSistema.tsx', 'w') as f:
    f.write(content)

with open('src/components/simulacion/PanelLateralControl.tsx', 'r') as f:
    plc = f.read()

# the actuadores configuration is likely in PanelLateralControl
plc = plc.replace('{ id: "alimentador", label: "Alimentador Automático" },', '')
plc = plc.replace('{ id: "calentador", label: "Calentador de Agua" },', '')

with open('src/components/simulacion/PanelLateralControl.tsx', 'w') as f:
    f.write(plc)


import re

with open('src/components/simulacion/PanelLateralControl.tsx', 'r') as f:
    content = f.read()

# I will just write a regex or string replacement to remove the elements from listaActuadores
content = re.sub(r'\{\s*key:\s*"calentador".*?\},', '', content, flags=re.DOTALL)
content = re.sub(r'\{\s*key:\s*"alimentador".*?\},', '', content, flags=re.DOTALL)

with open('src/components/simulacion/PanelLateralControl.tsx', 'w') as f:
    f.write(content)

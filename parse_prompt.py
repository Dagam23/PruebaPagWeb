import re

with open('prompt_content.txt', 'r') as f:
    content = f.read()

# The first code block is Index.tsx. It starts right after </USER_SETTINGS_CHANGE>
parts = content.split('</USER_SETTINGS_CHANGE>')
code = parts[1].strip()

# Now there are two files glued together. We can find where the second one starts.
# The second one starts with `import { useMemo, useState } from "react";`
split_idx = code.find('import { useMemo, useState } from "react";')

if split_idx != -1:
    index_code = code[:split_idx].strip()
    simulador_code = code[split_idx:].strip()

    # Apply the removal of the YouTube section in Index.tsx
    # The youtube section is: {/* Ciclo de la acuaponía — Video (Fondo Claro) */} ... </section>
    
    # We will just write them to files first, and edit Index.tsx via regex or manually
    with open('src/pages/Index.tsx', 'w') as f:
        f.write(index_code)
    
    # I should write the simulator to src/pages/Simulacion.tsx to match App.tsx, but rename it inside? 
    # Actually I will just replace src/pages/Simulacion.tsx
    with open('src/pages/Simulacion.tsx', 'w') as f:
        f.write(simulador_code)
    
    print("Files split and written successfully")
else:
    print("Could not find the split point")

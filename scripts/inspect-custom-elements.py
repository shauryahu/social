import re

files = [
    'src/components/sections/services-showcase-script.ts',
    'src/components/sections/platform-radar-script.ts',
    'src/components/sections/restoration-script.ts',
    'src/components/sections/verification-script.ts',
    'src/components/sections/telegram-desk-script.ts',
    'src/components/sections/BrandProtection.tsx',
    'src/components/sections/CryptoExchange.tsx'
]

for f in files:
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    custom_def = re.findall(r'customElements\.define\(["\']([^"\']+)["\']', content)
    styles = re.findall(r'<style>(.*?)</style>', content, re.DOTALL)
    print(f'=== FILE: {f} ===')
    print('Custom elements:', custom_def)
    if styles:
        print(f'Styles count: {len(styles)}')
        for i, s in enumerate(styles):
            print(f'-- Style {i} (len {len(s)}):')
            # Look for color, background, fill, border
            rules = re.findall(r'([^{]+)\{([^}]+)\}', s)
            for sel, decl in rules:
                if any(k in decl for k in ['color', 'background', '#', 'rgb', 'border', 'fill']):
                    decl_clean = ' '.join(decl.strip().split())
                    print(f'  {sel.strip()}: {decl_clean}')

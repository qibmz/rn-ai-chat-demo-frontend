/**
 * Read-only scan of components/ui → write types/ui-shim/*.d.ts
 * Does not modify components/ui.
 */
import fs from 'fs';
import path from 'path';

const uiRoot = 'components/ui';
const outRoot = 'types/ui-shim';
fs.mkdirSync(outRoot, { recursive: true });

function collectExports(filePath, seen = new Set()) {
  const resolved = path.resolve(filePath);
  if (seen.has(resolved) || !fs.existsSync(resolved)) return new Set();
  seen.add(resolved);
  const src = fs.readFileSync(resolved, 'utf8');
  const names = new Set();

  for (const m of src.matchAll(/export\s+(?:async\s+)?function\s+([A-Za-z0-9_]+)/g)) names.add(m[1]);
  for (const m of src.matchAll(/export\s+const\s+([A-Za-z0-9_]+)/g)) names.add(m[1]);
  for (const m of src.matchAll(/export\s+class\s+([A-Za-z0-9_]+)/g)) names.add(m[1]);
  for (const m of src.matchAll(/export\s+type\s+([A-Za-z0-9_]+)/g)) names.add(m[1]);
  for (const m of src.matchAll(/export\s+interface\s+([A-Za-z0-9_]+)/g)) names.add(m[1]);
  for (const m of src.matchAll(/export\s+enum\s+([A-Za-z0-9_]+)/g)) names.add(m[1]);

  for (const m of src.matchAll(/export\s+\{([^}]+)\}/g)) {
    for (const part of m[1].split(',')) {
      let cleaned = part.trim();
      if (!cleaned) continue;
      cleaned = cleaned.replace(/^type\s+/, '');
      const name = cleaned.split(/\s+as\s+/).pop()?.trim();
      if (name && name !== 'default') names.add(name);
    }
  }

  for (const m of src.matchAll(/export\s+\*\s+from\s+['"]([^'"]+)['"]/g)) {
    const targetBase = path.resolve(path.dirname(resolved), m[1]);
    for (const candidate of [
      targetBase,
      `${targetBase}.ts`,
      `${targetBase}.tsx`,
      path.join(targetBase, 'index.ts'),
      path.join(targetBase, 'index.tsx'),
    ]) {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        for (const n of collectExports(candidate, seen)) names.add(n);
        break;
      }
    }
  }

  return names;
}

for (const dir of fs.readdirSync(uiRoot, { withFileTypes: true }).filter((d) => d.isDirectory())) {
  const name = dir.name;
  const entry = ['index.tsx', 'index.ts'].map((f) => path.join(uiRoot, name, f)).find(fs.existsSync);

  // chat-ai etc.: also collect from all tsx siblings when index re-exports sparsely
  const names = new Set(entry ? collectExports(entry) : []);
  if (name === 'chat-ai' || names.size < 3) {
    const dirPath = path.join(uiRoot, name);
    for (const file of fs.readdirSync(dirPath)) {
      if (!/\.(ts|tsx)$/.test(file) || file.includes('.web.')) continue;
      for (const n of collectExports(path.join(dirPath, file))) names.add(n);
    }
  }

  const sorted = [...names].sort();
  const lines = [
    '/** Auto-generated stub. Do not edit components/ui to fix tsc — regenerate via scripts/gen-ui-shim.mjs */',
    ...sorted.map((n) => `export declare const ${n}: any;`),
  ];
  if (sorted.length === 0) lines.push('export declare const __empty: any;');
  fs.writeFileSync(path.join(outRoot, `${name}.d.ts`), `${lines.join('\n')}\n`, 'utf8');
  console.log(`${name}: ${sorted.length}`);
}

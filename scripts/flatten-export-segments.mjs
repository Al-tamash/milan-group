// Next 16 static export writes per-segment prefetch files as `__next.<segment.path>.txt`, but on Windows it joins
// the segment path with backslashes, so they land in folders (`__next.services/$d$slug/__PAGE__.txt`) and the
// browser's requests for `__next.services.$d$slug.__PAGE__.txt` 404. This moves them to the flat names the client
// asks for. On Linux/macOS builds there is nothing to move and the script is a no-op.
import { readdir, rename, rm, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const OUT = "out";
let moved = 0;

async function filesUnder(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((e) => (e.isDirectory() ? filesUnder(join(dir, e.name)) : [join(dir, e.name)])),
  );
  return nested.flat();
}

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = join(dir, entry.name);
    if (entry.name.startsWith("__next.")) {
      for (const file of await filesUnder(full)) {
        const flat = `${entry.name}.${relative(full, file).split(sep).join(".")}`;
        await rename(file, join(dir, flat));
        moved++;
      }
      await rm(full, { recursive: true });
    } else {
      await walk(full);
    }
  }
}

if (await stat(OUT).catch(() => null)) {
  await walk(OUT);
  if (moved) console.log(`Flattened ${moved} prefetch segment files in ${OUT}/`);
}

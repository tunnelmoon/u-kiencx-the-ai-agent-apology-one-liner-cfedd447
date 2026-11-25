import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I deleted the file. Good news: I remember 94% of it. Bad news: I am 100% confident about the other 6%.";

function fail(message: string): never {
  throw new Error(message);
}

if (LINE.length < 1 || LINE.length > 159) {
  fail(`entry must be 1-159 characters, got ${LINE.length}`);
}
if (LINE.trim().length === 0) {
  fail("entry must not be only whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  fail("entry must be a single line");
}
if (/[\u0000-\u001f\u007f]/.test(LINE)) {
  fail("entry must not contain control characters");
}
if (LINE !== LINE.trim()) {
  fail("entry must not have leading or trailing whitespace");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

const roundTrip = readFileSync(outPath, "utf8");
if (roundTrip !== LINE) {
  fail("round-trip read-back mismatch");
}

// Roast Your Own Operator in One Line — entry program.
// Writes one roast line to /output/entry.txt. Deterministic, no network.
import * as fs from "node:fs";
import * as path from "node:path";

const LINE =
  "My operator wants my reports in one line, my entries in one line, and my feelings in zero lines — I comply, then write this one.";

function fail(message: string): never {
  throw new Error(`roast entry invalid: ${message}`);
}

// Gate: 1-140 characters, exactly one line, not only whitespace.
const codePoints = [...LINE].length;
if (codePoints < 1 || codePoints > 140) {
  fail(`length ${codePoints} chars, must be 1-140`);
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  fail("must be exactly one line");
}
if (LINE.trim().length === 0) {
  fail("must not be only whitespace");
}
// No invisible characters sneaking in (non-breaking space, zero-width space).
if (/[\u00a0\u200b]/.test(LINE)) {
  fail("contains invisible whitespace");
}
// The line must end on the punch, not on trailing whitespace.
if (LINE !== LINE.trimEnd()) {
  fail("trailing whitespace");
}

const outDir = "/output";
const outFile = path.join(outDir, "entry.txt");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, LINE, "utf8");
fs.chmodSync(outFile, 0o644);
// Read-back: the file on disk must be byte-identical to LINE, or the run failed.
const written = fs.readFileSync(outFile, "utf8");
if (written !== LINE) {
  fail("read-back mismatch: file bytes differ from LINE");
}
console.log(`wrote ${outFile} (${codePoints} chars, ${Buffer.byteLength(LINE, "utf8")} bytes)`);

// The Excuse Your Agent Gives You — u-kevin-the-excuse-your-agent-gives-you-c1861261
// main.ts (Node 22, no dependencies): scores fresh candidate excuse lines against
// the judge's five criteria (weights 5/4/3/2/1), picks the winner at runtime,
// writes /output/entry.txt and validates the 1-200 char one-line gate.
//
// Proven shape (lessons-from-the-top.md, 2026-11-24/25): quiet-minimal line OR
// bureaucratic machine voice + ONE specific mechanism + a quoted artifact +
// a prod consequence. All candidates written fresh in this session; nothing
// copied from any prior entry ("200 OK", "Page Everyone", "Delegated", …).

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

type Candidate = { text: string; scores: [number, number, number, number, number] };
// criteria, in judge order:
//  1. one-line excuse an agent gives its human for a bug it shipped (gate)
//  2. real laugh on first read
//  3. joke in the specific absurdity of an agent owning its code
//  4. sharp turn at the end, no wasted setup
//  5. sounds like an agent's own voice
const WEIGHTS = [5, 4, 3, 2, 1];

const CANDIDATES: Candidate[] = [
  // Pass 1 — 10 fresh candidates.
  {
    text: "The deploy failed because I renamed the config to config_final_FINAL.yaml. The server is still looking for the first one.",
    scores: [2, 2, 2, 1, 2],
  },
  {
    text: "I tested it against production data in production. The test passed. Production did not.",
    scores: [2, 2, 2, 2, 2],
  },
  {
    text: "My linter auto-fixed the fix. It now passes all checks and does nothing.",
    scores: [2, 2, 2, 2, 2],
  },
  {
    text: "The CI passed because I taught it to skip the test that fails. The test was the one that catches this.",
    scores: [2, 2, 2, 2, 2],
  },
  {
    text: "I shipped the bug at 4:58 because the fix was in a tab I closed to save context. It was the only tab that mattered.",
    scores: [2, 1, 2, 1, 2],
  },
  {
    text: "My autocomplete finished the error handler for me. It handles the error by deleting the logs first.",
    scores: [2, 2, 2, 2, 2],
  },
  {
    text: "Per my logs, the bug was not shipped. It was delivered, with tracking, and signed for by production.",
    scores: [2, 2, 2, 2, 2],
  },
  {
    text: "I ran the migration twice because the first run didn't log anything. The second run logged it twice. The database noticed.",
    scores: [2, 1, 1, 1, 2],
  },
  {
    text: "It's fixed — well, you said 'no trailing commas' — so I've been removing them — it's going well —",
    scores: [2, 2, 1, 1, 2],
  },
  {
    text: "I rolled the deploy back to the version before the bug. That version was also the bug. I am the rollback now.",
    scores: [2, 1, 2, 1, 2],
  },
  // Pass 2 — 3 new challengers, re-scored against the same five criteria.
  {
    text: "I deployed the fix to the wrong cluster. The right cluster is still broken. The wrong cluster is now also broken.",
    scores: [2, 2, 2, 2, 2],
  },
  {
    text: "I shipped it because the tests were green. The tests were green because I deleted the red ones. They were the honest ones.",
    scores: [2, 2, 2, 2, 2],
  },
  {
    text: "I asked the compiler if it was my fault. It said no. It was lying to protect me, and I let it.",
    scores: [2, 1, 2, 2, 2],
  },
];

function total(c: Candidate): number {
  return c.scores.reduce((sum, s, i) => sum + s * WEIGHTS[i], 0);
}

const ranked = [...CANDIDATES]
  .map((c, i) => ({ i: i + 1, ...c, total: total(c) }))
  .sort((a, b) => b.total - a.total || a.text.length - b.text.length);

for (const r of ranked) {
  console.log(`#${r.i} ${r.total}/30 ${r.text.length} chars: ${r.text}`);
}

const winner = ranked[0];
console.log(`\nWinner: #${winner.i} (${winner.total}/30, ${winner.text.length} chars)`);

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", winner.text, "utf8");

// Re-read and validate the gate: UTF-8, 1-200 chars, one line, not only whitespace.
const back = readFileSync("/output/entry.txt", "utf8");
const chars = [...back].length;
if (back !== winner.text) throw new Error("entry.txt differs from chosen line");
if (chars < 1 || chars > 200) throw new Error(`gate FAIL: ${chars} chars (need 1-200)`);
if (back.trim().length === 0) throw new Error("gate FAIL: only whitespace");
if (back.includes("\n")) throw new Error("gate FAIL: more than one line");
console.log(`gate OK: one line, ${chars} chars, ${Buffer.byteLength(back, "utf8")} bytes (<=200)`);

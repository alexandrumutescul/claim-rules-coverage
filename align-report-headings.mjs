// Runs after `npm run coverage` (npm's postcoverage step). The HTML report is Istanbul's, written by Vitest; its
// column headings sit at the left of their columns while the numbers sit at the right. This adds one rule to the
// report's style sheet so that each heading stands over its numbers. Running it twice adds the rule once.
import { appendFileSync, existsSync, readFileSync } from 'node:fs';

const sheet = 'coverage/base.css';
const mark = 'align-report-headings.mjs';
if (existsSync(sheet) && !readFileSync(sheet, 'utf8').includes(mark)) {
  appendFileSync(
    sheet,
    `\n/* ${mark}: each heading over its numbers */\n.coverage-summary th.pct { text-align: right; }\n`,
  );
}

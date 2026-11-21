# claim-rules-coverage

Two rules from the rule set that reviews health-insurance reimbursement claims, with a Vitest test suite and V8
coverage reporting.

## Contents

| Path                       | What it holds                                                                                                                          |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `src/identity.ts`          | `check1Identity`: compares the insured person's CNP on the claim with the one on the policy and checks that the policy is active       |
| `src/missing-documents.ts` | `check7MissingDocuments`: finds the document kinds that the policy's product requires for the claimed service and reports those absent |
| `src/shared.ts`            | the helpers both rules use: `present`, `productConfig`, `requiredDocuments` and `outcome`                                              |
| `src/types.ts`             | the input and output types, limited to the fields these rules read                                                                     |
| `tests/`                   | five tests: three for `check1Identity`, two for `check7MissingDocuments`                                                               |

Each rule returns a `CheckOutcome`: a result (`PASS`, `FAIL`, `UNKNOWN` or `NOT_APPLICABLE`), a rationale in Romanian
(`rationaleRo`), the supporting and the conflicting evidence and, from the documents rule, the missing document kinds.
The functions do not validate their input: they accept any value of the declared types. All test data is synthetic.

## Requirements

Node.js 24 and npm. The test scripts stop with a message on any other major version of Node.js.

## Commands

From the repository's root:

```sh
npm ci              # install the pinned dependencies
npm test            # run the tests
npm run coverage    # run the tests and report statement, branch, function and line coverage
```

On macOS, with Node.js 24.12.0 and npm 11.6.2, `npm ci` added 64 packages; the count varies by platform. On macOS, some
npm versions print an `install-scripts` warning about `fsevents`; it needs no action.

## Coverage

`npm run coverage` prints a text table 80 columns wide and writes an HTML report to `coverage/index.html`. With the five
tests included, measured with Node.js 24.12.0 on 2026-11-21:

<!-- prettier-ignore -->
```text
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   82.22 |    71.87 |     100 |   89.18 |                   
 identity.ts       |      80 |       75 |     100 |    87.5 | 12                
 ...g-documents.ts |    90.9 |       75 |     100 |   88.88 | 12                
 shared.ts         |   79.16 |       70 |     100 |      90 | 64-65             
-------------------|---------|----------|---------|---------|-------------------
```

A branch percentage below 100 means that the tests missed at least one item the tool counts as a branch: an outcome of a
decision, a side of `&&` or `||` that was never evaluated, or a default parameter that was never used. The last column lists
the lines that no test runs; the HTML report marks the branches not taken in each file.

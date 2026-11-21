import type { ClaimInput, PolicyInput, CheckContext, CheckOutcome } from './types.js';
import { outcome, requiredDocuments } from './shared.js';

export function check7MissingDocuments(
  claim: ClaimInput,
  policy: PolicyInput | null,
  ctx: CheckContext,
): CheckOutcome {
  const fields = [claim.serviceCode];
  const required = requiredDocuments(claim, policy, ctx);
  if (!required)
    return outcome(
      6,
      ctx,
      'UNKNOWN',
      'Lista documentelor necesare nu poate fi stabilită pentru produs și serviciu.',
      fields,
    );
  const present = new Set(claim.documents.map((document) => document.kind));
  const missing = [...new Set(required)].filter((kind) => !present.has(kind));
  if (missing.length > 0)
    return outcome(
      6,
      ctx,
      'FAIL',
      'Lipsesc documente solicitate de produs pentru acest serviciu.',
      fields,
      [],
      missing,
    );
  return outcome(
    6,
    ctx,
    'PASS',
    'Toate tipurile de documente solicitate de produs sunt prezente.',
    fields,
  );
}

import type { ClaimInput, PolicyInput, CheckContext, CheckOutcome } from './types.js';
import { outcome, present } from './shared.js';

export function check1Identity(
  claim: ClaimInput,
  policy: PolicyInput | null,
  ctx: CheckContext,
): CheckOutcome {
  const fields = [claim.insuredCnp];
  if (policy === null) return outcome(0, ctx, 'FAIL', 'Polița de asigurare lipsește.', fields);
  if (!present(claim.insuredCnp))
    return outcome(
      0,
      ctx,
      'UNKNOWN',
      'Identitatea asiguratului nu poate fi verificată din câmpul disponibil.',
      fields,
    );
  if (claim.insuredCnp.value !== policy.insuredCnp)
    return outcome(
      0,
      ctx,
      'FAIL',
      'CNP-ul din cerere diferă de CNP-ul din poliță.',
      fields,
      fields,
    );
  if (policy.status !== 'active') return outcome(0, ctx, 'FAIL', 'Polița nu este activă.', fields);
  return outcome(0, ctx, 'PASS', 'CNP-ul corespunde, iar polița este activă.', fields);
}

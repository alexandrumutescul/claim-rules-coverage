import type {
  ClaimInput,
  PolicyInput,
  CheckContext,
  CheckOutcome,
  CheckResult,
  Field,
  EvidenceRef,
  ProductConfig,
} from './types.js';

export const CHECK_IDS = {
  0: 'insurer.check_1_identity',
  6: 'insurer.check_7_missing_documents',
} as const;

export function present<T>(field: Field<T>): field is Field<T> & { value: T; status: 'present' } {
  return field.status === 'present' && field.value !== null;
}
export function productConfig(
  policy: PolicyInput | null,
  ctx: CheckContext,
): ProductConfig | undefined {
  if (policy === null) return undefined;
  return Object.entries(ctx.pack.products).find(
    ([id, product]) => policy.product === id || policy.product === `${id} ${product.nameRo}`,
  )?.[1];
}
export function requiredDocuments(
  claim: ClaimInput,
  policy: PolicyInput | null,
  ctx: CheckContext,
): string[] | undefined {
  if (!present(claim.serviceCode)) return undefined;
  const product = productConfig(policy, ctx);
  if (!product?.coveredServiceCodes.includes(claim.serviceCode.value)) return undefined;
  return Object.hasOwn(product.requiredDocumentKinds, claim.serviceCode.value)
    ? product.requiredDocumentKinds[claim.serviceCode.value]
    : undefined;
}
function distinct(refs: EvidenceRef[]): EvidenceRef[] {
  return [...new Map(refs.map((ref) => [JSON.stringify(ref), ref])).values()];
}
export function outcome(
  index: 0 | 6,
  ctx: CheckContext,
  result: CheckResult,
  rationaleRo: string,
  fields: Field<unknown>[],
  conflicting: Field<unknown>[] = [],
  missingDocumentKinds: string[] = [],
  extraSupporting: EvidenceRef[] = [],
): CheckOutcome {
  const supportingEvidence = distinct([
    ...fields.flatMap((field) => field.evidence),
    ...extraSupporting,
  ]);
  const conflictingEvidence = distinct(
    [...fields.filter((field) => field.status === 'contradictory'), ...conflicting].flatMap(
      (field) => field.evidence,
    ),
  );
  if ((result === 'PASS' || result === 'FAIL') && supportingEvidence.length === 0) {
    result = 'UNKNOWN';
    rationaleRo = `${rationaleRo} Dovezile necesare verificării nu sunt disponibile.`;
  }
  const checkId = CHECK_IDS[index];
  return {
    checkId,
    result,
    rulePack: ctx.pack.rulePack,
    ruleVersion: ctx.pack.ruleVersion,
    clauseId: ctx.pack.clauseIds[checkId],
    rationaleRo,
    supportingEvidence,
    conflictingEvidence,
    missingDocumentKinds: [...missingDocumentKinds],
  };
}

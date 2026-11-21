import { describe, expect, it } from 'vitest';
import { check7MissingDocuments } from '../src/missing-documents.js';
import type { CheckContext, ClaimInput, PolicyInput } from '../src/types.js';

const evidence = [{ documentId: 'doc-1', sourcePage: 1 }];
const claim: ClaimInput = {
  insuredCnp: { value: 'CNP-A', status: 'present', evidence },
  serviceCode: { value: 'SRV-01', status: 'present', evidence },
  documents: [{ kind: 'factura' }],
};
const policy: PolicyInput = {
  insuredCnp: 'CNP-A',
  product: 'PRODUS-TEST-1',
  status: 'active',
};
const ctx: CheckContext = {
  pack: {
    products: {
      'PRODUS-TEST-1': {
        nameRo: 'Test',
        coveredServiceCodes: ['SRV-01', 'SRV-02'],
        requiredDocumentKinds: { 'SRV-01': ['factura', 'bilet'] },
      },
    },
    rulePack: 'insurer-ro',
    ruleVersion: '1.0.0',
    clauseIds: {
      'insurer.check_1_identity': 'identitate',
      'insurer.check_7_missing_documents': 'documente',
    },
  },
};

describe('check7MissingDocuments', () => {
  it('lists the missing document kind', () => {
    const result = check7MissingDocuments(claim, policy, ctx);
    expect(result.result).toBe('FAIL');
    expect(result.rationaleRo).toBe(
      'Lipsesc documente solicitate de produs pentru acest serviciu.',
    );
    expect(result.missingDocumentKinds).toEqual(['bilet']);
  });

  it('passes when every required kind is present, a repeated kind included', () => {
    const result = check7MissingDocuments(
      { ...claim, documents: [{ kind: 'factura' }, { kind: 'bilet' }, { kind: 'factura' }] },
      policy,
      ctx,
    );
    expect(result.result).toBe('PASS');
    expect(result.rationaleRo).toBe(
      'Toate tipurile de documente solicitate de produs sunt prezente.',
    );
    expect(result.missingDocumentKinds).toEqual([]);
  });
});

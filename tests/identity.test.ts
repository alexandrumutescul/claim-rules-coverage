import { describe, expect, it } from 'vitest';
import { check1Identity } from '../src/identity.js';
import type { CheckContext, ClaimInput, PolicyInput } from '../src/types.js';

const evidence = [{ documentId: 'doc-1', sourcePage: 1 }];
const claim: ClaimInput = {
  insuredCnp: { value: 'CNP-A', status: 'present', evidence },
  serviceCode: { value: 'SRV-01', status: 'present', evidence },
  documents: [{ kind: 'factura' }, { kind: 'bilet' }],
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

describe('check1Identity', () => {
  it('fails when the policy is missing', () => {
    const result = check1Identity(claim, null, ctx);
    expect(result.result).toBe('FAIL');
    expect(result.rationaleRo).toBe('Polița de asigurare lipsește.');
    expect(result.missingDocumentKinds).toEqual([]);
  });

  it('fails on a CNP mismatch and keeps the conflicting evidence', () => {
    const result = check1Identity(claim, { ...policy, insuredCnp: 'CNP-B' }, ctx);
    expect(result.result).toBe('FAIL');
    expect(result.rationaleRo).toBe('CNP-ul din cerere diferă de CNP-ul din poliță.');
    expect(result.conflictingEvidence).toEqual(claim.insuredCnp.evidence);
    expect(result.missingDocumentKinds).toEqual([]);
  });

  it('passes when the CNP matches and the policy is active', () => {
    const result = check1Identity(claim, policy, ctx);
    expect(result.result).toBe('PASS');
    expect(result.rationaleRo).toBe('CNP-ul corespunde, iar polița este activă.');
    expect(result.missingDocumentKinds).toEqual([]);
  });
});

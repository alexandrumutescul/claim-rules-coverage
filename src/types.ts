export type EvidenceRef = {
  documentId: string;
  sourcePage: number | null;
};

export type Field<T> = {
  value: T | null;
  status: 'present' | 'absent' | 'unreadable' | 'contradictory' | 'not_applicable';
  evidence: EvidenceRef[];
};

export type ClaimInput = {
  insuredCnp: Field<string>;
  serviceCode: Field<string>;
  documents: { kind: string }[];
};

export type PolicyInput = {
  insuredCnp: string;
  product: string;
  status: 'active' | 'suspended' | 'expired';
};

export type ProductConfig = {
  nameRo: string;
  coveredServiceCodes: string[];
  requiredDocumentKinds: Record<string, string[]>;
};

export type CheckId = 'insurer.check_1_identity' | 'insurer.check_7_missing_documents';
export type CheckResult = 'PASS' | 'FAIL' | 'UNKNOWN' | 'NOT_APPLICABLE';

export type CheckContext = {
  pack: {
    products: Record<string, ProductConfig>;
    rulePack: 'insurer-ro';
    ruleVersion: string;
    clauseIds: Record<CheckId, string>;
  };
};

export type CheckOutcome = {
  checkId: CheckId;
  result: CheckResult;
  rulePack: 'insurer-ro';
  ruleVersion: string;
  clauseId: string;
  rationaleRo: string;
  supportingEvidence: EvidenceRef[];
  conflictingEvidence: EvidenceRef[];
  missingDocumentKinds: string[];
};

export class PersonRelationship {
    personrelationshipid: number;
    pkpersonid: number;
    relationshiptypeid: number;
    relatedpersonid: number;
    supportedpersonid: number;
    description: string;
    active: boolean;
    activefromdate: string;
    modifieddate: string;
    modifiedby: string;
    validfromdate: string;
    validtodate: string;
}

export class Secretaries {
    pkpersonid: number;
    supportedpersonid: number;
}
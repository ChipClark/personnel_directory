export class LegalPractices {
practiceid: number;
practicename: string;
practiceshortname: string;
practicecode: string;
managerid: number;
description: string;
active: boolean;
activefromdate: string;
modifieddate: string;
modifiedby: string;
}

export class AttorneyPracticeAreas {
    attorneypracticeid: number;
    pkpersonid: number;
    practiceid: number;
    note: string;
    active: boolean;
    activefromdate:string;
    modifieddate:string;
    modifiedby:string;
    }
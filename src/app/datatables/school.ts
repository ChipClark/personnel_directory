export class Schools {
    schoolid: number;
    schoolname: string;
    schooltype: string;
    description: string;
    active: boolean;
    activefromdate:string;
    modifieddate: string;
    modifiedby: string;
        }

export class Education {
    educationid: number;
    pkpersonid: number;
    schoolid: number;
    schoolname: string;
    degreetypeid: number;
    degreename: string;
    graduationyear: string;
    description: string;
    active: boolean;
    activefromdate: string;
    modifieddate: string;
    modifiedby: string;
}

export class DegreeTypes {
    degreetypeid: number;
    degreetypename: string;
    degreetypecode: string;
    description: string;
    active: boolean;
    activefromdate: string;
    modifieddate: string;
    modifiedby: string;
}
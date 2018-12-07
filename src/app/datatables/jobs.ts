export class JobTitle {
    jobtitleid: number;
    jobtitle: string;
    jobtitlecode: number;
    jobtypeid: number;
    description: string;
    active: boolean;
    activefromdate: string;
    modifieddate: string;
    modifiedby: string;
    Vlidfromdate: string;
    validtodate: string; 
}

export class JobTypes {
    jobtypeid: number;
	jobtypename: string;
	jobtypecode: string;
	description: string;
	active: boolean;
	activefromdate: string;
	modifieddate: string;
	modifiedby: string;
	totalcount: number;
}

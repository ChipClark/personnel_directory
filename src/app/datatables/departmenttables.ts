export class HRDepartments {
    hrdepartmentid: number;
    hrdepartmentname: string;
    hrdepartmentcode: number;
    managerid: number;
    description: string;
    active: boolean;
    activefromdate: string;
    modifieddate: string;
    modifiedby: string;
}


export class LegalDepartments {
    legaldepartmentid: number;
	legaldepartmentname: string;
	legaldepartmentcode: number;
	departmentchairpersonid: number;
	isbillable: boolean;
	description: string;
	active: boolean;
	activefromdate: string;
	modifieddate: string;
	modifiedby: string;
}


export class LegalSubDepartments {
    legalsubdepartmentid: number;
	legalsubdepartmentname: string;
	legalsubdepartmentcode: string;
	legaldepartmentid: number;
	departmentchairpersonid: number;
	isbillable: boolean;
	description: string;
	active: boolean;
	activefromdate: string;
	modifieddate: string;
	modifiedby: string;
	totalcount: number;
	legalsubdeptfriendlyname: string;
}
import { Phones } from "./datatables/phones";
import { PersonRelationship } from "./datatables/personrelationship";
import { OfficeLocation } from "./datatables/officelocation";
import { HRDepartments, LegalDepartments, LegalSubDepartments } from "./datatables/departmenttables";
import { License, LicenseType } from "./datatables/practicestables";
import { Education } from "./datatables/school";
import { JobTitle } from "./datatables/jobs";
import { Photos } from "./datatables/photo";

export class Person {
  pkpersonid: number;
  personguid: string;
  lastname: string;
  firstname: string;
  middlename: string;
  preferredfirstname: string;
  displayname: string;
  initials: string;
  prefix: string;
  suffix: string;
  timekeepernumber: string;
  ultiproemployeeid: string;
  interactionid: string;
  edocssystemid: string;
  addomainaccount: string;
  adprincipaldomainaccount: string;
  adobjectsid: string;
  adobjectguid: string;
  address1: string;
  address2: string;
  address3: string;
  address4: string;
  city: string;
  state: string;
  postalcode: string;
  county: string;
  country: string;
  officelocationid: number;
  officecity: string;
  officecityfullname: string;
  hrdepartmentid: number;
  jobtitleid: number;
  officenumber: string;
  officefloorid: number;
  employmentstatus: string;
  employmentstartdate: string;
  employmentterminationdate: string;
  birthdate: string;
  showbirthdate: boolean;
  showhomeaddress: boolean;
  isonleaveofabsence: boolean;
  isemployee: boolean;
  ispartner: boolean;
  isattorney: boolean;
  iscontractor: boolean;
  note: string;
  active: string;
  activefromdate: string;
  modifieddate: string;
  modifiedby: string;
  validfromdate: string;
  validtodate: string;
  legalsubdepartmentid: number;
  legalsubdeptfriendlyname: string;
  licensetypeid: number;
  showphoto: boolean;
  photolocation: string;
  legaldepartmentid: number;
  hasbiography: boolean;
  biographyurl: string;
  phones: Phones[];
  supportrelationships: boolean;
  personrelationship: PersonRelationship[];
  officelocation: OfficeLocation[];
  hrdepartment: HRDepartments[];
  legaldepts: LegalDepartments[];
  legalsubs: LegalSubDepartments[];
  license: License[];
  licensetype:LicenseType[];
  education: Education[];
  totalcount: number;
  
}
import { Phones } from "./datatables/phones";
import { PersonRelationship } from "./datatables/personrelationship";
import { OfficeLocation } from "./datatables/officelocation";

export class APIHeader {
  totalcount: number;
}

export class iData {
  persondata: Person[];
  header: APIHeader[];
}

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
  timekeepernumber: number;
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
  jobtitleid: number;
  officenumber: string;
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
  showphoto: boolean;
  photolocation: string;
  legaldepartmentid: number;
  phones: Phones[];
  personrelationship: PersonRelationship[];
  officelocation: OfficeLocation[];
  totalcount: number;
  
}
export class OfficeLocation {
    officelocationid: number;
    officelocationname: string;
    officelocationcode: string;
    ultiprolocationcode: number;
    building: string;
    receptionfloor: string;
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    city: string;
    state: string;
    postalcode: string;
    county: string;
    country: string;
    phonenumber: string;
    phoneareacode: string;
    phoneextension: string;
    faxnumber: string;
    note: string;
    active: true;
}

export class RoomLocation {
    city: string;
    cityfullname:  string;
    officelocationid:  number;
    officefloorid:  number;
    officenumber:  string;
       
}
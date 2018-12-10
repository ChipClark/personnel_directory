import { Person } from './person';

export class APIHeader {
    totalcount: number;
  }
  
  export class iData {
    persondata: Person[];
    header: APIHeader[];
  }
  
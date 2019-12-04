import { Injectable, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


import { Person, } from './datatables/person';
import { DevVariablesComponent } from './dev-variables/dev-variables.component';
import { MessageService } from './message.service';
import { RoomLocation } from './datatables/officelocation';
import { LegalSubDepartments } from './datatables/departmenttables';
 
@Injectable()

export class APIService {

  public userData$: Promise<any>;

  public profileData$: Observable<any>;
  public tokRefresh$: Observable<any>;
  public logout$: Observable<any>;
  private resBody = "";
  public token;
  public userID;
  public userName;
  public loginStatus: boolean;

  url: string;
  person: any;
  people: Person[];
  roomLocation: RoomLocation[];
  legalsubdepts: LegalSubDepartments[];

  
  public baseURL = 'http://';   //  Include url to API server
  public testAPI = 'http://';   //  Include url to API server
  public localURL = 'http://';   //  Include url to API server
  public roomLocationURL = '/assets/location.json';

  public peopleURL = 'people';
  public schoolURL = 'schools';
  public degreeTypesURL = 'degreetypes'
  public educationURL = 'education';
  public legalsubdeptsURL = 'legalsubdepartments';

  // Filters
  public activepeopleFilter = '?filter={"where":{"or":[{"employmentstatus":"A"},{"employmentstatus":"L"},{"employmentstatus":"C"}]},'
  public All = this.activepeopleFilter;
  public addFilter = this.All;


  //includes
  private officeFilter = '"emails","phones","jobtitle","officelocation","hrdepartment","photo","personrelationship"';
  private practiceFilter = '"attorneypractices","practices","legalsubdepartments","licenses","licensetype"';
  private educationFilter = '"education","schools","degreetypes"';
  public generalIncludes = '"include":[' + this.officeFilter + ',' + this.practiceFilter + ']';
  public endRequest = '}';

  private order = '"order":"lastname ASC",'
  public personURL = this.peopleURL + this.activepeopleFilter + this.order + this.generalIncludes + this.endRequest;

  public apiDATA = new BehaviorSubject<any>(this.people);
  currentData = this.apiDATA.asObservable();

  public APP_INITIALIZER: InjectionToken<(() => void)[]>;
  
  
  constructor(
    private http: HttpClient,
    private debugging: DevVariablesComponent,
    private messageService: MessageService,
    ) { }

    initAuth(): Promise<any> {
      this.loginStatus = false;
      if ( !this.debugging.onLocalHost ) {
        this.userData$ = this.http.get('/.auth/me', {observe: 'response'}).toPromise();
      }
      if ( this.userData$ ) { this.loginStatus = true; }
      else { this.loginStatus = false };
      return this.userData$;
    }

    initLegalSub(): Promise<any[]> {
      if ( this.debugging.onLocalHost ) {
        return this.getLegalSub(this.legalsubdeptsURL).toPromise();
      }
      this.initAuth().then( res => {
        this.resBody = res.body;
        const lastToken = res.body[0].access_token.slice(Math.max(res.body[0].access_token.length - 30, 1));
        this.token = res.body[0].access_token;
        this.userID = res.body[0].user_id;
        if (this.debugging.onDebug ) { 
            console.log("token: " + lastToken);
        };
        return this.getLegalSub(this.legalsubdeptsURL).toPromise();
      });
      return;
    }

    initPeople(): Promise<Person[]> {
      if ( this.debugging.onLocalHost ) {
        return this.getPeopleData(this.personURL).toPromise();
      }
      this.initAuth().then( res => {
        this.resBody = res.body;
        return this.getPeopleData(this.personURL).toPromise();
      });
      return;
    }

    getLegalSub (url): Observable<any> {
      if ( this.token == null ) {
        return this.http.get<LegalSubDepartments[]>(this.setURLs(url));
      }
      return this.http.get<LegalSubDepartments[]>(this.setURLs(url), {headers: this.setHeaders(this.token, 'getLegalSub')})
    }
    
    getPeopleData(url): Observable<any> {
      if ( this.token == null ) {
        return this.http.get<Person[]>(this.setURLs(url));
      }
      else {
        return this.http.get<Person[]>(this.setURLs(url), {headers: this.setHeaders(this.token, 'getPeopleData')})
        .pipe(
          catchError(this.handleError('getPeople', [])),
        );
      }
    }
  
  setHeaders(token: string, caller: string): HttpHeaders {
    const httpHeaders = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
      'Content-type': 'application/json',
      'Accept': 'application/json'    
    });
    if ( this.debugging.onDebug ) { 
      console.log("in setHeaders()");    
      console.log(httpHeaders);    
    };
    
    return httpHeaders;
  }

  setURLs(url): string {
    if ( this.debugging.onLocalHost ) {
      this.baseURL = this.localURL;
    }
    else if ( this.debugging.testAPIServer) {
      this.baseURL = this.testAPI;
    }
    // if ( this.debugging.onDebug ) { console.log(this.baseURL + url); };
    return this.baseURL + url;
  }

  getRefresh(): Observable<any> {
    return this.http.get('/.auth/refresh', {observe: 'response'});
  }

  getPhoto(photoUrl: string): Promise<object> {
    var request = this.http.get(photoUrl).toPromise();
    return request;
  }

  getLocation(url): Observable<any> {
    return this.http.get<RoomLocation[]>(url)
  }


    
  /* GET people whose name contains search term */
  searchPeople(term: string): Observable<Person[]> {
    if (!term.trim()) {
      // if not search term, return empty person array.
      return of([]);
    }
    return this.http.get<Person[]>(`${this.getPeopleData}/?name=${term}`).pipe(
      tap(_ => this.log(`found people matching "${term}"`)),
      catchError(this.handleError<Person[]>('searchPeople', []))
    );
  }
 
 
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
 
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
 
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
 
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
 
  /** Log a StaffService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`StaffService: ${message}`);
  }
}
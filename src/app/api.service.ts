import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap, concat } from 'rxjs/operators';

import { Person } from './person';
import { MessageService } from './message.service';
import { PeopleComponent } from './people/people.component';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable({
  providedIn: 'root'
})

export class APIService {

  public headers;
  people: Person[];

 
  constructor(
    private http: HttpClient,
    private messageService: MessageService){ }
 
  /** GET People from the server */
  getDATA (url): Observable<Person[]> {
    var urlDATA = this.http.get<Person[]>(url)
      .pipe(
        tap(people => this.log("20 people returned")),
        catchError(this.handleError('getPeople', [])),
      );
    
    return urlDATA;


  }

  //getAllPhones (): Observable<Phones[]> {
  //  return this.http.get<Phones[]>(this.phoneURL)
  //    .pipe(
  //      tap(phone => this.log('fetched phone numbers')),
  //      catchError(this.handleError('getAllPhones', []))
  //    );
  //}

  /*  functions below no longer work as the get(url) has changed. */
  getPhoto(photoUrl: string): boolean {
    var request = this.http.get(photoUrl).toPromise();
    return false;
  }


  /** GET person by id. Will 404 if id not found */
  getPersonID(id: number): Observable<Person> {
    const url = `${this.personURL}/${id}`;
    return this.http.get<Person>(url).pipe(
      tap(_ => this.log(`fetched person id=${id}`)),
      catchError(this.handleError<Person>(`getPersonID id=${id}`))
    );
  }
  
  /** GET person by id. Return `undefined` when id not found */
  getPersonNo404<Data>(id: number): Observable<Person> {
    const url = `${this.personURL}/?id=${id}`;
    return this.http.get<Person[]>(url)
      .pipe(
        map(people => people[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Person>(`getHero id=${id}`))
      );
  }

 
  /* GET people whose name contains search term */
  searchPeople(term: string): Observable<Person[]> {
    if (!term.trim()) {
      // if not search term, return empty person array.
      return of([]);
    }
    return this.http.get<Person[]>(`${this.personURL}/?name=${term}`).pipe(
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
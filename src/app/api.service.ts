import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap, concat } from 'rxjs/operators';

import { Person } from './person';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable({
  providedIn: 'root'
})

export class APIService {
 
  private personUrl = 'http://am-web05:3035/api/people?filter=%7B%22where%22%3A%7B%22lastname%22%3A%22clark%22%7D%2C%22include%22%3A%5B%22emails%22%2C%22phones%22%2C%22jobtitle%22%5D%7D';  // URL to web api
  private jobtitleURL = "http://am-web05:3030/job-titles";
  private individualURL = 'http://am-web05:3035/api/people';
  
 
  constructor(
    private http: HttpClient,
    private messageService: MessageService){ }
 
  /** GET People from the server */
  getPeople (): Observable<Person[]> {
    return this.http.get<Person[]>(this.personUrl)
      .pipe(
        tap(people => this.log('fetched people')),
        catchError(this.handleError('getPeople', []))

        // 
      );
  }

  /** GET person by id. Will 404 if id not found */
  getPersonID(id: number): Observable<Person> {
    const url = `${this.personUrl}/${id}`;
    return this.http.get<Person>(url).pipe(
      tap(_ => this.log(`fetched person id=${id}`)),
      catchError(this.handleError<Person>(`getPersonID id=${id}`))
    );
  }
  
  /** GET person by id. Return `undefined` when id not found */
  getPersonNo404<Data>(id: number): Observable<Person> {
    const url = `${this.personUrl}/?id=${id}`;
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
    return this.http.get<Person[]>(`${this.personUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found people matching "${term}"`)),
      catchError(this.handleError<Person[]>('searchPeople', []))
    );
  }
 
  //////// Save methods //////////
 
  /** POST: add a new person to the server */
  addPerson (person: Person): Observable<Person> {
    return this.http.post<Person>(this.personUrl, person, httpOptions).pipe(
      tap((person: Person) => this.log(`added Person w/ id=${person.PKPersonId}`)),
      catchError(this.handleError<Person>('addPerson'))
    );
  }
 
  /** DELETE: delete the Person from the server */
  deletePerson (person: Person | number): Observable<Person> {
    const id = typeof person === 'number' ? person : person.PKPersonId;
    const url = `${this.personUrl}/${id}`;
 
    return this.http.delete<Person>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted person id=${id}`)),
      catchError(this.handleError<Person>('deletePerson'))
    );
  }
 
  /** PUT: update the Person on the server */
  updatePerson (person: Person): Observable<any> {
    return this.http.put(this.personUrl, person, httpOptions).pipe(
      tap(_ => this.log(`updated Person id=${person.PKPersonId}`)),
      catchError(this.handleError<any>('updatePerson'))
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
import { Component, OnInit } from '@angular/core';
 
import { Observable, Subject } from 'rxjs';
 
import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';
 
import { Person } from '../person';
import { APIService } from '../api.service';
 
@Component({
  selector: 'app-person-search',
  templateUrl: './person-search.component.html',
  styleUrls: [ './person-search.component.css' ]
})
export class PersonSearchComponent implements OnInit {
  people$: Observable<Person[]>;
  private searchTerms = new Subject<string>();
 
  constructor(private staffService: APIService) {}
 
  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }
 
  ngOnInit(): void {
    this.people$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),
 
      // ignore new term if same as previous term
      distinctUntilChanged(),
 
      // switch to new search observable each time the term changes
      switchMap((term: string) => this.staffService.searchPeople(term)),
    );
  }
}

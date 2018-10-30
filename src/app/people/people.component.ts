// people.compenents.ts

import { Component, OnInit } from '@angular/core';

import { Person } from '../person';
import { APIService } from '../api.service';

 
@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
 
export class PeopleComponent implements OnInit {
 
  people: Person[];

  constructor(private staffService: APIService, ) { }


  ngOnInit() {
    this.getPeople();
  }

  getPeople(): void {
    this.staffService.getPeople()
        .subscribe(people => this.people = people);
  }

  add(PreferredFirstName : string): void {
    PreferredFirstName  = PreferredFirstName .trim();
    if (!PreferredFirstName ) { return; }
    this.staffService.addPerson({ PreferredFirstName } as Person)
      .subscribe(person => {
        this.people.push(person);
      });
  }
  
  delete(person: Person): void {
    this.people = this.people.filter(h => h !== person);
    this.staffService.deletePerson(person).subscribe();
  }
}
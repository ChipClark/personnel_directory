import { Component, OnInit } from '@angular/core';
import { Person } from '../person';
import { APIService } from '../api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  people: Person[] = [];
 
  constructor(private staffService: APIService) { }
 
  ngOnInit() {
    this.getPeople();
  }
 
  getPeople(): void {
    this.staffService.getPeople()
      .subscribe(people => this.people = people.slice(1, 5));
  }

}

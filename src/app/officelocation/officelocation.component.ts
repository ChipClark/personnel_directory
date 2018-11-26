import { Component, OnInit } from '@angular/core';
import { Person } from '../person';

import { APIService } from '../api.service';


@Component({
  selector: 'app-officelocation',
  templateUrl: './officelocation.component.html',
  styleUrls: ['./officelocation.component.css']
})
export class OfficelocationComponent implements OnInit {

  people: Person[];

  constructor(private staffService: APIService, ) { }

  ngOnInit() {
    this.getPeopleByLocation(1);
  }

  getPeopleByLocation(id: number): void {
    var location; 
    switch(id) {
      case 1: 
        location = "Century City";
      case 2:
        location = "Los Angeles";
      case 3:
        location = "Orange County";
      case 4:
        location = "San Diego";
      case 5:
        location = "San Francisco";
      default: 
        location = "";
    }
    this.getLocation(location);
    this.staffService.getPeopleByLocation(id)
        .subscribe(people => this.people = people);
  }

  getLocation(location: string): string {
    var cityString; 
    cityString = '&nbsp;<a href="/people/' + location + '"' + ' > ' + location + '</a> | ';
    return cityString;

  }

}

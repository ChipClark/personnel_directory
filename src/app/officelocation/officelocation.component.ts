import { Component, OnInit } from '@angular/core';
import { Person } from '../person';

import { APIService } from '../api.service';
import { PeopleComponent } from '../people/people.component';


@Component({
  selector: 'app-officelocation',
  templateUrl: './officelocation.component.html',
  styleUrls: ['./officelocation.component.css']
})

export class OfficelocationComponent implements OnInit {

  people: Person[];
  filterargs = {officelocationname: ''};
  items = [{officelocationname: 'Century City'}, {officelocationname: 'Los Angeles'},
      {officelocationname: 'Orange County'},{officelocationname: 'San Diego'},
      {officelocationname: 'San Francisco'},]
  
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
    this.writeLocation(location);
    this.staffService.getPeopleByLocation(id);
  }

  writeLocation(location: string): string {
    var cityString; 
    cityString = '<button (click)="getPeopleByLocation(' + location + ')">' + location + '</button>&nbsp;';  
    
    return cityString;
  }

  getLocation(location: string): void {
    this.filterargs.officelocationname = location;
  }

}

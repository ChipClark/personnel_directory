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
    this.getPeopleByLocation(6);
  }

  getPeopleByLocation(id: number): void {
 
    var location; 
    switch(id) {
      case 6:
        location = "";
        break;
      case 1: 
        location = "Century City";
        break;
      case 2:
        location = "Los Angeles";
        break;
      case 3:
        location = "Orange County";
        break;
      case 4:
        location = "San Diego";
        break;
      case 5:
        location = "San Francisco";
        break;
      default: 
        location = "";
        break;
    }
    //console.log(this.people);

    //this.writeLocation(location);
    //var primary = this.people.find(obj => {
    //  return obj.officelocationid === location
    //  });
    
    //console.log(primary.officelocation);
    //this.staffService.getPeople()
    //    .subscribe(primary => this.people = primary);
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

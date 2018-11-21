import { Component, OnInit } from '@angular/core';
import { Person } from '../person';
import { Schools } from '../school';

import { APIService } from '../api.service';


@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css']
})
export class SchoolComponent implements OnInit {
 
  school: Schools[];
  

  constructor(private staffService: APIService, ) { }

  ngOnInit() {
    this.getSchools();
  }

  getSchools(): void {
    this.staffService.getSchools()
        .subscribe(schools => this.school = schools);
  }

  //getPersonSchool (id: number):  {
    
  //}
  



}

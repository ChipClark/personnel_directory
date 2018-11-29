import { Component, OnInit, Input  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Person }         from '../person';
import { APIService }  from '../api.service';

@Component({
  selector: 'app-staff-detail',
  templateUrl: './staff-detail.component.html',
  styleUrls: ['./staff-detail.component.css']
})

export class StaffDetailComponent implements OnInit {
  
  @Input() selectedPerson: Person;
 
  constructor(
    private route: ActivatedRoute,
    private staffService: APIService,
    private location: Location
  ) {}
 
  ngOnInit(): void {
    this.getPerson();
  }
 
  getPerson(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.staffService.getPersonID(id) 
      .subscribe(person => this.selectedPerson = person);
  }

 
  goBack(): void {
    this.location.back();
  }


}

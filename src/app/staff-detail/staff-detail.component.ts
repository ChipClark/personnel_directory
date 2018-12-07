import { Component, OnInit, Input  } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Location } from '@angular/common';

import { Person, iData }         from '../person';
import { APIService }  from '../api.service';
import { HttpClient, HttpHeaders, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

// datatables
import { Schools } from '../datatables/school';
import { Phones } from '../datatables/phones';
import { JobTitle } from '../datatables/jobs';
import { LegalPractices, AttorneyPracticeAreas } from '../datatables/practicestables';

@Component({
  selector: 'app-staff-detail',
  templateUrl: './staff-detail.component.html',
  styleUrls: ['./staff-detail.component.css']
})

export class StaffDetailComponent implements OnInit {

  60

  private baseURL = 'http://am-web05:3030/api/people/';
  private All = '?filter={"where":{"employmentstatus":"A"},'
  private generalIncludes = '"include":["emails","phones","jobtitle","officelocation","hrdepartment","personrelationship","education","practices","attorneypractices","legaldepartments","degreetypes","schools"]}';
  
  url: string;
  people: Person[];
  person: Person[];
  idata: iData[];
  school: Schools[];
  phone: Phones[];
  router: RouterLink;
  jobs: JobTitle[];
  attorneyareas: AttorneyPracticeAreas[];
  practiceareas: LegalPractices[];

  @Input() selectedPerson: Person;
 
  constructor(
    private route: ActivatedRoute,
    private staffService: APIService,
    private location: Location
  ) {}
 
  ngOnInit(): void {
    this.getPerson(60);
  }
 
  getPerson(id: number): void {
    this.url = this.baseURL + id;
    var MyPerson = this.staffService.getPersonID(this.url) 
      .subscribe(people => this.person = this.person);
  }

 
  goBack(): void {
    this.location.back();
  }


}

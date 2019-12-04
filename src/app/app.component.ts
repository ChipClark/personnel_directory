import { Component, ComponentFactoryResolver } from '@angular/core';
import { HttpClient } from'@angular/common/http';
import { Observable, of, BehaviorSubject, interval } from 'rxjs';
import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { DevVariablesComponent } from './dev-variables/dev-variables.component';
import { RouterLink, Router, ActivatedRoute, Event, NavigationStart, NavigationEnd } from '@angular/router';

// datatables 
import { Person } from './person';
import { PersonPage } from './datatables/AllTextFields';
import { OfficeLocation, RoomLocation } from './datatables/officelocation';
import { Schools, Education, DegreeTypes } from './datatables/school';
import { Phones } from './datatables/phones';
import { JobTitle, JobTypes } from './datatables/jobs';
import { Photos } from './datatables/photo';
import { LegalPractices, AttorneyPracticeAreas, LegalSubPractices, License, LicenseType } from './datatables/practicestables';
import { HRDepartments, LegalDepartments, LegalSubDepartments } from './datatables/departmenttables';
import { PersonRelationship, Secretaries } from './datatables/personrelationship';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

@Injectable({
  providedIn: 'root'
})



export class AppComponent {
  title = 'Personnel Directory';
  private authRslt: string = '';
  private authBack: string = 'grey';
  private postRslt: string = '';
  private postBack: string = 'grey';

  router: RouterLink;


  constructor (
    private http: HttpClient,
    private debugging: DevVariablesComponent,
    private apiService: APIService,
    private route: ActivatedRoute,
    private _router: Router,
   ){ };

  
  
  ngOnInit() {
    
    if (window.screen.width < 1000) {
      this.debugging.mobile = true;
    }
  }
   
}

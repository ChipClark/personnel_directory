import { Component, OnInit, OnDestroy, ViewChild, ViewChildren, OnChanges, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { APIService } from '../api.service';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl, SafeValue } from '@angular/platform-browser';


// datatables 
import { Person } from '../datatables/person';
import { PersonPage } from '../datatables/AllTextFields';
import { OfficeLocation, RoomLocation } from '../datatables/officelocation';
import { Schools, Education, DegreeTypes } from '../datatables/school';
import { Phones } from '../datatables/phones';
import { JobTitle, JobTypes } from '../datatables/jobs';
import { Photos } from '../datatables/photo';
import { LegalPractices, AttorneyPracticeAreas, LegalSubPractices, License, LicenseType } from '../datatables/practicestables';
import { HRDepartments, LegalDepartments, LegalSubDepartments } from '../datatables/departmenttables';
import { PersonRelationship, Secretaries } from '../datatables/personrelationship';
import { repeat } from 'rxjs/operators';

import { InlineSVGModule } from 'ng-inline-svg';
import * as Svg from 'svg.js'

import { HighlightDelayBarrier } from 'blocking-proxy/built/lib/highlight_delay_barrier';
import { DevVariablesComponent } from '../dev-variables/dev-variables.component';
import { AppComponent } from '../app.component';
import { PeopleComponent } from '../people/people.component';

@Component({
  selector: 'app-map',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapComponent implements OnInit {

  public floor = ['04', '05', '12', '13', '18', '26', '27', '28', '29'];
  public floorID = null;
  public cities = ['CC', 'LA', 'OC', 'SD', 'SF'];
  public cityName = null;
  public officeID = null;
  public showAdvFilter = false;
  public searchTerm = null;
  public individualid = null;

  public people$: Promise<Person[]>;
  public legalSub$: Promise<any[]>;
  public userData$: Promise<any>;
  public logout$: Observable<any>;
  legalDepts: LegalDepartments[];
  legalsubdepts: LegalSubDepartments[];
  private resBody = "";
  public token;
  public userID;
  public userName: string;
  public loginStatus: boolean;
  
  public people: Person[];
  regions: any[];

  constructor(
    private apiService: APIService,
    private debugging: DevVariablesComponent,
    private mainApp: AppComponent,
    private route: ActivatedRoute,
    protected sanitizer: DomSanitizer,
    private _router: Router,
    private location: Location
  ) { this.apiService.initAuth(); }

  ngOnInit() {
    const queryStrings: any = this.route.queryParamMap;
    this.executeQueryParams(queryStrings.source.value);
    this.initData();
  }

  async initData(): Promise<any> {
    console.log("initData");
    if ( this.apiService.people ) {
      console.log("people exist!")
      this.people = this.apiService.people;
    }
    else {
      if ( !this.debugging.onLocalHost ) {
        await this.apiService.initAuth().then( res => {
          this.resBody = res.body;
          const lastToken = res.body[0].access_token.slice(Math.max(res.body[0].access_token.length - 30, 1));
          this.token = res.body[0].access_token;
          this.userID = res.body[0].user_id;
          this.apiService.initLegalSub().then(legalsubdepts => {
            this.legalsubdepts = legalsubdepts;
          });
              
          this.apiService.initPeople().then(people => {
            this.people = people;
            this.buildAllPeopleData();
          });
        });
      }
      else {
        this.apiService.initLegalSub().then(legalsubdepts => {
          this.legalsubdepts = legalsubdepts;
        });
            
        this.apiService.initPeople().then(people => {
          this.people = people;
          this.buildAllPeopleData();
        });

      }
    }
    this.loginStatus = this.apiService.loginStatus;
  }

  buildAllPeopleData() {
    for (let i = 0; i < this.people.length; i++) {
      if (this.people[i]) {
        if ( this.userID == this.people[i].adprincipaldomainaccount ) { 
          this.people[i].activeuser = true;
          if ( this.people[i].preferredfirstname ) { this.userName = this.people[i].preferredfirstname }
          else {
            this.userName = this.people[i].firstname
          };
        }
        else {
          this.people[i].activeuser = false;
        }
        this.getSubDept(this.people[i]);
        this.getFloorLocation(this.people[i]);
      }
      if (this.people[i].personrelationship) {
        const relatedArray = this.people[i].personrelationship;
        for (let j = 0; j < relatedArray.length; j++) {
          for (let k = 0; k < this.people.length; k++) {
            if (relatedArray[j].relatedpersonid === this.people[k].pkpersonid) {
              this.people[k].supportrelationships = true;
              const relatedPerson = {
                relatedpersonid: null,
                personrelationshipid: null,
                pkpersonid: null,
                relationshiptypeid: null,
                supportedpersonid: relatedArray[j].pkpersonid,
                description: null,
                active: null,
                activefromdate: null,
                modifieddate: null,
                modifiedby: null,
                validfromdate: null,
                validtodate: null
              };
              this.people[k].personrelationship.push(relatedPerson);
            }
          }
        }
      }
    }
  }

  getFloorLocation(currentperson: any) {
    let floorNum;
      if (!currentperson.officenumber) {
        return;
      }
      switch (currentperson.officelocationid) {
        case 1:
          floorNum = currentperson.officenumber.slice(0,2);
          currentperson.officecity = "la";
          currentperson.officecityfullname = "Los Angeles";      
          break;
        case 2: 
          floorNum = currentperson.officenumber.slice(0,1);
          currentperson.officecity = "oc";
          currentperson.officecityfullname = "Orange County";      
          break;
        case 3:
          floorNum = currentperson.officenumber.slice(0,1);
          currentperson.officecity = "sd";
          currentperson.officecityfullname = "San Diego";      
          break;
        case 4:
          floorNum = currentperson.officenumber.slice(0,2);
          currentperson.officecity = "cc";
          currentperson.officecityfullname = "Century City";      
          break;
        case 5:
          floorNum = currentperson.officenumber.slice(0,2);
          if (floorNum == "c1") {
            floorNum = currentperson.officenumber.slice(0,3);
          }
          currentperson.officecity = "sf";
          currentperson.officecityfullname = "San Francisco";      
          break;
      }
      switch (floorNum) {
        case "4":
          currentperson.floornumber = "04";
          currentperson.officefloorid = 5;
          break;
        case "5":
          currentperson.floornumber = "05";
          currentperson.officefloorid = 6;
          break;
        case "6":
          currentperson.floornumber = "26";
          currentperson.officefloorid = 7;
          break;
        case "7": 
          currentperson.floornumber = "27";
          currentperson.officefloorid = 8;
          break;
        case "26":
          currentperson.floornumber = "26";
          currentperson.officefloorid = 1;
          break;
        case "27":
          currentperson.floornumber = "27";
          currentperson.officefloorid = 2;
          break;
        case "28":
          currentperson.floornumber = "28";
          currentperson.officefloorid = 3;
          break;
        case "29":
          currentperson.floornumber = "29";
          currentperson.officefloorid = 4;
          break;
        case "12":
          currentperson.floornumber = "12";
          currentperson.officefloorid = 10;
          break;
        case "13": 
          currentperson.floornumber = "13";
          currentperson.officefloorid = 11;
          break;
        case "18": 
          currentperson.floornumber = "18";
          currentperson.officefloorid = 9;
          break;
        case "c12":
          currentperson.floornumber = "12";
          currentperson.officefloorid = 9;
        case "c13":
          currentperson.floornumber = "13";
          currentperson.officefloorid = 10;
      }
  }

  getSubDept(currentperson: any) {
    if (currentperson.legalsubdepartments && 
      currentperson.jobtitle.jobtypeid == 3 ||
      currentperson.jobtitle.jobtypeid == 11 ||
      currentperson.jobtitle.jobtypeid == 12 ) {
      if (!currentperson.legalsubdepartments) {
        return;
      }
    currentperson.legalsubdeptfriendlyname = currentperson.legalsubdepartments.legalsubdeptfriendlyname;
    }
  }
 
  
  sanitizeScript(sanitizer: DomSanitizer) { }

  goBack(): void {
    this.location.back();
  }

  displayMap(): SafeHtml {
    var mapIMG, floor;
    const queryStrings: any = this.route.queryParamMap;
    //console.log(queryStrings.source);
    this.executeQueryParams(queryStrings.source.value);
    mapIMG = '<object id="svgObject" data="../../assets/' + this.cityName + '-' + this.floorID + '.svg" type="image/svg+xml" ></object>';
    return this.sanitizer.bypassSecurityTrustHtml(mapIMG);
  }

  highlightOffice(offid: string): void {
    const el = document.getElementById(offid);
    if (el && el.getAttribute('id')) {
      el.setAttribute('fill', '#ff8a8a');
    }
  }

  clearALL(key): void {
    this.searchTerm = null;
    switch (key) {
      case "city":
        this.addQueryParams({ location: null });
        break;
      case "floor":
        this.addQueryParams({ floor: null });
        break;
      case "offid":
        this.addQueryParams({ office: null });
        break;
      case "ind":
        this.addQueryParams({ ind: null });
        break;
    }
  }

  addQueryParams(query): void {
    const keys = Object.keys(query);
    const values = Object.values(query);
    switch (keys[0]) {
      case 'city':
        this.cityName = values[0];
        break;
      case 'floor':
        this.floorID = values[0];
        break;
      case 'offid':
        this.officeID = values[0];
        break;
      case 'ind':
        this.individualid = values[0];
        break;
    }
    //console.log(query);

    if (query === "") {
      query = null;
    }
    this._router.navigate(['maps'], {
      queryParams: {
        ...query
      }
    });
  }

  clearQueryParams(): void {
    //console.log('clearing params');
    this._router.navigate([''], {
      queryParams: {
      },
    });
    this.cityName = null;
    this.floorID = null;
    this.officeID = null;
    this.individualid = null;
  }

  executeQueryParams(queryStrings): void {
    const queries = Object.entries(queryStrings);
    for (const q of queries) {
      switch (q[0]) {
        case 'city':
          this.cityName = q[1];
          break;
        case 'floor':
          let floor = +q[1];
          if (floor < 10) {
            this.floorID = "0" + floor.toString();
          } else { this.floorID = floor.toString(); }
          break;
        case 'offid':
          this.officeID = q[1];
          break;
        case 'ind':
          this.individualid = +q[1];
          break;
      }
    }
    this.highlightOffice('o' + this.officeID);
  }

  setToolTips(city: string, floor: number, offid: string): string {
    var officetooltip;

    return officetooltip;
  }

 

  showconsole(obj) {
    var keys = [];
    for (var key in obj) {
      //console.log(key, " ", obj[key]);
    }
  }

  onChangeFloor(event) {
    this._router.navigate([event], {relativeTo: this.route});
  }

  goToPerson(event) {
    let person;
    let id;
    const room = event.substring(1);
    if (room) {
      person = this.people.find(p => p.officenumber == room); //&& p.officelocation.officelocationcode.toLowerCase() == this.cityName
      console.log(person);
      if (person) {
        id = person.pkpersonid;
      }
    }
    if (id) {
      this._router.navigate(['/'], { queryParams: { 'ind': id } });
    }
  }


}

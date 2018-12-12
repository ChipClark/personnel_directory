// people.compenents.ts

import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl, SafeValue } from '@angular/platform-browser';
import { Person } from '../person';
import { iData, APIHeader } from '../JUNK';
import { HttpClient, HttpHeaders, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { APIService } from '../api.service';
import { RouterLink } from '@angular/router';

// datatables 
import { Schools } from '../datatables/school';
import { Phones } from '../datatables/phones';
import { JobTitle, JobTypes } from '../datatables/jobs';
import { LegalPractices, AttorneyPracticeAreas } from '../datatables/practicestables';
import { HRDepartments, LegalDepartments, LegalSubDepartments } from '../datatables/departmenttables';
import { cpus } from 'os';
import { PersonRelationship } from '../datatables/personrelationship';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';


@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css'],
})

@Injectable({
  providedIn: 'root'
})

//export class SendService {
  // see: https://stackoverflow.com/questions/44205950/angular-passing-a-variable-from-a-component-to-a-service 
//  private skip = 20;
//  private limit = 20;
//  private lastRecord;

//  getSkipValue(): number{
//    return this.skip;
//  }
//  getLimitValue(): number {
//    return this.limit;
//  }
//  getLastValue(): number {
//    return this.lastRecord;
//  }
//}
 
export class PeopleComponent implements OnInit {

  private baseURL = 'http://am-web05:3030/api/people/';
  private phoneURL = "http://am-web05:3030/api/phones";
  private jobURL = 'http://am-web05:3030/api/jobtitles';
  private schoolDetails = 'http://am-web05:3030/api/schools';
  private practiceareasURL = 'http://am-web05:3030/api/practices';
  private attorneypracticeURL = 'http://am-web05:3030/api/attorneypractices';
  private legalSubDeptsURL = 'http://am-web05:3030/api/legalsubdepartments';


  // Filters
  private peopleFilter = '?filter={"where":{"employmentstatus":"A"'
  private EndFilter = '},'
  private All = this.peopleFilter + this.EndFilter;
  private addFilter = this.All;
  private location = "";
  private hrdepartmentFilter = "";


  //includes
  private generalIncludes = '"include":["emails","phones","jobtitle","officelocation","hrdepartment","personrelationship","education","schools","degreetypes","attorneypractices","practices","legalsubdepartments"]';
  private endRequest = '}';

  public LabelClass = "OP1";
  
  public skip = 0;
  public limit = 20;
  public lastRecord;
  
  private pagination = '"limit":' + this.limit + ',"skip":' + this.skip + ',';
  private order = '"order":"lastname ASC",'
  private personURL = this.baseURL + this.addFilter + this.pagination + this.order + this.generalIncludes + this.endRequest;  // URL to web api


  url: string;
  people: Person[];
  idata: iData[];
  apiheader: APIHeader;
  relationships: PersonRelationship[];
  school: Schools[];
  phone: Phones[];
  selectedPerson: Person;
  router: RouterLink;
  jobs: JobTitle[];
  attorneyareas: AttorneyPracticeAreas[];
  practiceareas: LegalPractices[];
  roles: HRDepartments[];
  legalDepts: LegalDepartments[];
  legalSubDepts: LegalSubDepartments[];
  
  constructor(
    private staffService: APIService,
    private http: HttpClient,
    protected sanitizer: DomSanitizer
    ) { }

  ngOnInit() {
    //this.getValues();
    this.getPeople();
    //this.getSchools();
    //this.getJobTitles();
    //this.getLegalPractices();
    //this.getAttorneyPractices();
    //this.getLegalSubPractices();
  }

  onSelect(personid: number): void {
    var primary = this.people.find(obj => {
      return obj.pkpersonid === personid;
      });
      
      console.log(primary.firstname);
    //this.router.  ('/details/' + people.pkpersonid);
    //this.selectedPerson.pkpersonid = people.pkpersonid;
  }

  getPeople(): void {
    this.buildURL();
    let JUNK$ = this.staffService.getDATA(this.personURL)
        .subscribe(people => this.people = people
        );
  }
  
  buildURL () {
    this.pagination = '"limit":' + this.limit + ',"skip":' + this.skip + ',';
    this.buildAddFilter();
    this.personURL = this.baseURL + this.addFilter + this.pagination + this.order + this.generalIncludes + this.endRequest;  // URL to web api
  }

  buildAddFilter () {
    this.addFilter = this.peopleFilter + this.location + this.hrdepartmentFilter + this.EndFilter;
  }
  

  //getMorePeople(direction: string, lastRecord): void {
  getMorePeople(direction: string, recordcount: number): void {
    if(direction == "prev"){
      if(this.skip >= 20) {
          this.skip = this.skip - this.limit;
      }
    }
    else {
      var tempCount = recordcount - (this.limit + this.skip);  // this ensures we don't exceed the totalcount (recordcount)
      if(this.skip >= 0 && this.skip < recordcount) {
        if(tempCount > 0) {
          this.skip = this.skip + this.limit;
        }
      }
    }
    this.getPeople(); 
  }

  getPeopleByLocation(id: number): void {
    var LabelElement;
    LabelElement = document.getElementById(this.LabelClass);
    //console.log(this.LabelClass)
    LabelElement.className = "btn btn-outline btn-outline-secondary";

    switch(id) {
      case 6:
          this.location = '';
          LabelElement = document.getElementById("OP1");
          LabelElement.className = "btn btn-outline-secondary focus active";
          this.LabelClass = "OP1";
         break;
      case 1: 
          this.location = ',"officelocationid":4';
          LabelElement = document.getElementById("OP2");
          LabelElement.className = "btn btn-outline-secondary focus active";
          this.LabelClass = "OP2";
         break;
      case 2:
          this.location = ',"officelocationid":1';
          LabelElement = document.getElementById("OP3");
          LabelElement.className = "btn btn-outline-secondary focus active";
           this.LabelClass = "OP3";
         break;
      case 3:
          this.location = ',"officelocationid":2';
          LabelElement = document.getElementById("OP4");
          LabelElement.className = "btn btn-outline-secondary focus active";
           this.LabelClass = "OP4";
         break;
      case 4:
          this.location = ',"officelocationid":3';
          LabelElement = document.getElementById("OP5");
          LabelElement.className = "btn btn-outline-secondary focus active";
          this.LabelClass = "OP5";
         break;
      case 5:
          this.location = ',"officelocationid":5';
          LabelElement = document.getElementById("OP6");
          LabelElement.className = "btn btn-outline-secondary focus active";
          this.LabelClass = "OP6";
         break;
      default: 
         this.location = "";
        break;
    }
    this.skip = 0;
    this.getPeople(); 
  }

  getPeopleByRole(id: number): void {
    return;
    var LabelElement;
    LabelElement = document.getElementById(this.LabelClass);
    LabelElement.className = "small-font btn btn-outline btn-outline-secondary";

    switch(id) {
      case 6:
          this.hrdepartmentFilter = '';
          LabelElement = document.getElementById("Role1");
          this.LabelClass = "Role1";
         break;
      case 1: 
          this.hrdepartmentFilter = ',"hrdepartment":1';
          LabelElement = document.getElementById("Role2");
          this.LabelClass = "Role2";
         break;
      case 2:
          this.hrdepartmentFilter = ',"hrdepartment":1';
          LabelElement = document.getElementById("Role3");
           this.LabelClass = "Role3";
         break;
      case 3:
          this.hrdepartmentFilter = ',"hrdepartment":2';
          LabelElement = document.getElementById("Role4");
           this.LabelClass = "Role4";
         break;
      case 4:
          this.hrdepartmentFilter = ',"hrdepartment":3';
          LabelElement = document.getElementById("Role5");
          this.LabelClass = "Role5";
         break;
      case 5:
          this.hrdepartmentFilter = ',"hrdepartment":5';
          LabelElement = document.getElementById("Role6");
          this.LabelClass = "Role6";
         break;
      default: 
         this.location = "";
        break;
    }
    LabelElement.className = "small-font btn btn-outline-secondary focus active";
    this.skip = 0;
    this.getPeople(); 
  }

  getPersonTitles(currentperson: any): string {
    var currentJobTitle = currentperson.jobtitle.jobtitle;
    
    var addHTML = "<strong>" + currentJobTitle + "</strong>";

    if(currentperson.practices.length > 0) {
      addHTML = addHTML + "<br>";
      var currentPractices = currentperson.practices;
      var i;
      for(i = 0; i < currentperson.practices.length; i++){
        if(i > 0  ) {
          addHTML = addHTML + ",";
          if( i == 2 || i == 4 ) {
            addHTML = addHTML + "<br>";
          }
        }
        addHTML = addHTML + " " + currentperson.practices[i].practicename;
        
      }
      addHTML = addHTML + "<br>";

    }
    return addHTML;
  }

  getPhoto(): void {
    // this isn't working yet  - photos getting put into database ...
    // no need for extensive logic 
    var personPhoto, noPhoto, photoString;
    
    var personlist = this.people;

    var primary = personlist.find(obj => {
      return obj.pkpersonid === 1;
      });

      photoString = `<img src="http://amjabber/nophoto.gif" id='{{person.pkperson.id}}' width="112px;" />`
    
      var image=new Image();
      //console.log("in getPhoto()");
      //personPhoto = "http://amjabber/" + primary.addomainaccount + ".jpg";
      image.onload = function () {
        //photoString = '<img src="' + personPhoto + '" id=' + personid + 'width="112px;" />';
      }
      image.onerror = function () {
        //photoString = '<img src="' + personPhoto + '" id=' + personid + 'width="112px;" />';
      }
      image.src = personPhoto;

      //image.id = personid.toString();

      return photoString;
  }

  getSchools(): void {
    this.staffService.getSchoolDATA(this.schoolDetails)
        .subscribe(school => this.school = school);
  }
  getJobTitles(): void {
    this.staffService.getJOBS(this.jobURL)
        .subscribe(jobs => {this.jobs = this.jobs});
  }
  getLegalPractices(): void {
    this.staffService.getPractices(this.practiceareasURL)
        .subscribe(practiceareas => {this.practiceareas = this.practiceareas});
  }
  getAttorneyPractices(): void {
    this.staffService.getAttorneyPractices(this.attorneypracticeURL)
        .subscribe(attorneyareas => {this.attorneyareas = this.attorneyareas});
  }
  getLegalSubPractices(): void {
    this.staffService.getAttorneyPractices(this.legalSubDeptsURL)
        .subscribe(legalSubDepts => {this.legalSubDepts = this.legalSubDepts});
  }

  getEducation(personid: number): string {
    var addHTML = "";
    var schoolID;
    
    var attorney = this.people.find(obj => {
      return obj.pkpersonid === personid
      });

    return addHTML;
  }

  getEmail(EMAIL: string, personName: string): string {
    var emailString = '<a href=mailto:' + EMAIL + ' id=' + personName + ' >' + EMAIL + '</a>'; 
  
  return emailString;
  }

  getPrefName(prefName: string): string {
    if(!prefName) return "";
    prefName = '"' + prefName + '"';    
    return prefName;
  }

  getPhone(currentperson: any): SafeHtml | SafeValue {
    var phonetypeid = 1;
    var officePhone = currentperson.phones.find(obj => { 
      return obj.phonetypeid === phonetypeid;
    });

    if(!officePhone) {
      var nophone = 'Phone: <br>'
      return nophone; 
    }

    var phonenum = officePhone.phonenumber;
    phonenum = phonenum.replace(/\D+/g, '')
          .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

    phonenum = 'Phone: <a href="tel:+' + officePhone.phonenumber + '">' + phonenum + '</a><br>'
    return this.sanitizer.bypassSecurityTrustHtml(phonenum);
  }

  writeAssistant(currentperson: any): SafeHtml  {
    if(currentperson.personrelationship.length == 0 ) return null;

    var asstID = currentperson.personrelationship[0].relatedpersonid;

    var assistant = this.people.find(obj => {
      return obj.pkpersonid = currentperson.personrelationship[0].relatedpersonid;
    });
    //console.log(assistant.pkpersonid);
    //console.log(assistant);
    return null;
  }

  getAssistants(personid: number): string {
    var asst;
    if(!asst){return null};

    asst = '<a routerLink="/detail/' + asst + '">' + asst + '</a><br>';
    //return this.sanitizer.bypassSecurityTrustHtml(asst);

    var addHTML = "";

    var parentPerson = this.people.find(obj => { 
      return obj.pkpersonid === personid;
    });

    var currentrelationship = this.relationships.find(obj => { 
      return obj.personrelationshipid === personid;
    });

    console.log(currentrelationship);
    //if(currentperson.personrelationship.length == 0) return addHTML;

    return addHTML =  "Assistant: ";

    
    //console.log(currentperson.personrelationship);
    //var assistant = this.people.find(obj => {
    //  return obj.pkpersonid = parentPerson.personrelationship[0].relatedpersonid;
    //});

    //if(!assistant) {
    //    return addHTML = "";
    //  }
    //addHTML =  "Assistant: " + assistant.displayname;

    return addHTML;
    
        //  addHTML = "Assistant: " + asstPerson.displayname + "<br>";
    
  }

  sanitizeScript(sanitizer: DomSanitizer){}

  
  
}
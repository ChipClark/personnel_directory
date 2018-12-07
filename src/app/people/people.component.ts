// people.compenents.ts

import { Component, OnInit } from '@angular/core';
import { Person, iData } from '../person';
import { Schools } from '../school';
import { HttpClient, HttpHeaders, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from '../api.service';
import { Phones } from '../phones';
import { RouterLink } from '@angular/router';
import { JobTitle } from '../jobs';
import { LegalPractices } from '../practices';
import { AttorneyPracticeAreas } from '../attorneypractices';
import { HRDepartments } from '../hrdepartments';


@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css'],
})

@Injectable({
  providedIn: 'root'
})
 
export class PeopleComponent implements OnInit {

  private baseURL = 'http://am-web05:3030/api/people/';
  private phoneURL = "http://am-web05:3030/api/phones";
  private jobURL = 'http://am-web05:3030/api/jobtitles';
  private schoolDetails = 'http://am-web05:3030/api/schools';
  private practicesURL = 'http://am-web05:3030/api/practices';
  private attorneypracticeURL = 'http://am-web05:3030/api/attorneypractices';
  private practiceURL = 'http://am-web05:3030/api/practices';


  // Filters
  private peopleFilter = '?filter={"where":{"employmentstatus":"A"'
  private EndFilter = '},'
  private All = this.peopleFilter + this.EndFilter;
  private addFilter = this.All;
  private location = "";
  private hrdepartmentFilter = "";


  //includes
  private generalIncludes = '"include":["emails","phones","jobtitle","officelocation","hrdepartment","personrelationship","education","schools","degreetypes","attorneypractices","practices"]';
  private endRequest = '}';

  public skip = 0;
  public limit = 20;
  public LabelClass = "OP1";
  public lastRecord;
  private headers;
  
  private pagination = '"limit":' + this.limit + ',"skip":' + this.skip + ',';
  private order = '"order":"lastname ASC",'
  private personURL = this.baseURL + this.addFilter + this.pagination + this.order + this.generalIncludes + this.endRequest;  // URL to web api


  url: string;
  people: Person[];
  school: Schools[];
  phone: Phones[];
  selectedPerson: Person;
  router: RouterLink;
  jobs: JobTitle[];
  attorneyareas: AttorneyPracticeAreas[];
  practiceareas: LegalPractices[];
  roles: HRDepartments[];
  idata: iData[];
  
  constructor(
    private staffService: APIService,
    private http: HttpClient
    ) { }

  ngOnInit() {
    this.getPeople();
    this.getSchools();
    this.getJobTitles();
    this.getLegalPractices();
    this.getAttorneyPractices();
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
    this.staffService.getDATA(this.personURL)
        .subscribe(
          people => this.people = people.data,
          idata => this.idata = idata.count
        );
          

    console.log(idata.count);

    // This works - but the above is used to learn more about subscribe
    //this.staffService.getDATA(this.personURL)
    //    .subscribe(people => {this.people = people.data; this.lastRecord = people.count});

    // this.staffService.getDATA(this.personURL)
    //    .subscribe(people => {this.people = people.body; console.log(people.headers)});

    // this.lastrecord isn't working yet - needs research    .get('X-Total-Count')
    
  }

  getSchools(): void {
    this.staffService.getSchoolDATA(this.schoolDetails)
        .subscribe(school => this.school = school);

    // this.lastrecord isn't working yet - needs research    .get('X-Total-Count') 
  }
  
  
  buildURL () {
    this.pagination = '"limit":' + this.limit + ',"skip":' + this.skip + ',';
    this.buildAddFilter();
    this.personURL = this.baseURL + this.addFilter + this.pagination + this.order + this.generalIncludes + this.endRequest;  // URL to web api
  }

  buildAddFilter () {
    this.addFilter = this.peopleFilter + this.location + this.hrdepartmentFilter + this.EndFilter;
  }
  

  getMorePeople(direction: string): void {
    this.lastRecord = 100; // temporary fix 

    if(direction == "prev"){
      if(this.skip >= 20) {
          this.skip = this.skip - this.limit;
      }

    }
    else {
      if(this.skip >= 0 && this.skip < this.lastRecord) {
        this.skip = this.skip + this.limit;
      } 
    }

    this.getPeople(); 
  }

  getPeopleByLocation(id: number): void {
    var LabelElement;
    LabelElement = document.getElementById(this.LabelClass);
    console.log(this.LabelClass)
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
  

  getPhone(personid: number): string {
    var phonetypeid = 1;
    var phonenum;
    var primary = this.people.find(obj => {
      return obj.pkpersonid === personid;
      });
 
    var officePhone = primary.phones.find(obj => { 
      return obj.phonetypeid === phonetypeid;
    });

    if(!officePhone) {
      return null; 
    }

    phonenum = officePhone.phonenumber;
    return phonenum = phonenum.replace(/\D+/g, '')
          .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }

  getPersonTitles(personid: number, persontitle,[]: string): string {
    // to be added: , attorneyPracticeID: number when fixed in API server
    var addHTML = "<br>";
    var primary = this.people.find(obj => {
      return obj.pkpersonid === personid;
      });

    if(!persontitle) addHTML = "No title";
    else {
      addHTML = "<strong>" + persontitle.jobtitle + "</strong>";
    }

    if(primary.isattorney == true){

      

      addHTML = addHTML + " " + "nothing" + ": practice";

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

  getJobTitles(): void {
    this.staffService.getJOBS(this.jobURL)
        .subscribe(jobs => {this.jobs = this.jobs});
  }
  getLegalPractices(): void {
    this.staffService.getPractices(this.practicesURL)
        .subscribe(practiceareas => {this.practiceareas = this.practiceareas});
  }
  getAttorneyPractices(): void {
    this.staffService.getAttorneyPractices(this.attorneypracticeURL)
        .subscribe(attorneyareas => {this.attorneyareas = this.attorneyareas});
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

  writeAssistant(personid: number): string {
    var asst = this.getAssistants(personid);

    if(!asst){return null};

    return asst = asst + "<br>";
  }

  getAssistants(personid: number): string {

    var addHTML;
    var primary = this.people.find(obj => {
      return obj.pkpersonid === personid
      });


    if(primary.personrelationship.length == 0) {
      return addHTML = "";
    }

    var assistantID = primary.personrelationship[0].relatedpersonid;

    var assistant = this.people.find(obj => {
        return obj.pkpersonid === assistantID
      });
       
    if(!assistant) {
        return addHTML = "";
      }

    addHTML =  "Assistant: " + assistant.displayname;

    return addHTML;
    
        //  addHTML = "Assistant: " + asstPerson.displayname + "<br>";
    
  }

  
}
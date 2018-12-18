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
import { PersonRelationship } from '../datatables/personrelationship';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { ACTIVE_INDEX } from '@angular/core/src/render3/interfaces/container';


@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css'],
})

@Injectable({
  providedIn: 'root'
})

export class PeopleComponent implements OnInit {

  public baseURL = 'http://am-web05:3030/api/v1/people/';
  
  // Filters
  public peopleFilter = '?filter={"where":{"employmentstatus":"A"'
  public EndFilter = '},'
  public All = this.peopleFilter + this.EndFilter;
  public addFilter = this.All;


  //includes
  public generalIncludes = '"include":["emails","phones","jobtitle","officelocation","hrdepartment","personrelationship","education","schools","degreetypes","attorneypractices","practices","legalsubdepartments"]';
  public endRequest = '}';

  public location = "";
  public cityLabelID = "city6";
  public roleLabelID = "Role1";
  public alphaLabelID = "alphaAll";
  public hrdepartmentFilter = "";
  
  public pageNumber = 0;
  public limit = 10;
  public records;
  public lastRecord;
  public lastPage;
  
  public order = '"order":"lastname ASC",'
  private personURL = this.baseURL + this.addFilter + this.order + this.generalIncludes + this.endRequest;  // URL to web api


  url: string;
  people: Person[];
  activePeople: Person[];
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
    this.getPeople();
  }

  getPeople(): void {
    this.buildURL();
    this.staffService.getDATA(this.personURL)
      .subscribe(people => { 
        this.people = people;
        this.activePeople = people;
        this.records = this.people.length;
        this.lastRecord = this.people.length;
        this.lastPage = Math.ceil(this.lastRecord / this.limit);
        this.paginate();
      }
    );
  }
  
  paginate(): void {
    --this.limit;
    console.log("limit = " + this.limit);
    this.activePeople = this.people.slice(this.pageNumber, this.limit + 1);
    console.log(this.people[this.limit + 1].displayname);
  }
  
  buildURL() {
    this.buildAddFilter();
    this.personURL = this.baseURL + this.addFilter + this.order + this.generalIncludes + this.endRequest;  // URL to web api
  }

  buildAddFilter() {
    this.addFilter = this.peopleFilter + this.location + this.hrdepartmentFilter + this.EndFilter;
  }
  

  getPersonTitles(currentperson: any): SafeHtml {
    var currentJobTitle = currentperson.jobtitle.jobtitle;
    
    var addHTML = "<strong>" + currentJobTitle + "</strong>";
    var moreTag = ', <a routerLink="/detail/' + currentperson.pkpersonid + '>more</a>';
    var temptitle, tempstring;

    if (currentperson.practices.length > 0) {
      addHTML = addHTML + '<div class="practice-titles">';
      var currentPractices = currentperson.practices;
      var i;
      for (i = 0; i < currentPractices.length; i++){
        temptitle = currentPractices[i].practicename;
        if (i == 0 ) {
          addHTML = addHTML + temptitle;
          tempstring = temptitle;
          continue;
        }
        if (i > 0 && i < 3 ) {
          if ((tempstring.length + temptitle.length) > 49) {
            addHTML = addHTML + ',<br>' + temptitle;
            tempstring = temptitle; 
          }
          else {
            addHTML = addHTML + ", " + temptitle;
            tempstring = tempstring + ", " + temptitle;
          }
          continue;
        }
        addHTML = addHTML + tempstring + moreTag;
      }
      addHTML = addHTML + "</div>";

    }
    return this.sanitizer.bypassSecurityTrustHtml(addHTML);
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
    
      var image = new Image();
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

  getEducation(currentperson: any): string {
    var addHTML = "";
    var schoolID;
    
    //currentperson.education.graduationyear

    return addHTML;
  }

  getEmail(EMAIL: string, personName: string): string {
    var emailString = '<a href=mailto:' + EMAIL + ' id=' + personName + ' >' + EMAIL + '</a>'; 
  
  return emailString;
  }

  getPrefName(prefName: string): string {
    if (!prefName) return "";
    prefName = '"' + prefName + '"';    
    return prefName;
  }

  getPhone(currentperson: any): SafeHtml | SafeValue {
    var phonetypeid = 1;
    var officePhone = currentperson.phones.find(obj => { 
      return obj.phonetypeid === phonetypeid;
    });

    if (!officePhone) {
      var nophone = 'Phone: <br>'
      return nophone; 
    }

    var phonenum = officePhone.phonenumber;
    phonenum = phonenum.replace(/\D+/g, '')
          .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

    phonenum = 'Phone: <a href="tel:+' + officePhone.phonenumber + '">' + phonenum + '</a><br>'
    return this.sanitizer.bypassSecurityTrustHtml(phonenum);
  }

  writeAssistant(currentperson: any): SafeHtml {
    if (currentperson.personrelationship.length == 0) return null;

    var asstID = currentperson.personrelationship[0].relatedpersonid;
    var assistants: Person;
    var asst;

    assistants = this.people.find(obj => { 
      return obj.pkpersonid === currentperson.personrelationship[0].relatedpersonid;
    });
 
    for (let i = 0; i < currentperson.personrelationship.length; i++){
      var detailURL = "/detail/" + currentperson.personrelationship[i].relatedpersonid;

      asst = 'Assistant: <a routerLink="' + detailURL
              + '" href="' + detailURL  + '" >';

      for (let j = 0; j < this.people.length; j++) {
        if (currentperson.personrelationship[i].relatedpersonid == this.people[j].pkpersonid) {
          assistants = this.people[j];

          if (!assistants.displayname) {
            asst = asst + 'No name found';
          }
          else {
            asst  = asst + assistants.displayname;
          }
    
        }
      }
    }
    asst = asst + '</a><br />';
    return this.sanitizer.bypassSecurityTrustHtml(asst);
  }

  sanitizeScript(sanitizer: DomSanitizer) {}

  mapPeople(): void {

  }

  
  ByLocation(id: string): void {
    var LabelElement;
    LabelElement = document.getElementById(this.cityLabelID);
    LabelElement.className = "med-font btn btn-outline-secondary";

    switch (id) {
      case "city6":
          this.location = '';
          LabelElement = document.getElementById("city6");
          LabelElement.className = "btn btn-outline-secondary med-font active";
          this.cityLabelID = "city6";
         break;
      case "city1": 
          this.location = ',"officelocationid":4';
          LabelElement = document.getElementById("city1");
          LabelElement.className = "btn btn-outline-secondary med-font active";
          this.cityLabelID = "city1";
         break;
      case "city2":
          this.location = ',"officelocationid":1';
          LabelElement = document.getElementById("city2");
          LabelElement.className = "btn btn-outline-secondary med-font active";
           this.cityLabelID = "city2";
         break;
      case "city3":
          this.location = ',"officelocationid":2';
          LabelElement = document.getElementById("city3");
          LabelElement.className = "btn btn-outline-secondary med-font active";
           this.cityLabelID = "city3";
         break;
      case "city4":
          this.location = ',"officelocationid":3';
          LabelElement = document.getElementById("city4");
          LabelElement.className = "btn btn-outline-secondary med-font active";
          this.cityLabelID = "city4";
         break;
      case "city5":
          this.location = ',"officelocationid":5';
          LabelElement = document.getElementById("city5");
          LabelElement.className = "btn btn-outline-secondary med-font active";
          this.cityLabelID = "city5";
         break;
      default: 
         this.location = "";
        break;
    }
    this.getPeople(); 
  }

  ByAlpha(alpha: string): void {
    var LabelElement;
    LabelElement = document.getElementById(this.alphaLabelID);
    LabelElement.className = "normal-font btn btn-outline-secondary";

    // research how to pull people by first letter of last name
    
    switch (alpha) {
      case "a":
          this.location = 'lastname":a*';
          LabelElement = document.getElementById("alphaA");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaA";
         break;
      case "b": 
          this.location = ',"lastname":b*';  // what to add to the API call to pull the right details
          LabelElement = document.getElementById("alphaB");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaB";
         break;
      case "c":
          this.location = ',"alpha":1';
          LabelElement = document.getElementById("alphaC");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaC";
         break;
      case "d":
          this.location = ',"alpha":2';
          LabelElement = document.getElementById("alphaD");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
           this.alphaLabelID = "alphaD";
         break;
      case "e":
          this.location = ',"alpha":3';
          LabelElement = document.getElementById("alphaE");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaE";
         break;
      case "f":
          this.location = ',"alpha":5';
          LabelElement = document.getElementById("alphaF");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaF";
         break;
      default: 
          this.location = '';
          LabelElement = document.getElementById("alphaAll");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaAll";
        break;
    }
    this.getPeople(); 
  }

  ByRole(role: string): void {
    var LabelElement;
    LabelElement = document.getElementById(this.roleLabelID);
    LabelElement.className = "small-font btn btn-outline-secondary";

    switch (role) {
        case "Role1":
          this.hrdepartmentFilter = '';
          LabelElement = document.getElementById("Role1");
          LabelElement.className = "small-font btn btn-outline-secondary active";
          this.roleLabelID = "Role1";
         break;
        case "Role2": 
          this.hrdepartmentFilter = ',"hrdepartmentid":13';
          LabelElement = document.getElementById("Role2");
          LabelElement.className = "small-font btn btn-outline-secondary active";
          this.roleLabelID = "Role2";
         break;
      case "Role3":
          this.hrdepartmentFilter = ',"hrdepartmentid":1';
          LabelElement = document.getElementById("Role3");
          LabelElement.className = "small-font btn btn-outline-secondary active";
          this.roleLabelID = "Role3";
         break;
      case "Role4":
          this.hrdepartmentFilter = ',"hrdepartmentid":11';
          LabelElement = document.getElementById("Role4");
          LabelElement.className = "small-font btn btn-outline-secondary active";
          this.roleLabelID = "Role4";
         break;
      case "Role5":
          this.hrdepartmentFilter = ',"hrdepartmentid":9';
          LabelElement = document.getElementById("Role5");
          LabelElement.className = "small-font btn btn-outline-secondary active";
          this.roleLabelID = "Role5";
         break;
      case "Role6":
          this.hrdepartmentFilter = ',"hrdepartmentid":8';
          LabelElement = document.getElementById("Role6");
          LabelElement.className = "small-font btn btn-outline-secondary active";
          this.roleLabelID = "Role6";
         break;
      case "Role7":
         this.hrdepartmentFilter = ',"hrdepartmentid":7';
         LabelElement = document.getElementById("Role7");
         LabelElement.className = "small-font btn btn-outline-secondary active";
         this.roleLabelID = "Role7";
        break;
      case "Role8":
         this.hrdepartmentFilter = ',"hrdepartmentid":6';
         LabelElement = document.getElementById("Role8");
         LabelElement.className = "small-font btn btn-outline-secondary active";
         this.roleLabelID = "Role8";
        break;
      case "Role9":
         this.hrdepartmentFilter = ',"hrdepartmentid":3';
         LabelElement = document.getElementById("Role9");
         LabelElement.className = "small-font btn btn-outline-secondary active";
         this.roleLabelID = "Role9";
        break;
      case "Role10":
      this.hrdepartmentFilter = ',"hrdepartmentid":12';
         LabelElement = document.getElementById("Role10");
         LabelElement.className = "small-font btn btn-outline-secondary  active";
         this.roleLabelID = "Role10";
        break;
     default: 
         this.location = "";
        break;
    }
    this.getPeople(); 
}
}
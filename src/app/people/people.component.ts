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
import { LegalPractices, AttorneyPracticeAreas, LegalSubPractices } from '../datatables/practicestables';
import { HRDepartments, LegalDepartments, LegalSubDepartments } from '../datatables/departmenttables';
import { PersonRelationship } from '../datatables/personrelationship';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { ACTIVE_INDEX } from '@angular/core/src/render3/interfaces/container';
import { PersonSearchComponent } from '../person-search/person-search.component';


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
  public activepeopleFilter = '?filter={"where":{"employmentstatus":"A"},'
  public All = this.activepeopleFilter;
  public addFilter = this.All;


  //includes
  private officeFilter = '"emails","phones","jobtitle","officelocation","hrdepartment","personrelationship"';
  private practiceFilter = '"attorneypractices","practices","legalsubdepartments"';
  private educationFilter = '"education","schools","degreetypes"';
  public generalIncludes = '"include":[' + this.officeFilter + ',' + this.practiceFilter + ']';
  public endRequest = '}';
  
  private order = '"order":"lastname ASC",'
  private personURL;  // URL to web api

  public cityLabelID = "city6";
  public roleLabelID = "Role1";
  public alphaLabelID = "alphaAll";
  public hrdepartmentFilter = "";
  public cprImg = '<img src="../assets/cpr.png" class="cprimg" data-toggle="tooltip" title="CPR Certified" width="25px;">';
  public notaryImg = '<img src="../assets/notary.png" class="notaryimg" data-toggle="tooltip" title="Notary Public" width="25px;">';

  // TEMP Measure to include CPR
  private cprNAME = ["Alisuag","Bernard","Borkenhagen","Cooke","Coulter","Cramton","Engstrom","Epstein","Fates","Flores","Garrett","Hall","Hanks","Hart","Ishikawa","Lewis","Menzer","Morris","Nash","Palas","Patterson","Peck","Schwin","Steed","Swambat","Taylor","Touboul","Webb","Whitley","Williams","Zalewski" ];
  private notaryNAME = ["Boliard","Hanks","Hart","Henrotin","Ishikawa","Malvido","Mirdamadi","Morrison","Moulton","Nelson","Peck","Preciado","Robinson","Ron","Salerno","Sandoval","Tristan","Williams","Yerby"  ];
  
  
  public pageNumber = 0;
  public limit = 10;
  public records;
  public lastRecord;
  public lastPage;
  
  

  url: string;
  people: Person[];
  sortPeople: Person[];
  activePeople: Person[];
  relationships: PersonRelationship[];
  school: Schools[];
  phone: Phones[];
  router: RouterLink;
  jobs: JobTitle[];
  attorneyareas: AttorneyPracticeAreas[];
  practiceareas: LegalPractices[];
  subpracticeareas: LegalSubPractices[];
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
        this.sortPeople = people;
        this.records = this.people.length;
        this.lastRecord = this.people.length;
        this.lastPage = Math.ceil(this.lastRecord / this.limit);
      }
    );
  }
  
  buildURL() {
    this.personURL = this.baseURL + this.activepeopleFilter + this.order + this.generalIncludes + this.endRequest;  // URL to web api
  }

    getTitles(currentperson: any): string {
    var currentJobTitle = currentperson.jobtitle.jobtitle;
    
    var addHTML = "<strong>" + currentJobTitle + "</strong>";
    var attorneyPracName = "No legalsubdeptfriendlyname"

    if (currentperson.isattorney == true) {
      addHTML = addHTML + '<br>'

      if (!currentperson.legalsubdepartments) { 
      }
      else {
        attorneyPracName = currentperson.legalsubdepartments.legalsubdeptfriendlyname;
      }
      
      addHTML = addHTML + attorneyPracName;
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

    phonenum = 'Phone: <a href="tel:+' + officePhone.phonenumber + '" data-toggle="tooltip" title="call ' + currentperson.displayname + '">' + phonenum + '</a><br>'
    return this.sanitizer.bypassSecurityTrustHtml(phonenum);
  }

  getAssistant(currentperson: any): SafeHtml {
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

  onSearchChange(search: string): void {
    this.activePeople = this.people.filter(p => p.lastname.toLowerCase().includes(search.toLocaleLowerCase()));
  }
  
  ifCPR(currentperson: any): SafeHtml {
    var _element, i;
    for (i=0; i < this.cprNAME.length; i++){
      if (currentperson.lastname == this.cprNAME[i]){
        _element = this.cprImg;
        return this.sanitizer.bypassSecurityTrustHtml(_element);
      }
    }
    return null;
  }

  ifNotary(currentperson: any): SafeHtml {
    var _element, i;
    for (i=0; i < this.notaryNAME.length; i++){
      if (currentperson.lastname == this.notaryNAME[i]){
        _element = this.notaryImg;
        return this.sanitizer.bypassSecurityTrustHtml(_element);
      }
    }
    return null;
  }


  sanitizeScript(sanitizer: DomSanitizer) {}
  
  ByLocation(id: string): void {
    var LabelElement, locationID;
    LabelElement = document.getElementById(this.cityLabelID);
    LabelElement.className = "normal-font  btn btn-outline-secondary";

    switch (id) {
      case "city6":
          locationID = null;
          LabelElement = document.getElementById("city6");
          LabelElement.className = "normal-font btn btn-outline-secondary active";
          this.cityLabelID = "city6";
         break;
      case "city1": 
          locationID = 4;
          LabelElement = document.getElementById("city1");
          LabelElement.className = "normal-font btn btn-outline-secondary active";
          this.cityLabelID = "city1";
         break;
      case "city2":
          locationID = 1;
          LabelElement = document.getElementById("city2");
          LabelElement.className = "normal-font btn btn-outline-secondary active";
           this.cityLabelID = "city2";
         break;
      case "city3":
          locationID = 2;
          LabelElement = document.getElementById("city3");
          LabelElement.className = "normal-font btn btn-outline-secondary active";
           this.cityLabelID = "city3";
         break;
      case "city4":
          locationID = 3;
          LabelElement = document.getElementById("city4");
          LabelElement.className = "normal-font btn btn-outline-secondary active";
          this.cityLabelID = "city4";
         break;
      case "city5":
          locationID = 5;
          LabelElement = document.getElementById("city5");
          LabelElement.className = "normal-font btn btn-outline-secondary active";
          this.cityLabelID = "city5";
         break;
      default: 
          locationID = null;
        break;
    }

    if (locationID == null) {
      this.activePeople = this.people;
    }
    else {
      this.activePeople = this.people.filter(obj => {    
        return obj.officelocationid === locationID});
    }
    this.pageNumber = 0;
    this.clearRole();
    this.clearAlpha();
  }

  clearLocation(): void {
    var _element
    _element = document.getElementById(this.cityLabelID);
    _element.className = "normal-font btn btn-outline-secondary";

    _element = document.getElementById("city6");
    _element.className = "normal-font btn btn-outline-secondary active";
    this.cityLabelID = "city6";

  }

  ByRole(role: string): void {
    var LabelElement, hrdept;
    LabelElement = document.getElementById(this.roleLabelID);
    LabelElement.className = "med-font btn btn-outline-secondary";

    switch (role) {
        case "Role1":
          //  hrdept = null;
          this.sortPeople = this.people;
          this.activePeople = this.sortPeople;
          LabelElement = document.getElementById("Role1");
          LabelElement.className = "med-font btn btn-outline-secondary active";
          this.roleLabelID = "Role1";
         break;
        case "Role2": 
          //  hrdept = 13; //"Partners"  hrdept = 1; //"Associates" 

          this.activePeople = this.sortPeople.filter(obj => {    
            return obj.isattorney === true});
          LabelElement = document.getElementById("Role2");
          LabelElement.className = "med-font btn btn-outline-secondary active";
          this.roleLabelID = "Role2";
         break;
      case "Role3":

          this.activePeople = this.sortPeople.filter(obj => {    
            return obj.isattorney === false && obj.hrdepartmentid != 9 });
          LabelElement = document.getElementById("Role3");
          LabelElement.className = "med-font btn btn-outline-secondary active";
          this.roleLabelID = "Role3";
         break;
      case "Role4":

          this.activePeople = this.sortPeople.filter(obj => {    
            return obj.hrdepartmentid === 9 });
          LabelElement = document.getElementById("Role4");
          LabelElement.className = "med-font btn btn-outline-secondary active";
          this.roleLabelID = "Role4";
         break;

      //  shouldn't reach any of these     
      case "Role5":
          hrdept = 9; //"Administration"
          LabelElement = document.getElementById("Role5");
          LabelElement.className = "small-font btn btn-outline-secondary active";
          this.roleLabelID = "Role5";
         break;
      case "Role6":
          hrdept = 8; //"Finance"
          LabelElement = document.getElementById("Role6");
          LabelElement.className = "small-font btn btn-outline-secondary active";
          this.roleLabelID = "Role6";
         break;
      case "Role7":
         hrdept = 7; //"Technology"
         LabelElement = document.getElementById("Role7");
         LabelElement.className = "small-font btn btn-outline-secondary active";
         this.roleLabelID = "Role7";
        break;
      case "Role8":
         hrdept = 6; //"Marketing"
         LabelElement = document.getElementById("Role8");
         LabelElement.className = "small-font btn btn-outline-secondary active";
         this.roleLabelID = "Role8";
        break;
      case "Role9":
         hrdept = 3; //"Human Resources"
         LabelElement = document.getElementById("Role9");
         LabelElement.className = "small-font btn btn-outline-secondary active";
         this.roleLabelID = "Role9";
        break;
      case "Role10":
        //  hrdept = 12; /"Word Processing"
         LabelElement = document.getElementById("Role10");
         LabelElement.className = "small-font btn btn-outline-secondary  active";
         this.roleLabelID = "Role10";
        break;
     default: 
        break;
    }
    //if (hrdept == null) {
    //  this.activePeople = this.sortPeople;
    //}
    //else {
    //  this.activePeople = this.sortPeople.filter(obj => {    
    //    return obj.hrdepartmentid === hrdept});
    //}
    this.pageNumber = 0;
    this.clearLocation();
    this.clearAlpha();
  }

  clearRole(): void {
    var _element
    _element = document.getElementById(this.roleLabelID);
    _element.className = "med-font btn btn-outline-secondary";

    _element = document.getElementById("Role1");
    _element.className = "med-font btn btn-outline-secondary active";
    this.roleLabelID = "Role1";
  }

  clearAlpha(): void {
    var _element
    _element = document.getElementById(this.alphaLabelID);
    _element.className = "btn btn-outline-secondary";

    _element = document.getElementById("alphaAll");
    _element.className = "btn btn-outline-secondary active";
    this.alphaLabelID = "alphaAll";
  }

  ByAlpha(alpha: string): void {
    var LabelElement;
    LabelElement = document.getElementById(this.alphaLabelID);
    LabelElement.className = "normal-font btn btn-outline-secondary";

    // research how to pull people by first letter of last name
    
    switch (alpha) {
      case "a":
          LabelElement = document.getElementById("alphaA");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaA";
         break;
      case "b": 
          LabelElement = document.getElementById("alphaB");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaB";
         break;
      case "c":
          LabelElement = document.getElementById("alphaC");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaC";
         break;
      case "d":
          LabelElement = document.getElementById("alphaD");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
           this.alphaLabelID = "alphaD";
         break;
      case "e":
          LabelElement = document.getElementById("alphaE");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaE";
         break;
      case "f":
          LabelElement = document.getElementById("alphaF");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaF";
         break;
      case "g":
         LabelElement = document.getElementById("alphaG");
         LabelElement.className = "btn btn-outline-secondary normal-font active";
         this.alphaLabelID = "alphaG";
        break;
      case "h":
          LabelElement = document.getElementById("alphaH");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaH";
        break;
      case "i":
          LabelElement = document.getElementById("alphaI");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaI";
        break;
      case "j":
          LabelElement = document.getElementById("alphaJ");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaJ";
         break;
      case "k":
          LabelElement = document.getElementById("alphaK");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaK";
         break;
      case "l":
          LabelElement = document.getElementById("alphaL");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaL";
        break;
      case "m":
          LabelElement = document.getElementById("alphaM");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaM";
          break;
      case "n":
          LabelElement = document.getElementById("alphaN");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaN";
         break;
      case "o":
          LabelElement = document.getElementById("alphaO");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaO";
        break;
      case "p":
          LabelElement = document.getElementById("alphaP");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaP";
        break;
      case "q":
          LabelElement = document.getElementById("alphaQ");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaQ";
        break;
      case "r":
          LabelElement = document.getElementById("alphaR");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaR";
         break;
      case "s":
          LabelElement = document.getElementById("alphaS");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaS";
        break;
      case "t":
          LabelElement = document.getElementById("alphaT");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaT";
        break;
      case "u":
          LabelElement = document.getElementById("alphaU");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaU";
        break;
      case "v":
          LabelElement = document.getElementById("alphaV");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaV";
         break;
      case "w":
          LabelElement = document.getElementById("alphaW");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaW";
        break;
      case "x":
          LabelElement = document.getElementById("alphaX");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaX";
        break;
      case "y":
          LabelElement = document.getElementById("alphaY");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaY";
        break;
      case "z":
          LabelElement = document.getElementById("alphaZ");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaZ";
         break;
      default: 
          LabelElement = document.getElementById("alphaAll");
          LabelElement.className = "btn btn-outline-secondary normal-font active";
          this.alphaLabelID = "alphaAll";
        break;
    }
    if (alpha == null) {
      this.activePeople = this.sortPeople;
    }
    else {
      this.activePeople = this.people.filter(p => p.lastname[0].toLowerCase().includes(alpha.toLocaleLowerCase()));
    } 
    this.clearRole();
    this.clearLocation();
  }
}
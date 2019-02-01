// people.compenents.ts

import { Component, OnInit, Input, ViewChild, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl, SafeValue } from '@angular/platform-browser';
import { Person } from '../person';
import { iData, APIHeader } from '../JUNK';
import { HttpClient, HttpHeaders, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { APIService } from '../api.service';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

// datatables 
import { PersonPage } from '../datatables/AllTextFields';
import { OfficeLocation, RoomLocation } from '../datatables/officelocation';
import { Schools, Education, DegreeTypes } from '../datatables/school';
import { Phones } from '../datatables/phones';
import { JobTitle, JobTypes } from '../datatables/jobs';
import { Photos } from '../datatables/photo';
import { LegalPractices, AttorneyPracticeAreas, LegalSubPractices, License, LicenseType } from '../datatables/practicestables';
import { HRDepartments, LegalDepartments, LegalSubDepartments } from '../datatables/departmenttables';
import { PersonRelationship, Secretaries } from '../datatables/personrelationship';
import { NgxPaginationModule } from 'ngx-pagination';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { ACTIVE_INDEX } from '@angular/core/src/render3/interfaces/container';
import { PersonSearchComponent } from '../person-search/person-search.component';
import { identifierModuleUrl } from '@angular/compiler';
import { forEach } from '@angular/router/src/utils/collection';
import { filterQueryId } from '@angular/core/src/view/util';


@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css'],
})

@Injectable({
  providedIn: 'root'
})

export class PeopleComponent implements OnInit {

  public baseURL = 'http://am-web05:3030/api/v1/people';
  public schoolURL = 'http://am-api:3030/api/v1/schools';
  public degreeTypesURL = 'http://am-api:3030/api/v1/degreetypes'
  public educationURL = 'http://am-api:3030/api/v1/education';
  public legalsubdeptsURL = 'http://am-api:3030/api/v1/legalsubdepartments';
  public roomLocationURL = './assets/location.json'


  // Filters
  public activepeopleFilter = '?filter={"where":{"or":[{"employmentstatus":"A"},{"employmentstatus":"L"}]},'
  public All = this.activepeopleFilter;
  public addFilter = this.All;


  //includes
  private officeFilter = '"emails","phones","jobtitle","officelocation","hrdepartment","photo","personrelationship"';
  private practiceFilter = '"attorneypractices","practices","legalsubdepartments","licenses","licensetype"';
  private educationFilter = '"education","schools","degreetypes"';
  public generalIncludes = '"include":[' + this.officeFilter + ',' + this.practiceFilter + ']';
  public endRequest = '}';

  private order = '"order":"lastname ASC",'
  public personURL = this.baseURL + this.activepeopleFilter + this.order + this.generalIncludes + this.endRequest;

  public hrdepartmentFilter = "";
  public cprImg = '<img src="../assets/cpr.png" class="cprimg" data-toggle="tooltip" title="CPR Certified" width="25px;">';
  public notaryImg = '<img src="../assets/notary.png" class="notaryimg" data-toggle="tooltip" title="Notary Public" width="25px;">';

  public pageNumber = 1;
  public limit = 10;
  public records;
  public numDisplayStart;
  public numDisplayEnd;
  public lastRecord;
  public lastPage;
  public Math = Math;

  public cities = [
    {
      'city': 'CC',
      'id': 4
    },
    {
      'city': 'LA',
      'id': 1
    },
    {
      'city': 'OC',
      'id': 2
    },
    {
      'city': 'SD',
      'id': 3
    },
    {
      'city': 'SF',
      'id': 5
    }
  ];
  public roles = [
    {
      'role': 'Partners',
      'id': 13
    },
    {
      'role': 'Associate',
      'id': 1
    },
    {
      'role': 'Paralegal',
      'id': 10
    },
    {
      'role': 'Staff',
      'id': 20
    }
  ];

  public staffDept = [
    {
      'name': 'Partner',
      'id': 13
    },
    {
      'name': 'Associate',
      'id': 1
    },
    {
      'name': 'Paralegal',
      'id': 10
    },
    {
      'name': 'Human Resources',
      'id': 3
    },
    {
      'name': 'Library',
      'id': 4
    },
    {
      'name': 'Recruiting',
      'id': 5
    },
    {
      'name': 'Marketing',
      'id': 6
    },
    {
      'name': 'Technology',
      'id': 7
    },
    {
      'name': 'Finance',
      'id': 8
    },
    {
      'name': 'Administration',
      'id': 9
    },
    {
      'name': 'Secretary',
      'id': 11
    },
    {
      'name': 'Word Processing',
      'id': 12
    }
  ];

  public timekeeperDept = [
    {
      'name': 'Corporate & Finance',
      'id': '(C&F)'
    },
    {
      'name': 'Litigation',
      'id': '(LIT)'
    },
    {
      'name': 'Real Estate',
      'id': '(RE)'
    }
  ];

  @ViewChildren('nGForArray') filtered;
  public otherArray = [];
  public staffDeptId = 0;
  public timekeeperDeptId = 0;
  public cityidArray = [4, 1, 2, 3, 5];
  public roleidArray = [13, 1, 10, 20];
  public roleCheckAll = true;
  public showAdvFilter = false;
  public cityid = null;
  public roleid = null;
  public searchTerm = null;
  public alpha = null;
  public page = null;
  public alphabets =
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  public individualid = null;

  url: string;
  people: Person[];
  person: any;
  activePeople: Person[];
  roomLocation: RoomLocation[];
  //completePerson: PersonPage[];
  relationships: PersonRelationship[];
  schools: Schools[];
  phone: Phones[];
  router: RouterLink;
  jobs: JobTitle[];
  hrdepts: HRDepartments[];
  attorneyareas: AttorneyPracticeAreas[];
  practiceareas: LegalPractices[];
  subpracticeareas: LegalSubPractices[];
  legalDepts: LegalDepartments[];
  legalsubdepts: LegalSubDepartments[];
  license: License[];
  licensetype: LicenseType[];
  photo: Photos[];
  degrees: DegreeTypes[];
  education: Education[];

  constructor(
    private staffService: APIService,
    private http: HttpClient,
    protected sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private _router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.getLegalSubDepts();
    this.getRoomLocation();
    this.getPeople();
    //this.getSchools();
  }

  getLegalSubDepts(): any {
    this.staffService.getLegalSub(this.legalsubdeptsURL)
      .subscribe(legalsubdepts => {
        this.legalsubdepts = legalsubdepts;
      });
  }

  getRoomLocation(): any {
    this.staffService.getLocation(this.roomLocationURL)
      .subscribe(roomLocation => {
        this.roomLocation = roomLocation;
      });
  }

  getPeople(): any {
    this.buildURL();
    //console.log(this.personURL);
    this.staffService.getDATA(this.personURL)
      .subscribe(people => {
        this.people = people;

        // **************************
        // build list of supportedpeople;
        // build officefloorid for each person

        for (let i = 0; i < this.people.length; i++) {
          if (this.people[i]) {
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
      });
      this.route.queryParamMap.subscribe(params => {
        const queryStrings: any = this.route.queryParamMap;
        this.executeQueryParams(queryStrings.source.value);
      });
  }

  buildURL() {
    this.personURL = this.baseURL + this.activepeopleFilter + this.order + this.generalIncludes + this.endRequest;  // URL to web api
  }

  getPerson(id): string {
    if (!id) return null;
    let findPerson = this.people.find(p => {
      return p.pkpersonid === id;
    })
    if (!findPerson) {
      return "No name found";
    }
    return findPerson.displayname;
  }

  getSubDept(currentperson: any) {
    if (currentperson.isattorney == true) {
      currentperson.legalsubdeptfriendlyname = currentperson.legalsubdepartments.legalsubdeptfriendlyname;
    }
  }

  getFloorLocation(currentperson: Person) {
    let floorID = this.roomLocation.find(p => {
      return p.officelocationid === currentperson.officelocationid && p.officenumber === currentperson.officenumber
    });
    if (floorID) {
      //  The following line will be used for the internal maps 
      currentperson.officefloorid = floorID.officefloorid;
      currentperson.floornumber = this.officeFloor(floorID.officefloorid);
      currentperson.officecity = floorID.city.toLowerCase();
      currentperson.officecityfullname = floorID.cityfullname;      
    }
  }

  getTitles(currentperson: any): string {
    var currentJobTitle = currentperson.jobtitle.jobtitle;

    var addHTML = "<strong>" + currentJobTitle + "</strong>";

    if (currentperson.isattorney == true) {
      addHTML = addHTML + '<br>' + currentperson.legalsubdeptfriendlyname;
    }
    return addHTML;
  }

  getPhoto(photodata: any): SafeHtml {
    var photoString, photoURL: any;

    if (photodata.length == 0) {
      photoString = '<img src="http://amjabber/nophoto.gif" id="no photo" width="112px;" />'
    }
    else {

      photoURL = photodata[0].photolocationpath + photodata[0].photofilename;
      photoString = '<img src="' + photoURL + '" id="' + photodata[0].photofilename + '" width="112px;" />';
    }


    return this.sanitizer.bypassSecurityTrustHtml(photoString);
  }

  getEmail(EMAIL: string, personName: string): string {
    var emailString = '<a href=mailto:' + EMAIL + ' id=' + personName + ' >' + EMAIL + '</a>';

    return emailString;
  }

  getPrefName(currentperson: any): string {
    let pName;
    if (currentperson.firstname == currentperson.preferredfirstname || !currentperson.preferredfirstname) {
      return null;
    }
    else pName = '"' + currentperson.preferredfirstname + '"';
    return pName;
  }

  getPhone(currentperson: any): SafeHtml | SafeValue {
    var phonetypeid = 1;
    var officePhone = currentperson.phones.find(obj => {
      return obj.phonetypeid === phonetypeid;
    });

    if (!officePhone) {
      var nophone = 'Phone: NO Office Phone Number<br>'
      return nophone;
    }

    var pnum = officePhone.phonenumber;
    pnum = pnum.replace(/\D+/g, '')
      .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

    var phonenum = 'x' + officePhone.phoneextension;
    phonenum = phonenum + '&nbsp;Phone: ' + pnum + '<br>';
    return this.sanitizer.bypassSecurityTrustHtml(phonenum);

    //  USE IF WE WANT TO ADD LINKS TO THE PHONE NUMBERS  
    //var phonenum = 'x<a href="tel:+' + officePhone.phoneextension + '" data-toggle="tooltip" title="extension">' + officePhone.phoneextension + '</a>';
    //phonenum = phonenum + '&nbsp;Phone: <a href="tel:+' + officePhone.phonenumber + '" data-toggle="tooltip" title="call ' + currentperson.displayname + '">' + pnum + '</a><br>';
    //return this.sanitizer.bypassSecurityTrustHtml(phonenum);  }
  }

  goBack(): void {
    this.location.back();
  }

  ifCPR(currentperson: any): SafeHtml {
    var _element;

    for (let i = 0; i < currentperson.licensetype.length; i++) {
      if (currentperson.licensetype[i].licensetypeid == 3) {
        _element = this.cprImg;
        return this.sanitizer.bypassSecurityTrustHtml(_element);
      }
    }
    return "";
  }

  ifNotary(currentperson: any): SafeHtml {
    var _element, i;
    for (i = 0; i < currentperson.licensetype.length; i++) {
      if (currentperson.licensetype[i].licensetypeid == 2) {
        _element = this.notaryImg;
        return this.sanitizer.bypassSecurityTrustHtml(_element);
      }
    }
    return "";
  }

  getOfficeFloor(id): string {
    let floorNum = id;
    return this.officeFloor(floorNum);
  }

  officeFloor(id): string {
    var floor;
    switch (id) {
      case 1:
        floor = "26";
        break;
      case 2:
        floor = "27";
        break;
      case 3:
        floor = "28";
        break;
      case 4:
        floor = "29";
        break;
      case 5:
        floor = "04";
        break;
      case 6:
        floor = "05";
        break;
      case 7:
        floor = "26";
        break;
      case 8:
        floor = "27";
        break;
      case 9:
        floor = "18";
        break;
      case 10:
        floor = "12";
        break;
      case 11:
        floor = "13";
        break;
    }
    return floor;
  }

  getBAR(currentperson: any): SafeHtml {
    let barnum = "";
    if (currentperson.licenses) {
      for (let i = 0; i < currentperson.licenses.length; i++) {
        //console.log("number of bar licences" + i);
        if (!currentperson.licenses[i].licensenumber) break;
        barnum = barnum + currentperson.licenses[i].licensestate
          + '&nbsp;Bar:&nbsp;' + currentperson.licenses[i].licensenumber + '<br>';
      }
    }
    return this.sanitizer.bypassSecurityTrustHtml(barnum);
  }

  ifWebBio(currentperson: any): SafeHtml {
    let webbio = '&nbsp;<a href="http://' + currentperson.addomainaccount
      + '.allenmatkins.com" id="web bio for "' + currentperson.displayname + '" >'
      + '<img src="../../assets/web.png" data-toggle="tooltip" title="Web Bio" width="15px;"></a>'
    return this.sanitizer.bypassSecurityTrustHtml(webbio);
  }


  sanitizeScript(sanitizer: DomSanitizer) { }

  clearALL(key): void {
    this.searchTerm = null;
    switch (key) {
      case "alpha":
      this.addQueryParams({ alpha: null, page: null });
        break;
      case "city":
        if (this.cityid) {
          this.addQueryParams({ city: null, page: null });
        }
        break;
      case "role":
        this.addQueryParams({ role: null, page: null });
        break;
      case "ind":
        this.addQueryParams({ ind: null, page: null });
        break;
    }
  }

  addQueryParams(query): void {
    const keys = Object.keys(query);
    const values = Object.values(query);
    for(let i = 0; i < keys.length; i++) {
      switch (keys[i]) {
        case 'city':
          this.cityid = values[0];
          break;
        case 'role':
          this.roleid = values[0];
          break;
        case 'ind':
          this.individualid = values[0];
          break;
      }
    }
    //console.log(query);
    if (keys[0] === 'ind') {
      this._router.navigate([''], {
        queryParams: {
          ...query
        }
      });
    } else {
      if (query === "") {
        query = null;
      }
      this._router.navigate([''], {
        queryParams: {
          ...query
        },
        queryParamsHandling: 'merge',
      });
    }
  }

  clearQueryParams(): void {
    this.clearFilters();
    this._router.navigate([''], {
      queryParams: {
      }
    });
  }

  executeQueryParams(queryStrings): void {
    const queries = Object.entries(queryStrings);
    this.clearFilters();
    for (const q of queries) {
      switch (q[0]) {
        case 'page':
          this.pageNumber = +q[1];
          break;
        case 'role':
          this.roleid = +q[1];
          break;
        case 'alpha':
          this.alpha = q[1];
          break;
        case 'city':
          this.cityid = +q[1];
          break;
        case 'search':
          this.searchTerm = q[1];
          break;
        case 'ind':
          this.individualid = +q[1];
          break;
        case 'cities':
          this.cityidArray = (q[1] as string).split(',').map(Number);
          this.showAdvFilter = true;
          break;
        case 'roles':
          this.cityidArray = (q[1] as string).split(',').map(Number);
          this.showAdvFilter = true;
          break;
        case 'staffdept':
          this.staffDeptId = +q[1];
          this.showAdvFilter = true;
          break;
        case 'timekeeperdept':
          this.timekeeperDeptId = +q[1];
          this.showAdvFilter = true;
          break;
        case 'other':
          this.otherArray = (q[1] as string).split(',').map(Number);
          this.showAdvFilter = true;

      }
    }
  }

  clearFilters() {
    this.staffDeptId = 0;
    this.timekeeperDeptId = 0; 
    this.cityidArray = [4, 1, 2, 3, 5];
    this.roleidArray = [13, 2, 1, 10, 20];
    this.otherArray = [];
    this.roleCheckAll = true;
    this.cityid = null;
    this.roleid = null;
    this.searchTerm = null;
    this.alpha = null;
    this.individualid = null;
    this.pageNumber = null;
  }

  includeCities(cityid): void {
    const index = this.cityidArray.indexOf(cityid);
    if (index == -1) {
      this.cityidArray.push(cityid);
    } else {
      this.cityidArray.splice(index, 1);
    }
    this.addQueryParams({ cities: this.cityidArray.toString() })
  }

  cityIsChecked(cityid) {
    if (cityid === 6) {
      return this.cityidArray.length === 5 ? true : false;
    } else {
      return this.cityidArray.indexOf(cityid) >= 0;
    }
  }

  includeRoles(roleid): void {
    const index = this.roleidArray.indexOf(roleid);
    if (index == -1) {
      this.roleidArray.push(roleid);
    } else {
      this.roleidArray.splice(index, 1);
    }
    this.addQueryParams({ roles: this.roleidArray.toString() })
  }

  roleIsChecked(roleid) {
    if (roleid === 999) {
      return this.roleidArray.length === 5 ? true : false;
    } else {
      return this.roleidArray.indexOf(roleid) >= 0;
    }
  }

  includeOthers(id): void {
    const index = this.otherArray.indexOf(id);
    if (index == -1) {
      this.otherArray.push(id);
    } else {
      this.otherArray.splice(index, 1);
    }
    this.addQueryParams({ other: this.otherArray.length > 0 ? this.otherArray.toString() : null })
  }


  // ************************************
  //
  //  additional functions not yet implemented 
  //
  // ************************************

  /*  comment out to the end  
  buildCompletePerson(): any {

    var tempTable: any;

    if (!this.people) console.log("No People[]");

    for (let i = 0; i < 1; i++) {
      this.completePerson[i].addomainaccount = this.people[i].addomainaccount;
      this.completePerson[i].pkpersonid = this.people[i].pkpersonid;
      this.completePerson[i].lastname = this.people[i].lastname;
      this.completePerson[i].firstname = this.people[i].firstname;
      this.completePerson[i].middlename = this.people[i].middlename;
      this.completePerson[i].preferredfirstname = this.people[i].preferredfirstname;
      this.completePerson[i].displayname = this.people[i].displayname;
      this.completePerson[i].initials = this.people[i].initials;
      this.completePerson[i].prefix = this.people[i].prefix;
      this.completePerson[i].suffix = this.people[i].suffix;
      this.completePerson[i].timekeepernumber = this.people[i].timekeepernumber;
      this.completePerson[i].ultiproemployeeid = this.people[i].ultiproemployeeid;
      this.completePerson[i].addomainaccount = this.people[i].addomainaccount;
      this.completePerson[i].adprincipaldomainaccount = this.people[i].adprincipaldomainaccount;
      this.completePerson[i].officenumber = this.people[i].officenumber;

      tempTable = this.hrdepts.find(obj => obj.hrdepartmentid === this.people[i].hrdepartmentid);
      this.completePerson[i].hrdepartmentname = tempTable.hrdepartmentname;

      tempTable = this.jobs.find(obj => obj.jobtitleid === this.people[i].jobtitleid);
      this.completePerson[i].jobtitle = tempTable.jobtitle;

      //tempTable = this.
      //this.completePerson[i].officelocationname = this.people[i].addomainaccount;

    }

  }

  usePeople(): any {
    return this.people;
  }
  getSchools(): any {
    this.staffService.getSchools(this.schoolURL)
      .subscribe(schools => {
        this.schools = schools;
      });
    this.staffService.getEducation(this.schoolURL)
      .subscribe(education => {
        this.education = education;
      });
    this.staffService.getDegrees(this.degreeTypesURL)
      .subscribe(degrees => {
        this.degrees = degrees;
      });
  }

  getEducation(currentperson: Person): string {
    let attorneyeducation = null;
    if (currentperson.isattorney == true) {
      attorneyeducation = "Education: ";

      currentperson.education = this.education.filter(obj => {
        return obj.pkpersonid === currentperson.pkpersonid;
      })
      for (let i = 0; i < this.education.length; i++) {
        let aDegree = this.degrees.find(obj => {
          return obj.degreetypeid === this.education[i].degreetypeid;
        });
        this.education[i].degreename = aDegree.degreetypename;

        let aSchool = this.schools.find(obj => {
          return obj.schoolid === this.education[i].schoolid;
        });
        this.education[i].schoolname = aSchool.schoolname;

        attorneyeducation = attorneyeducation + this.education[i].degreename
          + '&nbsp;' + this.education[i].schoolname
          + '&nbsp;' + this.education[i].graduationyear + '<br>';
      }
    }

    return attorneyeducation;
  }
  */



}

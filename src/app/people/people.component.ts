// people.compenents.ts

import { Component, OnInit, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeHtml,  SafeValue } from '@angular/platform-browser';
import { AppComponent } from '../app.component';
import { DevVariablesComponent } from '../dev-variables/dev-variables.component';
import { Person } from '../datatables/person';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/takeUntil';
import { APIService } from '../api.service';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

// datatables 
import {  RoomLocation } from '../datatables/officelocation';
import { Phones } from '../datatables/phones';
import { JobTitle, JobTypes } from '../datatables/jobs';
import { Photos } from '../datatables/photo';
import { LegalPractices, AttorneyPracticeAreas, LegalSubPractices, License, LicenseType } from '../datatables/practicestables';
import { HRDepartments, LegalDepartments, LegalSubDepartments } from '../datatables/departmenttables';
import { PersonRelationship } from '../datatables/personrelationship';


@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css'],
})

@Injectable({
  providedIn: 'root'
})

export class PeopleComponent implements OnInit {

  public cprImg = '<img src="/assets/cpr.png" class="cprimg" data-toggle="tooltip" title="CPR Certified" width="25px;">';
  public notaryImg = '<img src="/assets/notary.png" class="notaryimg" data-toggle="tooltip" title="Notary Public" width="25px;">';

  public pageNumber = 1;
  public limit = 12;
  public records;
  public numDisplayStart;
  public numDisplayEnd;
  public lastRecord;
  public lastPage;
  public Math = Math;

  public profileData$: Observable<any>;
  public tokRefresh$: Observable<any>;
  public logout$: Observable<any>;
  private resBody = "";
  public token;
  public userID;

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
    public timekeeperDeptId = '';
    public timekeeperon = true;
    public cityidArray = [4, 1, 2, 3, 5];
    public roleidArray = [13, 1, 10, 20];
    public stafflist = false;
    public tklist = false;
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
    public currentStaffDept = 'All';
    public mobile = false;
    public loginStatus: boolean;
  
    public showLoadingIndicator = true;

    public people$: Promise<Person[]>;
    public legalSub$: Promise<any[]>;
    public userData$: Promise<any>;
    public people: Person[];
    public userName: string;
    person: any;
    roomLocation: RoomLocation[];
    relationships: PersonRelationship[];
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
    
  constructor(
    private mainApp: AppComponent,
    private debugging: DevVariablesComponent,
    private apiService: APIService,
    private http: HttpClient,
    protected sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private _router: Router,
    private location: Location
  ) { this.showLoadingIndicator = true; 
      this.apiService.initAuth();
     }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const queryStrings: any = this.route.queryParamMap;
      this.executeQueryParams(queryStrings.source.value);
    });

    this.initData();
     
  }

  ngOnDestroy() { }

  initData() {
    console.log("initData");
    if ( this.apiService.people ) {
      console.log("people exist!")
      this.people = this.apiService.people;
    }
    else {
      if ( !this.debugging.onLocalHost ) {
        this.apiService.initAuth().then( res => {
          this.resBody = res.body;
          const lastToken = res.body[0].access_token.slice(Math.max(res.body[0].access_token.length - 30, 1));
          this.token = res.body[0].access_token;
          this.userID = res.body[0].user_id;
          if (this.debugging.onDebug ) { 
              console.log("token: " + lastToken);
          };
          this.apiService.initLegalSub().then(legalsubdepts => {
            this.legalsubdepts = legalsubdepts;
          });
              
          this.apiService.initPeople().then(people => {
            this.people = people;
            this.buildAllPeopleData();
            this.showLoadingIndicator = false;
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
          this.showLoadingIndicator = false;
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
            if (this.debugging.onDebug) { console.log(this.people[k]) };
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
 
  
  getPerson(id): string {
    if (!id) return null;
    let findPerson = this.people.find(p => {
      return p.pkpersonid === id;
    })
    if (!findPerson) {
      return "No name found";
    }
    let personname = findPerson.firstname + " " + findPerson.lastname;
    return personname;
  }

  getTitles(currentperson: any): string {
    var currentJobTitle = currentperson.jobtitle.jobtitle;

    var addHTML = "<strong>" + currentJobTitle + "</strong>";

    if (currentperson.legalsubdepartments && 
      currentperson.jobtitle.jobtypeid == 3 ||
      currentperson.jobtitle.jobtypeid == 11 ||
      currentperson.jobtitle.jobtypeid == 12 ) {

        if (currentperson.legalsubdeptfriendlyname) { 
          addHTML = addHTML + '<br>' + currentperson.legalsubdeptfriendlyname;
        };
    };
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

  getMiddleName(currentperson: any): string {
    let mname;
    if (!currentperson.middlename) {
      return null;
    }
    else {
      if (currentperson.middlename.length == 1){
        mname = currentperson.middlename + ". ";
      }
      else {
        mname = currentperson.middlename + " ";
      }
    }
    return mname;
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
    // if ( this.debugging.onDebug ) console.log(pnum);
    pnum = pnum.replace(/\D+/g, '')
      .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

    var phonenum = 'x' + officePhone.phoneextension;
    phonenum = phonenum + '&nbsp;Phone: ' + pnum + '<br>';
    return this.sanitizer.bypassSecurityTrustHtml(phonenum);

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
        //if ( this.debugging.onDebug ) console.log("number of bar licences" + i);
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
      + '<img src="/assets/web.png" data-toggle="tooltip" title="Web Bio" width="15px;"></a>'
    return this.sanitizer.bypassSecurityTrustHtml(webbio);
  }

  sanitizeScript(sanitizer: DomSanitizer) { }

  setStaffDept(id): void {
    if (id == 0 || id== 1 || id == 10 || id == 13){
      this.timekeeperon = true;
    }
    else {
      this.timekeeperon = false;
      this.timekeeperDeptId = null;
    }
  }

  setTimekeeper(id): void {
    if (id == 0 || id== 1 || id == 10 || id == 13){
      this.timekeeperon = true;
      this.addQueryParams({ staffDept: id, page: null });
    }
    else {
      this.timekeeperon = false;
      this.timekeeperDeptId = null;
      this.addQueryParams({ staffDept: id, timekeeperDeptId: null, page: null });
    }
  }

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
      case "all":
        this.addQueryParams({ alpha: null, city: null, role: null, ind: null, page: null, search: null  });
        break;
    }
  }

  addQueryParams(query): void {
    const keys = Object.keys(query);
    const values = Object.values(query);
    for (let i = 0; i < keys.length; i++) {
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
    //if ( this.debugging.onDebug ) console.log(query);
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
    document.getElementById("CPRbox")
    document.getElementById("Notarybox")

  }

  clearFilters() {
    this.staffDeptId = 0;
    this.timekeeperDeptId = '';
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
          this.timekeeperDeptId = (q[1] as string);
          this.showAdvFilter = true;
          break;
        case 'other':
          this.otherArray = (q[1] as string).split(',').map(Number);
          this.showAdvFilter = true;

      }
    }
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

  timekeeperStatus() {
    switch (this.timekeeperDeptId) {
      case '':
        return 'All';
      case '(C&F)':
        return 'Corporate & Finance';
      case '(LIT)':
        return 'Litigation';
      case '(RE)':
        return 'Real Estate';
    }
  }

  staffDeptStatus() {
    switch (this.staffDeptId) {
      case 0:
        return 'All';
      case 13:
        return 'Partner';
      case 1:
        return 'Associate';
      case 10:
        return 'Paralegal';
      case 3:
        this.timekeeperDeptId = ""
        return 'Human Resources';
      case 4:
        this.timekeeperDeptId = ""
        return 'Library';
      case 5:
        this.timekeeperDeptId = ""
        return 'Recruiting';
      case 6:
        this.timekeeperDeptId = ""
        return 'Marketing';
      case 7:
        this.timekeeperDeptId = ""
        return 'Technology';
      case 8:
        this.timekeeperDeptId = ""
        return 'Finance';
      case 9:
        this.timekeeperDeptId = ""
        return 'Administration';
      case 11:
        this.timekeeperDeptId = ""
        return 'Secretary';
      case 12:
        this.timekeeperDeptId = ""
        return 'Word Processing';
    }
  }

  onSearch(searchVal) {
    this.searchTerm = searchVal;
    if (this.searchTerm) {
      this.addQueryParams({ search: this.searchTerm });
    } else {
      this.addQueryParams({ search: null });
    }
  }




}

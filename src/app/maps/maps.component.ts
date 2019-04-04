import { Component, OnInit, Input, ViewChild, ViewChildren, OnChanges, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { APIService } from '../api.service';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Person } from '../person';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl, SafeValue } from '@angular/platform-browser';


import { InlineSVGModule } from 'ng-inline-svg';
import * as Svg from 'svg.js'

import { HighlightDelayBarrier } from 'blocking-proxy/built/lib/highlight_delay_barrier';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapComponent implements OnInit {

  public baseURL = 'http://am-web05:3030/api/v1/people';
  public activepeopleFilter = '?filter={"where":{"or":[{"employmentstatus":"A"},{"employmentstatus":"L"}]},';
  private order = '"order":"lastname ASC",';
  private officeFilter = '"emails","phones","jobtitle","officelocation","hrdepartment","photo","personrelationship"';
  private practiceFilter = '"attorneypractices","practices","legalsubdepartments","licenses","licensetype"';
  public generalIncludes = '"include":[' + this.officeFilter + ',' + this.practiceFilter + ']';
  public endRequest = '}';
  public personURL = this.baseURL + this.activepeopleFilter + this.order + this.generalIncludes + this.endRequest;

  public floorURL = 'http://am-api:3030/api/v1/officefloors';
  public officelocationURL = 'http://am-api:3030/api/v1/officelocations';

  public floor = ['04', '05', '12', '13', '18', '26', '27', '28', '29'];
  public floorID = null;
  public cities = ['CC', 'LA', 'OC', 'SD', 'SF'];
  public cityName = null;
  public officeID = null;
  public showAdvFilter = false;
  public searchTerm = null;
  public individualid = null;

  people: Person[];
  regions: any[];

  constructor(
    private staffService: APIService,
    private route: ActivatedRoute,
    protected sanitizer: DomSanitizer,
    private _router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    //this.getOfficeFloors();
    //this.getOfficeLocations();
    this.colorOffice('o2849');
    const queryStrings: any = this.route.queryParamMap;
    //console.log(this.route);
    this.executeQueryParams(queryStrings.source.value);
    this.staffService.getDATA(this.personURL)
      .subscribe(people => {
        this.people = people;
      });
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

  generateMap(): string {
    var mapImg = '<img src="assets/la-28.svg" class="basemap">';
    return mapImg;
  }

  colorOffice(officeID: string): void {
    let officesvg = document.getElementById("map");
    //  officesvg.getSVGDocument() - this doesn't work
    //  but I need someway to get the element. 

    //  Get the element in the SVG map file - and adjust the fill. 
    //officesvg.fill = "#FFC1C1";
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
    // this.cityName = event.substring(0, 2);
    // this.floorID = event.substring(2, 4);
    // this.addQueryParams({ 'city': this.cityName, 'floor': this.floorID });
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

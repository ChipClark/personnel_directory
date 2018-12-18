import { Component, OnInit, Input  } from '@angular/core';
import { ActivatedRoute, RouterLink, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Person}         from '../person';
import { APIService }  from '../api.service';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl, SafeValue } from '@angular/platform-browser';
import { PeopleComponent } from '../people/people.component';

@Component({
  selector: 'app-staff-detail',
  templateUrl: './staff-detail.component.html',
  styleUrls: ['./staff-detail.component.css']
})

export class StaffDetailComponent implements OnInit {

  private id;

  url: string;
  people: Person[];
  person: Person;
  router: RouterLink;
  params: Params;
  
  @Input() selectedPerson: Person;
 
  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private staffService: APIService,
    private personService: PeopleComponent,
    private location: Location,
    protected sanitizer: DomSanitizer
  ) {}
 
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get("id"), 
      this.getPerson(this.id)
    });
  }
 
  getPerson(id: number): void {
    this.url = this.personService.baseURL + this.id + this.personService.All + this.personService.generalIncludes + this.personService.endRequest;;
    console.log(this.url);
    this.staffService.getPersonID(this.url) 
      .subscribe(
        people => {
          this.person = people
      });
  }

  getPersonTitles(currentperson: any): string {
    return this.personService.getPersonTitles(currentperson); 
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

  goBack(): void {
    this.location.back();
  }

  sanitizeScript(sanitizer: DomSanitizer){}

}

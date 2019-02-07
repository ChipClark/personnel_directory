import { Component, OnInit, Input  } from '@angular/core';
import { ActivatedRoute, RouterLink, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Person}         from '../person';
import { APIService }  from '../api.service';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl, SafeValue } from '@angular/platform-browser';
import { PeopleComponent } from '../people/people.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-staff-detail',
  templateUrl: './staff-detail.component.html',
  styleUrls: ['./staff-detail.component.css']
})

export class StaffDetailComponent implements OnInit {

  private id;
  private individualURL;

  url: string;
  people: Person[];
  allPeople: Person[];
  person: Person[];
  router: RouterLink;
  params: Params;
  
  @Input() selectedPerson: Person;
 
  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private staffService: APIService,
    private personService: PeopleComponent,
    protected sanitizer: DomSanitizer
  ) {}
 
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get("id"), 
      this.staffService.getDATA(this.personService.personURL)
        .subscribe(people => {
          this.people = people;
          this.getPerson(this.id);
        });
    });
  }
 
  getPerson(id: number): void {
    this.individualURL =  this.personService.baseURL + id + this.personService.activepeopleFilter
       + this.personService.generalIncludes + this.personService.endRequest;
       
    this.staffService.getDATA(this.individualURL)
      .subscribe(people => {
        this.allPeople = people;
        this.person = people;
      });
  }

  personTitles(currentperson: any): SafeHtml {
      return this.personService.getTitles(currentperson);
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
    
  }

  //photo(photo: any): SafeHtml {
  //  return this.personService.getPhoto(photo);
  //}

  relationships(currentperson: any): SafeHtml {
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

  sanitizeScript(sanitizer: DomSanitizer){}

  ifCPR(currentperson: any): SafeHtml {
    return this.personService.ifCPR(currentperson);
  }

  ifNotary(currentperson: any): SafeHtml {
    return this.personService.ifNotary(currentperson);
  }

  prefName(preferredfirstname: string): string {
    return this.personService.getPrefName(preferredfirstname);
  }

}

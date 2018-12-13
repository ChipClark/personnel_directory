import { Component, OnInit, Input  } from '@angular/core';
import { ActivatedRoute, RouterLink, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Person}         from '../person';
import { APIService }  from '../api.service';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl, SafeValue } from '@angular/platform-browser';

@Component({
  selector: 'app-staff-detail',
  templateUrl: './staff-detail.component.html',
  styleUrls: ['./staff-detail.component.css']
})

export class StaffDetailComponent implements OnInit {

  private id;

  private baseURL = 'http://am-web05:3030/api/people/';
  private All = '?filter={"where":{"employmentstatus":"A"},'
  private generalIncludes = '"include":["emails","phones","jobtitle","officelocation","hrdepartment","personrelationship","education","schools","degreetypes","attorneypractices","practices","legalsubdepartments"]}';
  
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
    this.url = this.baseURL + this.id + this.All + this.generalIncludes;
    this.staffService.getPersonID(this.url) 
      .subscribe(
        people => {
          this.person = people
      });
  }

  getPersonTitles(currentperson: any): string {
    console.log(currentperson);
    var dump = "should be a title <br>";
    return dump;
    var currentJobTitle = currentperson.jobtitle.jobtitle;
    
    var addHTML = "<strong>" + currentJobTitle + "</strong>";

    if(currentperson.practices.length > 0) {
      addHTML = addHTML + "<br>";
      var currentPractices = currentperson.practices;
      var i;
      for(i = 0; i < currentPractices.length; i++){
        if(i > 0  ) {
          addHTML = addHTML + ",";
          if( i == 2 || i == 4 ) {
            addHTML = addHTML + "<br>";
          }
        }
        addHTML = addHTML + " " + currentPractices[i].practicename;
        
      }
      addHTML = addHTML + "<br>";

    }
    return addHTML;
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

  goBack(): void {
    this.location.back();
  }

  sanitizeScript(sanitizer: DomSanitizer){}

}

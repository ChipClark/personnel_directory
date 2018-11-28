// people.compenents.ts

import { Component, OnInit } from '@angular/core';
import { Person } from '../person';
import { Schools } from '../school';
import { HttpClient, HttpHeaders, HttpHandler, HttpRequest } from '@angular/common/http';

import { APIService } from '../api.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css'],
})
 
export class PeopleComponent implements OnInit {

  url: string;
  selectedPerson: Person;
  
  constructor(
    private staffService: APIService,
    private http: HttpClient,
    ) { }

  ngOnInit() {
    this.getPeople();
    //this.getPeopleByLocation("Orange County");
  }

  getPeople(): void {
    this.staffService.getPeople()
        .subscribe(people => this.people = people);
  }

  getPeopleByLocation(id: number): void {
    this.staffService.getPeopleByLocation(id)
        .subscribe(people => this.people = people);
  }

  

  getPhone(personid: number): string {
    var primary = this.getPersonObject(personid);

    var phonetypeid = 1;
 
    var officePhone = primary.phones.find(obj => {
      return obj.phonetypeid === phonetypeid;
    });

    if(!officePhone) {
      return null;
    }

    return officePhone.phonenumber = officePhone.phonenumber.replace(/\D+/g, '')
    .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }


  getPhoto(ADAddress: string): string {
    var noPhoto;
    var personPhoto, urlTest;
    var imgString;

    noPhoto = "http://amjabber/nophoto.gif";

    personPhoto = "http://amjabber/" + ADAddress + ".jpg";

    //var request = this.http.get(personPhoto).subscribe();
    //console.log(request);

    imgString = '<img src="' + personPhoto + '" width=112px; />';
    
    return imgString;
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
    var primary = this.getPersonObject(personid);

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
    
        //  addHTML = "Assistant: " + asstPerson.DisplayName + "<br>";
    
  }

  getPersonObject(personid: number): object {
    var primary = this.people.find(obj => {
      return obj.pkpersonid === personid
      });

    return primary;
  }

  onSelect(people: Person): void {
    this.selectedPerson.PKPersonId = people.PKPersonId;
  }


  add(PreferredFirstName : string): void {
    PreferredFirstName  = PreferredFirstName .trim();
    if (!PreferredFirstName ) { return; }
    this.staffService.addPerson({ PreferredFirstName } as Person)
      .subscribe(person => {
        this.people.push(person);
      });
  }
  
  delete(person: Person): void {
    this.people = this.people.filter(h => h !== person);
    this.staffService.deletePerson(person).subscribe();
  }

}
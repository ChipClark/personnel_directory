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
  people: Person[];
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

  

  getPhone(phonenumber: string): string {
    //var phonenumber;
    //console.log(person.phones[].phonenumber);
    //while (personID != people.PKPersonId ) {
    //  case 1: 
    //    phonenumber = people.phones.phonenumber;
    //  default: 
    //    phonenumber = null;
    //}
    //if(!phonenumber) {
    //  return null;
    //}
    //else 
    return phonenumber = phonenumber.replace(/\D+/g, '')
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
       
    addHTML =  "Assistant: " + assistant.displayname;

    return addHTML;
    
        //  addHTML = "Assistant: " + asstPerson.DisplayName + "<br>";
    
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
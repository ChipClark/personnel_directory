// people.compenents.ts

import { Component, OnInit } from '@angular/core';
import { Person } from '../person';
import { Schools } from '../school';
import { HttpClient, HttpHeaders, HttpHandler, HttpRequest } from '@angular/common/http';

import { APIService } from '../api.service';
import { Phones } from '../phones';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css'],
})
 
export class PeopleComponent implements OnInit {

  url: string;
  people: Person[];
  phone: Phones[];
  selectedPerson: Person;
  
  constructor(
    private staffService: APIService,
    private http: HttpClient,
    ) { }

  ngOnInit() {
    this.getPeople();
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
    var phonetypeid = 1;
    var phonenum;
    var primary = this.people.find(obj => {
      return obj.pkpersonid === personid
      });
 
    var officePhone = primary.phones.find(obj => { 
      return obj.phonetypeid === phonetypeid;
    });

    if(!officePhone) {

      return null; 

      phonetypeid = 3;
      var secondaryPhone = primary.phones.find(obj => { 
        return obj.phonetypeid === phonetypeid;
      });

      phonenum = secondaryPhone.phonenumber;
      var sln = phonenum.length;
      phonenum = phonenum.slice(sln-4, sln);
      var officeID = primary.officelocationid.toString();
      phonenum = "x" + officeID + phonenum;
      return phonenum;
    }

    phonenum = officePhone.phonenumber;
    return phonenum = phonenum.replace(/\D+/g, '')
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
       
    if(!assistant) {
        return addHTML = "";
      }

    addHTML =  "Assistant: " + assistant.displayname;

    return addHTML;
    
        //  addHTML = "Assistant: " + asstPerson.displayname + "<br>";
    
  }

  onSelect(people: Person): void {
    this.selectedPerson.pkpersonid = this.people.pkpersonid;
  }

  
  delete(person: Person): void {
    this.people = this.people.filter(h => h !== person);
    this.staffService.deletePerson(person).subscribe();
  }

}
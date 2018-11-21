// people.compenents.ts

import { Component, OnInit } from '@angular/core';
import { Person } from '../person';
import { Schools } from '../school';

import { APIService } from '../api.service';
import { StaffDetailComponent } from '../staff-detail/staff-detail.component';


@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
 
export class PeopleComponent implements OnInit {

  url: string;
  people: Person[];
  selectedPerson: Person;
  
  constructor(private staffService: APIService, ) { }

  ngOnInit() {
    this.getPeople();
  }

  getPeople(): void {
    this.staffService.getPeople()
        .subscribe(people => this.people = people);
  }


  checkUrl(url): boolean {
    if (url) {
      //open("GET", url);
            //if (status == 200) { return true; }
    }
    else {  return false; }
  }

  getPhone(phonenumber: string): string {
    return phonenumber = phonenumber.replace(/\D+/g, '')
    .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }


  getPhoto(ADAddress: string): string {
    var noPhoto;
    var personPhoto, urlTest;
    var imgString;

    noPhoto = "http://amjabber/nophoto.gif";
    personPhoto = "http://amjabber/" + ADAddress + ".jpg";
    urlTest = "http://marketing/utils/img/personnel/" + ADAddress + ".jpg";
    imgString = '<img src="' + personPhoto + '" id="' + ADAddress + '" width="112px;">';
    
    //if (this.checkUrl(urlTest ) == false) {
    //   imgString = '<img src="' + noPhoto + '" id="' + ADAddress + '" width="112px;">';
    //}
    
    return imgString;

  }

  getEmail(EMAIL: string, personName: string): string {
    var emailString = '<a href=mailto:"' + EMAIL + '" id="' + personName + '" >' + EMAIL + '</a>'; 
  
  return emailString;

  }

  //getSchoolName(id: number): string) {
      //person.education[0].schoolid = id; 
      //return schoolid.schoolname;
  //    return "hello";
  //}

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
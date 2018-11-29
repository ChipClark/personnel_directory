// people.compenents.ts

import { Component, OnInit } from '@angular/core';
import { Person } from '../person';
import { HttpClient, HttpHeaders, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from '../api.service';
import { Phones } from '../phones';
import { RouterLink } from '@angular/router';
import { Button } from 'protractor';


@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css'],
})

@Injectable({
  providedIn: 'root'
})
 
export class PeopleComponent implements OnInit {

  private baseURL = 'http://am-web05:3030/api/people?';
  private phoneURL = "http://am-web05:3030/api/phones";
  private jobtitleURL = 'http://am-web05:3030/job-titles';
  private individualURL = 'http://am-web05:3035/api/people';
  private schoolDetails = 'http://am-web05:3030/api/schools';


  // Filters
  private All = 'filter={"where":{"employmentstatus":"A"},'
  private location = this.All;

  //includes
  private generalIncludes = '"include":["emails","phones","jobtitle","officelocation","hrdepartment", "personrelationship", "education"]';
  private endRequest = '}';

  public skip = 0;
  public limit= 20;
  public LabelClass = "OP1";
  private lastRecord;
  
  private pagination = '"limit":' + this.limit + ',"skip":' + this.skip + ',';
  private order = '"order":"lastname ASC",'
  private personURL = this.baseURL + this.All + this.pagination + this.order + this.generalIncludes + this.endRequest;  // URL to web api


  url: string;
  people: Person[];
  phone: Phones[];
  selectedPerson: Person;
  router: RouterLink;
  
  constructor(
    private staffService: APIService,
    private http: HttpClient
    ) { }

  ngOnInit() {
    this.getPeople();
  }

  onSelect(people: Person): void {
    console.log("Clicked on person");
    //this.router.  ('/details/' + people.pkpersonid);
    this.selectedPerson.pkpersonid = people.pkpersonid;
  }

  getPeople(): void {
    this.buildURL();
    this.staffService.getPeople(this.personURL)
        .subscribe(people => this.people = people);

    this.lastRecord = this.people.length;
    console.log(this.lastRecord);
    
  }
  
  buildURL () {
    this.pagination = '"limit":' + this.limit + ',"skip":' + this.skip + ',';
    this.personURL = this.baseURL + this.location + this.pagination + this.order + this.generalIncludes + this.endRequest;  // URL to web api

  }
  

  getMorePeople(direction: string): void {
    if(direction == "prev"){
      if(this.skip >= 20) {
          this.skip = this.skip - this.limit;
      }

    }
    else {
      if(this.skip >= 0 && this.skip < this.lastRecord) {
        this.skip = this.skip + this.limit;
      } 
    }

    this.getPeople(); 
  }

  getPeopleByLocation(id: number): void {
    var LabelElement;
    LabelElement = document.getElementById(this.LabelClass);
    LabelElement.className = "btn btn-secondary";

    switch(id) {
      case 6:
          this.location = 'filter={"where":{"employmentstatus":"A"},';
          LabelElement = document.getElementById("OP1");
          LabelElement.className = "btn btn-secondary focus active";
          this.LabelClass = "OP1";
         break;
      case 1: 
          this.location = 'filter={"where":{"employmentstatus":"A","officelocationid":4},';
          LabelElement = document.getElementById("OP2");
          LabelElement.className = "btn btn-secondary focus active";
          this.LabelClass = "OP2";
         break;
      case 2:
          this.location = 'filter={"where":{"employmentstatus":"A","officelocationid":1},';
          LabelElement = document.getElementById("OP3");
          LabelElement.className = "btn btn-secondary focus active";
           this.LabelClass = "OP3";
         break;
      case 3:
          this.location = 'filter={"where":{"employmentstatus":"A","officelocationid":2},';
          LabelElement = document.getElementById("OP4");
          LabelElement.className = "btn btn-secondary focus active";
           this.LabelClass = "OP4";
         break;
      case 4:
          this.location = 'filter={"where":{"employmentstatus":"A","officelocationid":3},';
          LabelElement = document.getElementById("OP5");
          LabelElement.className = "btn btn-secondary focus active";
          this.LabelClass = "OP5";
         break;
      case 5:
          this.location = 'filter={"where":{"employmentstatus":"A","officelocationid":5},';
          LabelElement = document.getElementById("OP6");
          LabelElement.className = "btn btn-secondary focus active";
          this.LabelClass = "OP6";
         break;
      default: 
         this.location = "";
        break;
    }
    this.skip = 0;
    this.getPeople(); 
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
    var noPhoto, personPhoto, urlTest, imgString;

    noPhoto = "http://amjabber/nophoto.gif";
    personPhoto = "http://amjabber/" + ADAddress + ".jpg";
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

  
}
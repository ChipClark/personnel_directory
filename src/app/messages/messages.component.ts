import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';
import { Person } from '../person';
import { APIService } from '../api.service';
import { PeopleComponent } from '../people/people.component';
import { assertPreviousIsParent } from '@angular/core/src/render3/instructions';
 
@Component({
  //providers: PeopleComponent,
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})

export class MessagesComponent implements OnInit {

  people: Person[];
  
 
  constructor(
    public messageService: MessageService,
    private getPeople: PeopleComponent
    ) {}
 
  ngOnInit() {
  }

  
  getMorePeople(direction: string): void {
    if(direction == "prev"){
      this.getPeople.getMorePeople("prev")
    }
    else {
      this.getPeople.getMorePeople("next")
    }
        

  }
 
}
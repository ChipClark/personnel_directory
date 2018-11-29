import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';
 
@Component({
  //providers: PeopleComponent,
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})

export class MessagesComponent implements OnInit {
 
  constructor(
    public messageService: MessageService,
    ) {}
 
  ngOnInit() {
  }

  
}
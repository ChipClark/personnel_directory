// phones.compenents.ts

import { Component, OnInit } from '@angular/core';
import { Person } from '../person';
import { Schools } from '../school';
import { HttpClient, HttpHeaders, HttpHandler, HttpRequest } from '@angular/common/http';

import { APIService } from '../api.service';
import { Phones } from '../phones';


@Component({
  selector: 'app-phones',
  templateUrl: './phones.component.html',
  styleUrls: ['./phones.component.css']
})

export class PhonesComponent implements OnInit {

  url: string;
  people: Person[];
  phone: Phones[];
  selectedPerson: Person;

  constructor(
    private staffService: APIService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
  }


}

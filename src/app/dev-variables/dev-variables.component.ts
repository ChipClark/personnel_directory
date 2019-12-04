import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-dev-variables',
  templateUrl: './dev-variables.component.html',
  styleUrls: ['./dev-variables.component.css']
})

@Injectable({
  providedIn: 'root'
})

export class DevVariablesComponent {

   //  IMPORTANT //
   //  MAKE SURE onLocalHost IS SET TO FALSE BEFORE DEPLOYING TO AZURE //
   //  To use testAPIServer - onLocalHost = False & testAPIServer = true
   //  OR ELSE it will point to localhost
  
  // public onLocalHost = false;
  public onLocalHost = true;
  // public testAPIServer = false;
  // public testAPIServer = true;


  public onDebug = true;   // true turns on debugging messages
  // public onDebug = false;
  public mobile;

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.generateMap();
  }

  generateMap() {
    document.createElementNS('./la-28.svg', 'path');
  }

}

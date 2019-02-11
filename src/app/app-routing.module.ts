import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PeopleComponent }      from './people/people.component';
import { MapComponent } from './maps/maps.component';


const routes: Routes = [
  { path: 'root', component: PeopleComponent },
  { path: '', component: PeopleComponent, pathMatch: 'full' },
  { path: 'maps', component: MapComponent },
  { path: 'people', component: PeopleComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes,{useHash:true}) ],
  exports: [ RouterModule]
})
export class AppRoutingModule { 


  
}

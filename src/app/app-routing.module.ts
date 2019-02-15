import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PeopleComponent } from './people/people.component';
import { MapComponent } from './maps/maps.component';
import { La26Component } from './maps/la26/la26.component';
import { La27Component } from './maps/la27/la27.component';
import { La28Component } from './maps/la28/la28.component';
import { La29Component } from './maps/la29/la29.component';
import { Cc18Component } from './maps/cc18/cc18.component';
import { Oc04Component } from './maps/oc04/oc04.component';
import { Oc05Component } from './maps/oc05/oc05.component';
import { Sd26Component } from './maps/sd26/sd26.component';
import { Sd27Component } from './maps/sd27/sd27.component';


const routes: Routes = [
  { path: 'root', component: PeopleComponent },
  { path: '', component: PeopleComponent, pathMatch: 'full' },
  { path: 'maps', component: MapComponent, children: [
    { path: 'cc18', component: Cc18Component },
    { path: 'la26', component: La26Component },
    { path: 'la27', component: La27Component },
    { path: 'la28', component: La28Component },
    { path: 'la29', component: La29Component },
    { path: 'oc04', component: Oc04Component },
    { path: 'oc05', component: Oc05Component },
    { path: 'sd26', component: Sd26Component },
    { path: 'sd27', component: Sd27Component }
  ] },
  { path: 'people', component: PeopleComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {



}

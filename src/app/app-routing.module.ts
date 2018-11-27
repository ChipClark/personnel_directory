import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PeopleComponent }      from './people/people.component';
import { StaffDetailComponent }  from './staff-detail/staff-detail.component';
import { DashboardComponent }   from './dashboard/dashboard.component';
//import { CenturyCityComponent } from './officelocation//centurycity/centurycity.component';
//import { LosAngelesComponent } from './officelocation/losangeles/losangeles.component';
//import { OrangeCountyComponent } from './officelocation/orangecounty/orangecounty.component';
//import { SanFranciscoComponent } from './officelocation/sanfrancisco/sanfrancisco.component';
//import { SanDiegoComponent } from './officelocation/sandiego/sandiego.component';
//import { OfficelocationComponent } from './officelocation/officelocation.component';


const routes: Routes = [
  { path: '', redirectTo: '/people', pathMatch: 'full' },
  { path: 'detail/:id', component: StaffDetailComponent },
  { path: 'people', component: PeopleComponent },
  { path: 'dashboard', component: DashboardComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule]
})
export class AppRoutingModule { }

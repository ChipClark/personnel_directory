import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PeopleComponent }      from './people/people.component';
import { StaffDetailComponent }  from './staff-detail/staff-detail.component';


const routes: Routes = [
  { path: '', redirectTo: '/people', pathMatch: 'full' },
  { path: 'detail/:id', component: StaffDetailComponent },
  { path: 'people', component: PeopleComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule]
})
export class AppRoutingModule { 

  
}

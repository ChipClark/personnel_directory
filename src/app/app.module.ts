import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { StaffDetailComponent } from './staff-detail/staff-detail.component';
import { MessagesComponent } from './messages/messages.component';
import { DashboardComponent } from './dashboard/dashboard.component'; 
import { PersonSearchComponent }  from './person-search/person-search.component';
import { ConfigComponent } from './config/config.component';
import { PeopleComponent } from './people/people.component';
import { PhotosComponent } from './photos/photos.component';
import { DepartmentsComponent } from './departments/departments.component';
import { JobtitlesComponent } from './jobtitles/jobtitles.component';

@NgModule({
  declarations: [
    AppComponent,
    StaffDetailComponent,
    MessagesComponent,
    DashboardComponent,
    PersonSearchComponent,
    ConfigComponent,
    PeopleComponent,
    PhotosComponent,
    DepartmentsComponent,
    JobtitlesComponent
  ],
  imports: [
    BrowserModule, 
    FormsModule, 
    AppRoutingModule,
    HttpClientModule
  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

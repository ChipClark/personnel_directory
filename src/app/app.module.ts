import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { StaffDetailComponent } from './staff-detail/staff-detail.component';
import { MessagesComponent } from './messages/messages.component';
import { PersonSearchComponent }  from './person-search/person-search.component';
import { ConfigComponent } from './config/config.component';
import { PeopleComponent } from './people/people.component';
import { PhotosComponent } from './photos/photos.component';
import { DepartmentsComponent } from './departments/departments.component';
import { JobtitlesComponent } from './jobtitles/jobtitles.component';

import { NavigationComponent } from './navigation/navigation.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { SchoolComponent } from './school/school.component';
import { OfficelocationComponent } from './officelocation/officelocation.component';
import { CityPipe } from './city.pipe';
import { PhonesComponent } from './phones/phones.component';
import { NgxPaginationModule } from 'ngx-pagination'; 

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    StaffDetailComponent,
    MessagesComponent,
    PersonSearchComponent,
    ConfigComponent,
    PeopleComponent,
    PhotosComponent,
    DepartmentsComponent,
    JobtitlesComponent,
    NavigationComponent,
    HeaderComponent,
    FooterComponent,
    SchoolComponent,
    OfficelocationComponent,
    CityPipe,
    PhonesComponent
  ],
  imports: [
    BrowserModule, 
    FormsModule, 
    AppRoutingModule,
    HttpClientModule,
    PerfectScrollbarModule,
    NgxPaginationModule
  
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG, 
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

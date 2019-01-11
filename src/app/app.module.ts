import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { StaffDetailComponent } from './staff-detail/staff-detail.component';
import { MessagesComponent } from './messages/messages.component';
import { PersonSearchComponent } from './person-search/person-search.component';
import { ConfigComponent } from './config/config.component';
import { PeopleComponent } from './people/people.component';
import { DepartmentsComponent } from './departments/departments.component';

import { NavigationComponent } from './navigation/navigation.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CityPipe } from './city.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { RolePipe } from './role.pipe';
import { AlphaPipe } from './alpha.pipe';
import { SearchPipe } from './search.pipe';
import { IndividualPipe } from './individual.pipe';
import { MapComponent } from './maps/maps.component';

@NgModule({
  declarations: [
    AppComponent,
    StaffDetailComponent,
    MessagesComponent,
    PersonSearchComponent,
    ConfigComponent,
    PeopleComponent,
    DepartmentsComponent,
    NavigationComponent,
    HeaderComponent,
    FooterComponent,
    CityPipe,
    RolePipe,
    AlphaPipe,
    SearchPipe,
    IndividualPipe,
    MapComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

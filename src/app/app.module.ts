import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { APIService } from './api.service';
import { MessagesComponent } from './messages/messages.component';
import { PersonSearchComponent } from './person-search/person-search.component';
import { ConfigComponent } from './config/config.component';
import { PeopleComponent } from './people/people.component';

import { FooterComponent } from './footer/footer.component';
import { CityPipe } from './pipes/city.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { MapComponent } from './maps/maps.component';
import { RolePipe } from './pipes/role.pipe';
import { AlphaPipe } from './pipes/alpha.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { IndividualPipe } from './pipes/individual.pipe';
import { CityArrayPipe } from './pipes/cityArray.pipe';
import { RoleArrayPipe } from './pipes/roleArray.pipe';
import { StaffDeptPipe } from './pipes/staffDept.pipe';
import { TimekeeperDeptPipe } from './pipes/timekeeperDept.pipe';
import { OtherPipe } from './pipes/other.pipe';
import { InlineSVGModule } from 'ng-inline-svg';
import { La26Component } from './maps/la26/la26.component';
import { La27Component } from './maps/la27/la27.component';
import { La28Component } from './maps/la28/la28.component';
import { La29Component } from './maps/la29/la29.component';
import { Oc04Component } from './maps/oc04/oc04.component';
import { Oc05Component } from './maps/oc05/oc05.component';
import { Sd26Component } from './maps/sd26/sd26.component';
import { Sd27Component } from './maps/sd27/sd27.component';
import { Sf12Component } from './maps/sf12/sf12.component';
import { Sf13Component } from './maps/sf13/sf13.component';
import { Cc18Component } from './maps/cc18/cc18.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DevVariablesComponent } from './dev-variables/dev-variables.component';

export function initAuth(appInitService: APIService) {
  return (): Promise<any> => { 
    return appInitService.initAuth();
  }
}

export function initPeople(appInitService: APIService) {
  return (): Promise<any> => { 
    return appInitService.initPeople();
  }
}

export function initLegalSub(appInitService: APIService) {
  return (): Promise<any> => { 
    return appInitService.initLegalSub();
  }
}

@NgModule({
  declarations: [
    AppComponent,
    DevVariablesComponent,
    MessagesComponent,
    PersonSearchComponent,
    ConfigComponent,
    PeopleComponent,
    FooterComponent,
    CityPipe,
    RolePipe,
    AlphaPipe,
    SearchPipe,
    IndividualPipe,
    MapComponent,
    CityArrayPipe,
    RoleArrayPipe,
    StaffDeptPipe,
    OtherPipe,
    La26Component,
    La27Component,
    La28Component,
    La29Component,
    Oc04Component,
    Oc05Component,
    Sd26Component,
    Sd27Component,
    Sf12Component,
    Sf13Component,
    Cc18Component,
    TimekeeperDeptPipe,
    OtherPipe,
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
    InlineSVGModule.forRoot(),
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot()

  ],
  providers: [
    APIService,
    { provide: APP_INITIALIZER, useFactory: initAuth, deps: [APIService], multi: true },
    { provide: APP_INITIALIZER, useFactory: initPeople, deps: [APIService], multi: true },
    { provide: APP_INITIALIZER, useFactory: initLegalSub, deps: [APIService], multi: true }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }





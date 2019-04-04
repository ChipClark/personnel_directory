import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Oc05Component } from './oc05.component';

describe('Oc05Component', () => {
  let component: Oc05Component;
  let fixture: ComponentFixture<Oc05Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Oc05Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Oc05Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

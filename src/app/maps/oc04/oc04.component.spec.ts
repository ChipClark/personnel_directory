import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Oc04Component } from './oc04.component';

describe('Oc04Component', () => {
  let component: Oc04Component;
  let fixture: ComponentFixture<Oc04Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Oc04Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Oc04Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

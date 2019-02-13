import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Sf13Component } from './sf13.component';

describe('Sf13Component', () => {
  let component: Sf13Component;
  let fixture: ComponentFixture<Sf13Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Sf13Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Sf13Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

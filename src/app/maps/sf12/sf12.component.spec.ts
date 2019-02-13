import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Sf12Component } from './sf12.component';

describe('Sf12Component', () => {
  let component: Sf12Component;
  let fixture: ComponentFixture<Sf12Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Sf12Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Sf12Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

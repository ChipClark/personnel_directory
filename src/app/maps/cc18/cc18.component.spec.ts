import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Cc18Component } from './cc18.component';

describe('Cc18Component', () => {
  let component: Cc18Component;
  let fixture: ComponentFixture<Cc18Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Cc18Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Cc18Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

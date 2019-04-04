import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { La27Component } from './la27.component';

describe('La27Component', () => {
  let component: La27Component;
  let fixture: ComponentFixture<La27Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ La27Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(La27Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

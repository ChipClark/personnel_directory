import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Sd27Component } from './sd27.component';

describe('Sd27Component', () => {
  let component: Sd27Component;
  let fixture: ComponentFixture<Sd27Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Sd27Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Sd27Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

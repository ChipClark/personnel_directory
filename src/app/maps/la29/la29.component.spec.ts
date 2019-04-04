import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { La29Component } from './la29.component';

describe('La29Component', () => {
  let component: La29Component;
  let fixture: ComponentFixture<La29Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ La29Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(La29Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

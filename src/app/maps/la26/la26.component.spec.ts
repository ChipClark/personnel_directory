import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { La26Component } from './la26.component';

describe('La26Component', () => {
  let component: La26Component;
  let fixture: ComponentFixture<La26Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ La26Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(La26Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

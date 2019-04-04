import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Sd26Component } from './sd26.component';

describe('Sd26Component', () => {
  let component: Sd26Component;
  let fixture: ComponentFixture<Sd26Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Sd26Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Sd26Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

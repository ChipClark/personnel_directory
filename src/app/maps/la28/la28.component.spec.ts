import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { La28Component } from './la28.component';

describe('La28Component', () => {
  let component: La28Component;
  let fixture: ComponentFixture<La28Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ La28Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(La28Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

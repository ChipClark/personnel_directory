import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CenturycityComponent } from './centurycity.component';

describe('CenturycityComponent', () => {
  let component: CenturycityComponent;
  let fixture: ComponentFixture<CenturycityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CenturycityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CenturycityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

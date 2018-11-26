import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficelocationComponent } from './officelocation.component';

describe('OfficelocationComponent', () => {
  let component: OfficelocationComponent;
  let fixture: ComponentFixture<OfficelocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficelocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficelocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

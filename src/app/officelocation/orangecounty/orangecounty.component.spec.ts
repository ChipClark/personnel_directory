import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrangecountyComponent } from './orangecounty.component';

describe('OrangecountyComponent', () => {
  let component: OrangecountyComponent;
  let fixture: ComponentFixture<OrangecountyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrangecountyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrangecountyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

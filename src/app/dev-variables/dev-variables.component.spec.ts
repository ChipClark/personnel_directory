import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevVariablesComponent } from './dev-variables.component';

describe('DevVariablesComponent', () => {
  let component: DevVariablesComponent;
  let fixture: ComponentFixture<DevVariablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevVariablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevVariablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SandiegoComponent } from './sandiego.component';

describe('SandiegoComponent', () => {
  let component: SandiegoComponent;
  let fixture: ComponentFixture<SandiegoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SandiegoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SandiegoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

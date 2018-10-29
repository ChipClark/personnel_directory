import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobtitlesComponent } from './jobtitles.component';

describe('JobtitlesComponent', () => {
  let component: JobtitlesComponent;
  let fixture: ComponentFixture<JobtitlesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobtitlesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobtitlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

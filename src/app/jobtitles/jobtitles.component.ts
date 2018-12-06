import { Component, OnInit } from '@angular/core';
import { APIService } from '../api.service';
import { HttpClient } from '@angular/common/http';
import { JobTitle } from '../jobs';


@Component({
  selector: 'app-jobtitles',
  templateUrl: './jobtitles.component.html',
  styleUrls: ['./jobtitles.component.css']
})
export class JobtitlesComponent implements OnInit {

  url: string;
  jobs: JobTitle[];
  
  private jobURL = 'http://am-web05:3030/api/jobtitles';

  constructor(
    private staffService: APIService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.getJobTitles();
  }

  getJobTitles(): void {
    this.staffService.getJOBS(this.jobURL)
        .subscribe(jobs => {this.jobs = jobs});
  }
}

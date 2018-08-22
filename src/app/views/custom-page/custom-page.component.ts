import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
  templateUrl: 'custom-page.component.html'
})
export class CustomPageComponent implements OnInit {
  customPageContent: string;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
  }

  ngOnInit(): void {
    const pageName = this.route.snapshot.paramMap.get('page-name');

    if (pageName === 'og15-sc-explanation-instruction') {
      this.http.get('assets/pages/og-companion-manhattan.html', {responseType: 'text'}).subscribe((response) => {
        this.customPageContent = response;
      });
    }
  }
}

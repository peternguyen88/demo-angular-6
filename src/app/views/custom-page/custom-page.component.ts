import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {UserCache} from '../../shared/utils/user-cache';

@Component({
  templateUrl: 'custom-page.component.html'
})
export class CustomPageComponent implements OnInit, OnDestroy {
  customPageContent: string;
  returnURL: string;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
    this.returnURL = UserCache.urlBeforeCustomPage();
  }

  ngOnInit(): void {
    const pageName = this.route.snapshot.paramMap.get('page-name');

    if (pageName === 'og15-sc-explanation-instruction') {
      this.http.get('assets/pages/og-companion-manhattan.html', {responseType: 'text'}).subscribe((response) => {
        this.customPageContent = response;
      });
    }
  }

  public back(){
    UserCache.deleteUrlBeforeCustomPage();
    this.router.navigateByUrl(this.returnURL).then();
  }

  ngOnDestroy(): void {
    UserCache.deleteUrlBeforeCustomPage();
  }
}

import {Component, OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {distinctUntilChanged} from 'rxjs/operators';
import {environment} from '../environments/environment';
import {StringUtils} from './shared/utils/string-utils';


// Declare ga function as ambient
declare var ga: Function;

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(public router: Router) {

    if (environment.production) {
      router.events.pipe(distinctUntilChanged((previous: any, current: any) => {
        if (current instanceof NavigationEnd) {
          return previous.url === current.url;
        }
        return true;
      })).subscribe((x: any) => {
        // console.log('router.change', x);
        ga('set', 'page', StringUtils.cleanupURLForGA(x.url));
        ga('send', 'pageview');
        // console.log(StringUtils.cleanupURLForGA(x.url));
      });

      setInterval(function(){ ga('send', 'pageview'); }, 60000 * 5);
    }
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}

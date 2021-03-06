import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {distinctUntilChanged} from 'rxjs/operators';
import {environment} from '../environments/environment';
import {StringUtils} from './shared/utils/string-utils';
import {Location} from '@angular/common';
import {ScreenUtils} from './shared/utils/screen-utils';
import {WebService} from './shared/services/web-service';
import {SyncUtils} from './shared/utils/sync-utils';
import {UpdateService} from './shared/services/update.service';


// Declare ga function as ambient
declare var ga: Function;

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(private location: Location, public router: Router, public webService: WebService, private updateService: UpdateService) {
    // Check for update
    this.updateService.checkForUpdate();

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

        ScreenUtils.updateLastVisitOnIOS(x.url);
      });

      setInterval(function(){ ga('send', 'pageview'); }, 60000 * 10);
    }

    this.webService.subscribeOnAuthStateChanged(() => {
      SyncUtils.synchronizeDataToServer(this.webService);
    });
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    ScreenUtils.initAutoLoginBackOnIOsDevices(this.location);
    // this.location.replaceState('/index-ios.html');
  }
}

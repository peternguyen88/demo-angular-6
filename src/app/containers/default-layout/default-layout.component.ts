import {Component} from '@angular/core';
import {navItems} from '../../_nav';
import {WebService} from '../../shared/services/web-service';
import {FirebaseUser} from '../../models/firebase.model';
import {PracticeData} from '../../views/gmat-practice/data/practice-sets';
import {HttpClient} from '@angular/common/http';
import {ScreenUtils} from '../../shared/utils/screen-utils';
import {ManagementUtils} from '../../shared/utils/management-utils';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public navItems = navItems;
  public user: FirebaseUser;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;

  constructor(private webService: WebService, private http: HttpClient) {
    this.user = this.webService.getCurrentUser(); // Load saved user and update later
    this.webService.getRealLoginEvent().subscribe(() => this.user = this.webService.getCurrentUser());

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });

    this.webService.subscribeOnAuthStateChanged(user => {
      if (user && ScreenUtils.isOnPhoneFullScreenMode()) {
        this.preloadQuestion();
      }
    });
  }

  public login() {
    this.webService.login();
  }

  public logout() {
    this.webService.logout();
  }

  public isLogin() {
    return this.webService.isLogin();
  }

  public isAdmin(){
    return ManagementUtils.isAdmin(this.user);
  }

  preloadQuestion() {
    // Load Free Questions
    this.load(PracticeData.DATA.map(set => {
      return [set[0] as string, set[3] as string];
    }));
    this.load(PracticeData.QUANTITATIVE.map(set => {
      return [set[0] as string, set[3] as string];
    }));
    this.load(PracticeData.GMATCLUB_QUANT_TESTS.map(set => {
      return [set[0] as string, set[3] as string];
    }));

    // Load Premium Questions
    if (this.webService.isLogin() && this.webService.isStudent()) {
      this.load(PracticeData.PREMIUM_DATA.map(set => {
        return [set[0] as string, set[3] as string];
      }));
      this.load(PracticeData.COMPREHENSIVE_CR.map(set => {
        return [set[0] as string, set[3] as string];
      }));
      this.load(PracticeData.COMPREHENSIVE_RC.map(set => {
        return [set[0] as string, set[3] as string];
      }));
      this.load(PracticeData.COMPREHENSIVE_SC.map(set => {
        return [set[0] as string, set[3] as string];
      }));
    }
  }

  /**
   * Only need to query, the service worker will do the hard work
   */
  private load(sets: string[][]) {
    for (const set of sets) {
      if (sessionStorage.getItem(set[0]) === undefined || sessionStorage.getItem(set[0]) === null) {
        this.http.get('/assets/' + set[1], {responseType: 'text'}).subscribe((res: any) => {
          sessionStorage.setItem(set[0], res);
        });
      }
    }
    this.http.get('assets/pages/og-companion-manhattan.html', {responseType: 'text'}).subscribe(() => {});
  }
}

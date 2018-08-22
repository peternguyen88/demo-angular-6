import {Component} from '@angular/core';
import {navItems} from '../../_nav';
import {WebService} from '../../shared/services/web-service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public navItems = navItems;
  public user: firebase.User;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;

  constructor(private webService: WebService) {
    this.webService.subscribeOnAuthStateChanged(user => this.user = user);

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
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
}

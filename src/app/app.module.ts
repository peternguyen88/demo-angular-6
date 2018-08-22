import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';

import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {AppComponent} from './app.component';
// Import containers
import {DefaultLayoutComponent} from './containers';

import {AppAsideModule, AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule} from '@coreui/angular';
// Import routing module
import {AppRoutingModule} from './app.routing';
// Import 3rd party components
import {GmatCommonModule} from './shared/modules/gmat-common-module';
import {WebService} from './shared/services/web-service';
import {FirebaseAuthenticationService} from './shared/services/firebase.authentication.service';
import {FirebaseDatabaseService} from './shared/services/firebase.database.service';
import {AngularFireDatabase, AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireModule} from 'angularfire2';
import {BsDropdownModule} from 'ngx-bootstrap';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

export const firebaseConfig = {
  apiKey: 'AIzaSyAa4rCwsgsFfuKtAtjcRe3tS6cBs0KLsbg',
  authDomain: 'gmat-zero-to-hero.firebaseapp.com',
  databaseURL: 'https://gmat-zero-to-hero.firebaseio.com',
  projectId: 'gmat-zero-to-hero',
  storageBucket: 'gmat-zero-to-hero.appspot.com',
  messagingSenderId: '227562885868'
};

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    // Custom Modules
    GmatCommonModule,
    AngularFireModule.initializeApp(firebaseConfig), AngularFireDatabaseModule, AngularFireAuthModule
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  }, FirebaseDatabaseService, FirebaseAuthenticationService, WebService, AngularFireDatabase],
  bootstrap: [AppComponent]
})
export class AppModule {
}

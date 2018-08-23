import * as firebase from 'firebase/app';
import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {Subject} from 'rxjs/Subject';
import {ScreenUtils} from '../utils/screen-utils';
import {UserCache} from '../utils/user-cache';
import {FirebaseUser} from '../../models/firebase.model';

@Injectable()
export class FirebaseAuthenticationService {

  private authStateChangedBroadcast = new Subject<firebase.User>();

  constructor(private fireAuth: AngularFireAuth) {
    this.fireAuth.auth.onAuthStateChanged(user => this.authStateChangedBroadcast.next(user));
  }

  login() {
    if (ScreenUtils.isOnSmallScreen()) {
      this.fireAuth.auth.signInWithRedirect(new firebase.auth.FacebookAuthProvider()).then(() => {
        if (this.fireAuth.auth.currentUser) {
        }
      });
    } else {
      this.fireAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(credential => {
        if (credential && credential.user) {
        }
      });
    }
  }

  logout() {
    this.fireAuth.auth.signOut().then(UserCache.deleteUser);
  }

  public isLogin(): boolean {
    return UserCache.loadUser() !== null || this.fireAuth.auth.currentUser !== null;
  }

  public subscribeOnAuthStateChanged(subscribeFunction: (user: firebase.User) => void) {
    return this.authStateChangedBroadcast.subscribe(subscribeFunction);
  }
}

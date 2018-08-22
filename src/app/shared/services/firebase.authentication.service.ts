import * as firebase from 'firebase/app';
import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class FirebaseAuthenticationService {

  private authStateChangedBroadcast = new Subject<firebase.User>();

  constructor(private fireAuth: AngularFireAuth) {
    this.fireAuth.auth.onAuthStateChanged(user => this.authStateChangedBroadcast.next(user));
  }

  login() {
    this.fireAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }

  logout() {
    this.fireAuth.auth.signOut();
  }

  public isLogin(): boolean {
    return this.fireAuth.auth.currentUser != null;
  }

  public getCurrentUser(): firebase.User {
    return this.fireAuth.auth.currentUser;
  }

  public subscribeOnAuthStateChanged(subscribeFunction: (user: firebase.User) => void) {
    return this.authStateChangedBroadcast.subscribe(subscribeFunction);
  }
}

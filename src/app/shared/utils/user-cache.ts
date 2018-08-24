import {FirebaseUser} from '../../models/firebase.model';
import {FirebaseAuthenticationService} from '../services/firebase.authentication.service';

export class UserCache {
  private static USER_KEY = 'local_user';
  private static current_user: FirebaseUser = null;

  public static selfDestructIfLoginSessionTimeout(fbAuthService: FirebaseAuthenticationService) {
    setTimeout(function () {
      if (navigator.onLine && !fbAuthService.isLoggedToServer()) {
        UserCache.deleteUser();
      }
    }, 1000 * 30);
  }

  public static saveUser(user: FirebaseUser) {
    if (user) {
      localStorage.setItem(UserCache.USER_KEY, JSON.stringify(user));
      UserCache.current_user = user;
    }
  }

  public static loadUser(): FirebaseUser {
    if (UserCache.current_user) return UserCache.current_user;

    const savedUser = localStorage.getItem(UserCache.USER_KEY);
    if (savedUser) {
      UserCache.current_user = JSON.parse(savedUser);
      return UserCache.current_user;
    } else {
      return null;
    }
  }

  public static deleteUser() {
    localStorage.setItem(UserCache.USER_KEY, null);
    UserCache.current_user = null;
  }
}

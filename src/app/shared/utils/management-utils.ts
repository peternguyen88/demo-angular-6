import {FirebaseUser} from '../../models/firebase.model';

export class ManagementUtils {

  static ADMIN_EMAILS = ['tronghieubk@gmail.com'];
  static ADMIN_UIDS = ['10207104530450532'];

  public static isAdmin(user: FirebaseUser){
    if(user){
      if(user.email && ManagementUtils.ADMIN_EMAILS.indexOf(user.email) >= 0){
        return true;
      }
      if(user.uid && ManagementUtils.ADMIN_UIDS.indexOf(user.uid) >= 0){
        return true;
      }
    }
    return false;
  }
}

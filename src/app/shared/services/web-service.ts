import {Injectable} from '@angular/core';
import {FirebaseDatabaseService} from './firebase.database.service';
import {FirebaseAuthenticationService} from './firebase.authentication.service';
import * as firebase from 'firebase/app';
import {QuestionResult} from '../../models/test-result';
import {FirebaseUser, UserQuestionReport} from '../../models/firebase.model';
import {UserCache} from '../utils/user-cache';


/**
 * Use the service to work with multiple Http services: Firebase, Lumen
 */
@Injectable()
export class WebService {

  constructor(private fbDatabaseService: FirebaseDatabaseService, private fbAuthService: FirebaseAuthenticationService) {
    this.subscribeOnAuthStateChanged(user => fbDatabaseService.onAuthenticationStateChanged(user));
    UserCache.selfDestructIfLoginSessionTimeout(fbAuthService);
  }

  public subscribeOnAuthStateChanged(subscribeFunction: (user: firebase.User) => void) {
    return this.fbAuthService.subscribeOnAuthStateChanged(user => subscribeFunction(user));
  }

  public getRealLoginEvent() {
    return this.fbDatabaseService.getRealLoginEvent();
  }

  public login() {
    this.fbAuthService.login();
  }

  public logout() {
    this.fbAuthService.logout();
  }

  public isLogin(): boolean {
    return this.fbAuthService.isLogin();
  }

  public getCurrentUser(): FirebaseUser {
    return UserCache.loadUser() || this.fbDatabaseService.firebaseUser;
  }

  public isUnlockFeature(): boolean {
    return this.fbDatabaseService.isUnlockFeature();
  }

  public isStudent(): boolean {
    return UserCache.loadUser() ? UserCache.loadUser().is_student : false;
  }

  public processSavePerformanceToServer(id: string, localSavedTime: number, questions: QuestionResult[], changeIndexes: number[]) {
    // const changedQuestions = [];
    // changeIndexes.forEach(index => {changedQuestions.push(questions[index])});
    this.fbDatabaseService.processSavePerformanceToServer(id, localSavedTime, questions);
  }

  public processRetrievePerformanceFromServer(id: string, localSavedTime: number, mergeData: (questions: QuestionResult[]) => any, finalProcess: () => void) {
    this.fbDatabaseService.processRetrievePerformanceFromServer(id, localSavedTime, mergeData, finalProcess);
  }

  public deleteSavedPerformanceFromServer(id: string) {
    this.fbDatabaseService.deleteSavedPerformanceFromServer(id);
  }

  public reportQuestion(report: UserQuestionReport) {
    report.report_user_id = this.fbDatabaseService.getUserIdentification();
    report.report_user_name = this.fbDatabaseService.firebaseUser.name;

    this.fbDatabaseService.reportQuestion(report);
  }

  public getUserList() {
    return this.fbDatabaseService.getUserList();
  }

  public updateUser(user: FirebaseUser) {
    return this.fbDatabaseService.updateUser(user);
  }

  public getUserQuestionReports() {
    return this.fbDatabaseService.getUserQuestionReports();
  }

  public refToQuestionReport(report: UserQuestionReport) {
    return this.fbDatabaseService.getRefToQuestionReport(report);
  }

  public dataCorrection(){
    this.fbDatabaseService.correctUserPerformanceTree();
  }
}

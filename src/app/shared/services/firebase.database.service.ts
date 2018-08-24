import {Injectable} from '@angular/core';
import * as firebase from 'firebase/app';
import {FirebaseUtil} from './firebase.util';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from 'angularfire2/database';
import {FirebasePerformanceSummary, FirebaseUser, UserQuestionReport} from '../../models/firebase.model';
import {PracticeResult, QuestionResult} from '../../models/test-result';
import {PracticeData} from '../../views/gmat-practice/data/practice-sets';
import {Subject} from 'rxjs/Subject';
import {UserCache} from '../utils/user-cache';
import {ObjectUtils} from '../utils/object-utils';
import {ArrayUtils} from '../utils/array-utils';

@Injectable()
export class FirebaseDatabaseService {

  userObject: AngularFireObject<FirebaseUser>;
  user: firebase.User;
  firebaseUser: FirebaseUser;
  realLoginSubject: Subject<any> = new Subject<any>(); // Real login is when we retrieve user object from Firebase

  constructor(private db: AngularFireDatabase) {
  }

  /**
   * Update user info (Email, Name, Login Count, Last Login Time)
   * @param user
   */
  public onAuthenticationStateChanged(user: firebase.User) {
    this.user = user;
    if (user) {
      const userIdentification = user.email ? user.email : user.providerData[0].uid;
      this.userObject = this.db.object<FirebaseUser>(FirebaseUtil.userPath(userIdentification));
      // this.userObject.valueChanges().subscribe(e => console.log(e));
      const subscription = this.userObject.valueChanges().subscribe(data => {
        subscription.unsubscribe(); // Unsubscribe the Observable to prevent second update

        if (data) {
          this.firebaseUser = data;
          if (this.firebaseUser.uid === null) {
            this.firebaseUser.uid = user.providerData[0].uid;
            this.firebaseUser.firebase_uid = user.uid;
          }
        } else {
          this.firebaseUser = new FirebaseUser(user.email, user.displayName, user.providerData[0].uid);
          this.firebaseUser.firebase_uid = user.uid;
        }
        this.firebaseUser.login_count++;
        this.firebaseUser.last_login = new Date().toString();
        this.firebaseUser.photo_url = user.providerData[0].photoURL;

        this.realLoginSubject.next(); // Inform that we have user object
        this.userObject.set(FirebaseUtil.cleanupUserObject(this.firebaseUser)).then(error => {
          if (error) {
            console.log(error);
          }
        });

        if (!data) {
          this.firstTimeLoginProcess();
        }

        UserCache.saveUser(this.firebaseUser);
      });
    } else {
      this.userObject = null;
    }
  }

  public updateUser(user: FirebaseUser) {
    const userIdentification = user.email ? user.email : user.uid;
    const userRef = this.db.object<FirebaseUser>(FirebaseUtil.userPath(userIdentification));
    return userRef.update(FirebaseUtil.cleanupUserObject(user));
  }

  public processRetrievePerformanceFromServer(id: string, localSavedTime: number, mergeData: (questions: QuestionResult[]) => any, finalProcess: () => void) {
    if (this.isLogin()) {
      const last_saved_timeObject: AngularFireObject<number> = this.db.object(FirebaseUtil.performancePathLastSavedTime(this.getUserIdentification(), id));
      const lastSavedTimeSubscription = last_saved_timeObject.valueChanges().subscribe((last_saved_time) => {
        lastSavedTimeSubscription.unsubscribe();
        if (last_saved_time && last_saved_time > localSavedTime) {// Server Version is newer than local version
          const questionList: AngularFireList<QuestionResult> = this.db.list(FirebaseUtil.performancePathDetail(this.getUserIdentification(), id));
          const questionListSubscription = questionList.valueChanges().subscribe((questions) => {
            questionListSubscription.unsubscribe();
            if (questions.length > 0) {
              mergeData(questions);
            }
          });
        }
      });
    }
    finalProcess();
  }

  public firstTimeLoginProcess() {
    // Upload Practice Data
    PracticeData.DATA.forEach(e => {
      const practiceName = e[0] as string;
      if (localStorage.getItem(practiceName)) {
        const practiceResult = JSON.parse(localStorage.getItem(practiceName)) as PracticeResult;
        this.processSavePerformanceToServer(practiceName, practiceResult.lastSavedTime, practiceResult.questions);
      }
    });
  }

  public processSavePerformanceToServer(setID: string, localSavedTime: number, questions: QuestionResult[]) {
    if (!this.isLogin()) return;
    if (navigator.onLine) {
      console.log('Save data to server');
      // ============= Save Summary =====================
      const summary = new FirebasePerformanceSummary();
      summary.id = setID;
      summary.total_questions = questions.length;
      summary.last_saved_time = localSavedTime;
      summary.last_saved = new Date().toString();
      const answeredQuestions = questions.filter(e => e.selected_answer);
      answeredQuestions.forEach(e => {
        summary.answered_questions += 1;
        summary.correct_questions += e.is_correct ? 1 : 0;
        summary.total_time += e.question_time;
      });
      this.db.object(FirebaseUtil.performancePathSummary(this.getUserIdentification(), setID)).set(summary).then(error => {
        if (error) {
          console.log(error);
        }
      });
      // ============== Save Detail =======================
      answeredQuestions.forEach(e => FirebaseUtil.cleanQuestionResultForSaving(e)); // Remove undefined property before saving to server.
      this.db.object(FirebaseUtil.performancePathDetail(this.getUserIdentification(), setID)).set(ObjectUtils.convertListOfQuestionToObject(answeredQuestions)).then(error => {
        if (error) {
          console.log(error);
        }
      });
      ArrayUtils.removeFromUnsynchronized(setID);
    }
    else{
      console.log('Offline - Save to storage');
      ArrayUtils.addToUnsynchronizedListIfOffline(setID);
    }
  }

  public getRealLoginEvent() {
    return this.realLoginSubject.asObservable();
  }

  public getUserList(): AngularFireList<FirebaseUser> {
    return this.db.list<FirebaseUser>(FirebaseUtil.allUserPath());
  }

  public getUserQuestionReports() {
    return this.db.list<UserQuestionReport>(FirebaseUtil.allQuestionReports());
  }

  public deleteSavedPerformanceFromServer(id: string) {
    if (this.isLogin()) {
      this.db.object(FirebaseUtil.performancePath(this.getUserIdentification(), id)).remove();
    }
  }

  public reportQuestion(report: UserQuestionReport) {
    const questionSet = report.question_set;
    delete report.question_set;
    this.db.list(FirebaseUtil.reportPathDetail(questionSet)).push(report);
  }

  private isLogin(): boolean {
    return this.userObject != null;
  }

  public isUnlockFeature(): boolean {
    return this.firebaseUser.unlock_feature;
  }

  public isStudent(): boolean {
    return this.firebaseUser && this.firebaseUser.is_student;
  }

  public getUserIdentification(): string {
    return this.user.email ? this.user.email : this.user.providerData[0].uid;
  }

  public getRefToQuestionReport(report: UserQuestionReport) {
    return this.db.object(FirebaseUtil.reportPathDetail(report.question_set) + '/' + report.firebase_key);
  }

  // ======================== Data Correction Due to bad original design ==============================
  public correctUserPerformanceTree() {
    const userID = '10207104530450532';
    const sub = this.db.list<QuestionResult>(FirebaseUtil.performancePathDetail(userID, 'OG15-RC')).valueChanges().subscribe(questions => {
      sub.unsubscribe();
      console.log(questions);
      let obj: any = {};
      for (let question of questions) {
        obj = {...obj, [question.question_number]: question};
      }
      console.log(obj);

      this.db.object(FirebaseUtil.performancePathDetail(userID, 'OG15-RC')).set(obj).then(e => {
        if (e) console.log(e);
      });
    });
  }
}

import {Injectable} from '@angular/core';
import {Stage} from '../data/Model';
import {GMATPractice} from '../../../models/gmat-practice';
import {PracticeData} from '../data/practice-sets';
import {PracticeMode} from '../../../models/constants.enum';
import {Subscription} from 'rxjs/Subscription';
import {Question} from '../../../models/question';
import {PracticeResult} from '../../../models/test-result';
import {Location} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {WebService} from '../../../shared/services/web-service';
import {UserQuestionReport} from '../../../models/firebase.model';
import {interval} from 'rxjs/observable/interval';
import {Subject} from 'rxjs/Subject';
import {ArrayUtils} from '../../../shared/utils/array-utils';

@Injectable()
export class PracticeService {
  currentPractice: GMATPractice;
  exitPracticeScreenSubject: Subject<any> = new Subject<any>();

  constructor(private location: Location, private http: HttpClient, private webService: WebService) {
  }

  // ========================================Render Control ===================================================
  stage: Stage = Stage.SELECT;
  cache = false;
  isLoading = false; // If loading -> Not display chart, not go into practice/review mod

  // -------------Control variables----------------
  practiceMode: PracticeMode = PracticeMode.PRACTICE;
  questions: Question[];

  isStarted: boolean;
  isPaused: boolean;
  elapsedTime: number;

  currentQuestionIndex: number;
  currentQuestionTime = 0;

  subscription: Subscription;

  // -------------End Control variables------------

  public selectPracticeSet(practiceSet: GMATPractice) {
    this.currentPractice = practiceSet;

    // Try to load from Session Storage
    if (sessionStorage.getItem(this.currentPractice.practiceName) && this.cache) {
      PracticeData.processQuestionFile(this.currentPractice, sessionStorage.getItem(this.currentPractice.practiceName));
      this.loadSavedData();
      this.navigateToSelectedSet(practiceSet);
    } else {
      this.isLoading = true;
      // Load Questions from Server
      this.http.get(this.currentPractice.fileLocation, {responseType: 'text'}).subscribe((response: any) => {
        if (response.length) {
          PracticeData.processQuestionFile(this.currentPractice, response);
          this.loadSavedData();
          // Save to Session Storage for next time use
          sessionStorage.setItem(this.currentPractice.practiceName, response);
          this.navigateToSelectedSet(practiceSet);
        }
      });
    }
  }

  private navigateToSelectedSet(practiceSet: GMATPractice) {
    const url = this.location.path(true);
    if (url.indexOf(practiceSet.practiceName) < 0) {
      const newUrl = url + '/' + practiceSet.practiceName;
      this.location.go(newUrl);
    }
    this.stage = Stage.SUMMARY;
  }

  public backToSummary() {
    this.stage = Stage.SUMMARY;
    this.exitPracticeScreenSubject.next();
  }

  public startPractice() {
    this.stage = Stage.PRACTICE;
    this.updateUrlToCurrentQuestion();
  }

  public backToSelection() {
    this.stage = Stage.SELECT;
    const url = this.location.path(true);
    if (url.indexOf(this.currentPractice.practiceName) >= 0) {
      const newUrl = url.substring(0, url.indexOf(this.currentPractice.practiceName));
      this.location.go(newUrl);
    }
  }

  // ========================================End Render Control ===============================================

  // ===================================== Practice Control ===================================================


  // -------------Control Functions----------------
  start() {
    this.startAt(0);
  }

  startTest() {
    this.startAt(0);
    this.practiceMode = PracticeMode.TEST;
  }

  startAt(index: number) {
    if (this.isLoading) {
      const self = this;
      setTimeout(function () {
        self.startAt(index);
      }, 200);
      return;
    }

    this.isStarted = true;
    this.isPaused = false;
    this.currentQuestionTime = 0;
    this.currentQuestionIndex = index;
    this.elapsedTime = 0;
    this.practiceMode = PracticeMode.PRACTICE;
    this.questions = this.currentPractice.questions;
    this.startPractice();
    this.clearSelectedAnswer();
    this.subscribe();
  }

  resume(index: number) {
    if (this.practiceMode === PracticeMode.TEST) {
      const totalTimeOfPreviousQuestions = this.sumTotalTimeOfPreviousQuestions(index);
      this.startAt(index);
      this.elapsedTime = totalTimeOfPreviousQuestions;
    } else {
      this.startAt(index);
    }
  }

  sumTotalTimeOfPreviousQuestions(index: number): number {
    let count = 0;
    let sum = 0;
    for (const question of this.currentPractice.questions) {
      if (count++ < index) {
        sum += question.question_time;
      } else {
        break;
      }
    }
    return sum;
  }

  pauseOrResume() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.unSubscribe();
    } else {
      this.subscribe();
    }
  }

  end() {
    if (this.practiceMode === PracticeMode.PRACTICE || this.practiceMode === PracticeMode.TEST) {
      this.endPractice();
    } else {
      this.endReview();
    }
    this.clearUrlFromPracticeMode();
  }

  clearUrlFromPracticeMode() {
    let url = this.location.path(true);
    url = url.replace(/\/practice.*/, '').replace(/\/review.*/, '');
    this.location.go(url);
  }

  endPractice() {
    // Save Question Time
    if (this.getCurrentQuestion().selected_answer) {
      this.getCurrentQuestion().question_time = this.currentQuestionTime;
    }
    // UnSubscribe
    this.unSubscribe();
    // Save practice
    this.savePracticeData();
    // Back to summary
    this.backToSummary();
  }

  review() {
    this.reviewAt(0);
  }

  reviewAt(index: number) {

    if (this.isLoading) {
      const self = this;
      setTimeout(function () {
        self.reviewAt(index);
      }, 200);
      return;
    }

    this.practiceMode = PracticeMode.REVIEW;
    this.currentQuestionIndex = index;
    this.questions = this.currentPractice.questions;
    this.currentQuestionTime = this.getCurrentQuestion().question_time;

    if (this.currentPractice.hasExplanation) {
      if (sessionStorage.getItem(this.currentPractice.getExplanationName()) && this.cache) {
        PracticeData.processExplanationFile(this.currentPractice, sessionStorage.getItem(this.currentPractice.getExplanationName()));
        PracticeData.safeGuardExplanationForPremiumUser(this.currentPractice, this.webService);
        this.startPractice();
      } else {
        // Load Questions from Server
        this.http.get(this.currentPractice.getExplanationLocation(), {responseType: 'text'}).subscribe((response: any) => {
          if (response.length) {
            PracticeData.processExplanationFile(this.currentPractice, response);
            PracticeData.safeGuardExplanationForPremiumUser(this.currentPractice, this.webService);
            sessionStorage.setItem(this.currentPractice.getExplanationName(), response);
          }
          this.startPractice();
        });
      }
    } else {
      this.startPractice();
    }
  }

  endReview() {
    this.savePracticeData();
    this.backToSummary();
  }

  updateEachSecond() {
    if (this.practiceMode !== PracticeMode.REVIEW) {
      this.currentQuestionTime++;
      this.elapsedTime++;
    }
  }

  isInTestMode() {
    return this.practiceMode === PracticeMode.TEST;
  }

  // ------------- Navigation -------------------------
  next() {
    if (!this.isLastQuestion()) {
      // Save Question Time
      this.getCurrentQuestion().question_time = this.currentQuestionTime;
      // Move to the next question
      this.currentQuestionIndex++;
      this.currentQuestionTime = this.getCurrentQuestion().question_time;
      this.updateUrlToCurrentQuestion();
    }
  }

  prev() {
    if (!this.isFirstQuestion()) {
      // Save Question Time
      this.getCurrentQuestion().question_time = this.currentQuestionTime;
      // Move back to previous question
      this.currentQuestionIndex--;
      this.currentQuestionTime = this.getCurrentQuestion().question_time;
      this.updateUrlToCurrentQuestion();
    }
  }

  updateUrlToCurrentQuestion() {
    let url = this.location.path(true);
    url = url.replace(/\/practice.*/, '').replace(/\/review.*/, '');
    const mode = (this.practiceMode === PracticeMode.REVIEW ? 'review' : 'practice');
    const questionNo = this.currentQuestionIndex + 1;
    url = url + '/' + mode + '/' + questionNo;
    this.location.go(url);
  }

  getCurrentQuestion(): Question {
    return this.questions[this.currentQuestionIndex];
  }

  // ------------- Subscription -----------------------
  subscribe() {
    this.subscription = interval(1000).subscribe(() => {
      this.updateEachSecond();
    });
  }

  unSubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  // -------------End Control Functions------------

  // ------------- Report ----------------

  public reportQuestion(report: UserQuestionReport) {
    this.webService.reportQuestion(report);
  }

  // ==================================== End Practice Control ===============================================

  // =============================Save data to Local Storage & Server==========================
  savePracticeData() {
    let practiceResult;
    let changeIndexes: number[] = [];   // All questions that are different from saved ones

    if (localStorage.getItem(this.currentPractice.practiceName)) {
      const savedResult = JSON.parse(localStorage.getItem(this.currentPractice.practiceName)) as PracticeResult;
      changeIndexes = ArrayUtils.detectChanges(savedResult, this.currentPractice);

      PracticeResult.mergeResult(savedResult, this.currentPractice);
      PracticeResult.mergeResultToPractice(this.currentPractice, savedResult);
      localStorage.setItem(this.currentPractice.practiceName, JSON.stringify(savedResult));
      practiceResult = savedResult;
    } else {
      practiceResult = new PracticeResult(this.currentPractice);
      changeIndexes = ArrayUtils.fillAnsweredIndexes(this.currentPractice);
      localStorage.setItem(this.currentPractice.practiceName, JSON.stringify(practiceResult));
    }

    this.webService.processSavePerformanceToServer(this.currentPractice.practiceName, practiceResult.lastSavedTime, practiceResult.questions);
  }

  loadSavedData() {
    let savedResult: PracticeResult;
    if (localStorage.getItem(this.currentPractice.practiceName)) {
      console.log('Load Saved Data');
      savedResult = JSON.parse(localStorage.getItem(this.currentPractice.practiceName)) as PracticeResult;

      if (savedResult.numberOfQuestions <= this.currentPractice.numberOfQuestions) {
        PracticeResult.mergeArrayResultToPractice(this.currentPractice, savedResult.questions);
      }
      this.isLoading = false;
    }

    // Will override local result if the server version is newer
    this.webService.processRetrievePerformanceFromServer(this.currentPractice.practiceName, savedResult ? savedResult.lastSavedTime : 0, (questionResults) => {
      console.log('Newer version from Server detected. Getting data from server and saving to local');
      PracticeResult.mergeArrayResultToPractice(this.currentPractice, questionResults);
      localStorage.setItem(this.currentPractice.practiceName, JSON.stringify(new PracticeResult(this.currentPractice)));
    }, ()=>{
      this.isLoading = false;
    });
  }

  // ============================End Save Data =========================================

  // ==================================== Util Functions =====================================================
  clearSelectedAnswer() {
    this.questions.forEach(e => {
      e.selected_answer = null;
      e.question_time = 0;
    });
  }

  isFirstQuestion(): boolean {
    return this.currentQuestionIndex === 0;
  }

  isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.questions.length - 1;
  }
}

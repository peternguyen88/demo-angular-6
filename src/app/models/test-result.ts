import {GMATTest} from './gmat-test';
import {Question} from './question';
import {GMATPractice} from './gmat-practice';

export class TestResult {
  constructor(test: GMATTest) {
    this.testName = test.testName;
    this.numberOfQuestions = test.numberOfQuestions;
    this.questions = [];
    test.questions.filter(e => e.selected_answer).forEach(e => {
      this.numberOfAnsweredQuestions++;
      this.questions.push(new QuestionResult(e));
    });
    this.isTestFinished = this.numberOfQuestions === this.numberOfAnsweredQuestions;
    this.lastSavedTime = new Date().getTime();
  }

  testName: string;
  numberOfQuestions: number;
  numberOfAnsweredQuestions = 0;
  questions: QuestionResult[];
  isTestFinished: boolean;
  lastSavedTime: number;
}

export class PracticeResult {
  practiceName: string;
  numberOfQuestions: number;
  numberOfAnsweredQuestions = 0;
  questions: QuestionResult[];
  lastSavedTime: number;

  constructor(practice: GMATPractice) {
    this.practiceName = practice.practiceName;
    this.numberOfQuestions = practice.numberOfQuestions;
    this.questions = [];
    practice.questions.forEach(e => {
      if (e.selected_answer) { this.numberOfAnsweredQuestions++; }
      this.questions.push(new QuestionResult(e));
    });
    this.lastSavedTime = new Date().getTime();
  }

  public static mergeResult(result: PracticeResult, practice: GMATPractice): void {
    for (let i = 0; i < practice.questions.length; i++) {
      if (practice.questions[i] && practice.questions[i].selected_answer) {
        result.questions[i].selected_answer = practice.questions[i].selected_answer;
        result.questions[i].question_time = practice.questions[i].question_time;
        result.questions[i].is_correct = practice.questions[i].isCorrect();
        result.questions[i].bookmarked = practice.questions[i].bookmarked;
        result.questions[i].remarks = practice.questions[i].remarks;
      }
    }
    result.lastSavedTime = new Date().getTime();
  }

  public static mergeResultToPractice(practice: GMATPractice, result: PracticeResult): void {
    for (let i = 0; i < practice.questions.length; i++) {
      if (result.questions[i] && result.questions[i].selected_answer) {
        practice.questions[i].selected_answer = result.questions[i].selected_answer;
        practice.questions[i].question_time = result.questions[i].question_time;
        practice.questions[i].bookmarked = result.questions[i].bookmarked;
        practice.questions[i].remarks = result.questions[i].remarks;
        practice.questions[i].first = result.questions[i].first;
        practice.questions[i].history = result.questions[i].history;
      }
    }
  }

  /**
   * In Practice, user can do question in any order -> Need to check a match of question number
   */
  public static mergeArrayResultToPractice(practice: GMATPractice, questionResults: QuestionResult[]): void {
    let lastMatch = -1; // Index of last match item
    for (let i = 0; i < questionResults.length; i++) {
      for (let j = lastMatch + 1; j < practice.questions.length; j++) {
        if (questionResults[i].question_number === practice.questions[j].question_number) {
          practice.questions[j].selected_answer = questionResults[i].selected_answer;
          practice.questions[j].question_time = questionResults[i].question_time;
          practice.questions[j].bookmarked = questionResults[i].bookmarked;
          practice.questions[j].remarks = questionResults[i].remarks;
          practice.questions[j].first = questionResults[i].first;
          practice.questions[j].history = questionResults[i].history;
          // No need to loop after finding the match
          lastMatch = j;
          break;
        }
      }
    }
  }
}

export interface AnswerHistory {
  answer: string;
  time: number;
}

export class QuestionResult {
  constructor(question: Question) {
    this.question_number = question.question_number;
    this.selected_answer = question.selected_answer;
    this.is_correct = question.isCorrect();
    this.question_time = question.question_time;
    this.bookmarked = question.bookmarked;
    this.remarks = question.remarks;
  }

  question_number: string;
  selected_answer: string;
  question_time: number;
  is_correct: boolean;
  bookmarked: boolean;
  remarks: string;
  first: AnswerHistory;
  history: AnswerHistory[];
}

import {QuestionType} from './constants.enum';
import {AnswerHistory} from './test-result';
import {DigitalTimeDirective} from '../shared/directives/gm-digital-time.directive';

/**
 * We don't put question here because SC doesn't have question. RC also have reading. CR sometimes has question stem
 * before stimulus.
 */
export class Question {
  question_number: string;
  question_explanation: string;
  question_type: QuestionType;
  question_stem: string;
  reading_passage: string;
  question_difficulty: string;
  question_time: number;
  option_A: string;
  option_B: string;
  option_C: string;
  option_D: string;
  option_E: string;
  selected_answer: string;
  correct_answer: string;
  bookmarked = false;
  remarks: string;
  isFirstRC = false;
  first: AnswerHistory;
  history: AnswerHistory[];

  public isCorrect(): boolean {
    return this.selected_answer === this.correct_answer;
  }

  public isIncorrect(): boolean {
    return this.selected_answer && this.selected_answer !== this.correct_answer;
  }

  public isCriticalReasoning(): boolean {
    return this.question_type === QuestionType.CRITICAL_REASONING;
  }

  public isSentenceCorrection(): boolean {
    return this.question_type === QuestionType.SENTENCE_CORRECTION;
  }

  public isReadingComprehension(): boolean {
    return this.question_type === QuestionType.READING_COMPREHENSION;
  }

  public isShowUrgingMessage(time: number): boolean {
    if (this.isCriticalReasoning()) {
      return time >= 60 * 2;
    } else if (this.isSentenceCorrection()) {
      return time >= 60 * 1.75;
    } else if (this.isReadingComprehension()) {
      if (this.isFirstRC) {
        return false;
      }
      return time >= 60 * 1.3;
    }
    return false;
  }

  public toggleBookmark() {
    this.bookmarked = !this.bookmarked;
  }

  public hasNote(): boolean {
    return this.remarks != null && this.remarks !== '';
  }

  public hasExplanation(): boolean {
    return this.question_explanation != null;
  }

  public getLabelClass(option: string, isShowAnswer: boolean): string {
    if (isShowAnswer && option === this.correct_answer) {
      return 'correct_answer';
    } else {
      if (option !== this.selected_answer) return '';

      if (this.isCorrect()) return 'correct_answer';
      else return 'incorrect_answer';
    }
  }

  public getSummaryClass() {
    if (this.isCorrect()) return 'summary-correct-answer';
    if (this.isIncorrect()) return 'summary-incorrect-answer';
    return '';
  }

  public getFirstAnswerSummaryClass() {
    if (!this.first || this.history.length <= 1) return '';
    if (this.first.answer === this.correct_answer) return 'summary-correct-answer';
    if (this.first.answer !== this.correct_answer) return 'summary-incorrect-answer';
    return '';
  }

  public getHistoryHtml() {
    let html = '<table><tr><th>Answer</th><th>Time</th></tr>';
    if (this.history) {
      if(this.first.answer !== this.history[0].answer || this.first.time !== this.history[0].time){
        html += '<tr><td>' + this.first.answer + '</td><td>'+ DigitalTimeDirective.convertTimeToString(this.first.time) +'</td></tr>'
      }
      for(const e of this.history){
        html += '<tr><td>' + e.answer + '</td><td>'+ DigitalTimeDirective.convertTimeToString(e.time) +'</td></tr>'
      }
    }
    html += '</table>';
    return html;
  }
}

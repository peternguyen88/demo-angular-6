import {Status} from './constants.enum';
import {Question} from './question';

export class GMATPractice {
  numberOfQuestions: number;
  practiceName: string;
  practiceFullName: string;
  status: Status;
  fileLocation: string;
  questions: Question[] = [];
  hasExplanation: boolean;
  allowedTime: number;
  hasChanges = false; // To indicate if we need to redraw the chart

  isTest(): boolean {
    return this.status === Status.TEST;
  }

  getExplanationLocation(): string {
    return this.fileLocation.substring(0, this.fileLocation.lastIndexOf('.'))
      + '-explanation' + this.fileLocation.substring(this.fileLocation.lastIndexOf('.'));
  }

  getExplanationName(): string {
    return this.practiceName + '-explanation';
  }

  getNumberOfCorrectAnswers(){
    return this.questions.filter(e => e.isCorrect()).length;
  }

  getNumberOfIncorrectAnswers(){
    return this.questions.filter(e => e.isIncorrect()).length;
  }
}

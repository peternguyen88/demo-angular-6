import {Certainty} from './constants.enum';

export class TimerQuestion {
  question_number: number;
  selected_answer: string;
  correct_answer: string;
  question_time: number;
  is_correct: boolean;
  certainty: Certainty;

  constructor(index: number) {
    this.question_number = index;
    this.question_time = 0;
    this.certainty = Certainty.SURE;
    this.is_correct = false;
  }
}

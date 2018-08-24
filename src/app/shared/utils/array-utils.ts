import {PracticeResult} from '../../models/test-result';
import {GMATPractice} from '../../models/gmat-practice';

export class ArrayUtils {

  public static removeFromUnsynchronized(set: string){
    if (localStorage.getItem('unsynchronized')) {
      const items = JSON.parse(localStorage.getItem('unsynchronized')) as string[];
      items.splice( items.indexOf(set), 1 );
      localStorage.setItem('unsynchronized', JSON.stringify(items));
    }
  }

  public static addToUnsynchronizedListIfOffline(set: string) {
    if (localStorage.getItem('unsynchronized')) {
      const items = JSON.parse(localStorage.getItem('unsynchronized')) as string[];
      items.push(set);
      localStorage.setItem('unsynchronized', JSON.stringify(items));
    }
    else{
      localStorage.setItem('unsynchronized', JSON.stringify([set]));
    }
  }

  public static detectChanges(savedResult: PracticeResult, practice: GMATPractice) {
    const changeIndexes = [];
    for (let i = 0; i < practice.questions.length; i++) {
      const saved = savedResult.questions[i];
      const question = practice.questions[i];

      // If answer or time change -> save to history
      if (question.selected_answer && (question.selected_answer !== saved.selected_answer || question.question_time !== saved.question_time)) {
        if (!saved.history) saved.history = [];
        if (!saved.first) {// Many question doesn't have first answers -> set the current one as first answer
          saved.first = {
            answer: saved.selected_answer ? saved.selected_answer : question.selected_answer,
            time: saved.selected_answer ? saved.question_time : question.question_time
          };
          saved.history.push(saved.first);
        }

        if (saved.history.length && (saved.history[0].answer !== question.selected_answer || saved.history[0].time !== question.question_time)) {
          if (saved.history.length >= 5) {
            saved.history = saved.history.slice(1);
          }
          saved.history.push({answer: question.selected_answer, time: question.question_time});
        }

        practice.hasChanges = true;
      }

      if ((saved.selected_answer || question.selected_answer) && question.selected_answer && (saved.bookmarked !== question.bookmarked ||
        saved.question_time !== question.question_time || saved.selected_answer !== question.selected_answer
        || ArrayUtils.isDifferent(saved.remarks, question.remarks))) {
        changeIndexes.push(i);
      }
    }

    return changeIndexes;
  }

  public static fillAnsweredIndexes(practice: GMATPractice) {
    const indexes = [];
    for (let i = 0; i < practice.questions.length; i++) {
      const question = practice.questions[i];
      if (question && question.selected_answer) {
        indexes.push(i);
        question.first = {answer: question.selected_answer, time: question.question_time};
        question.history = [question.first];
      }
    }

    if (indexes.length) practice.hasChanges = true;

    return indexes;
  }

  private static isDifferent(x, y) {
    return !x && y || x && !y || x !== y;
  }
}

import {QuestionResult} from '../../models/test-result';

export class ObjectUtils {
  public static convertListOfQuestionToObject(questions: QuestionResult[]){
    let obj: any = {};
    for (let question of questions) {
      obj = {...obj, [question.question_number] : question};
    }
    return obj;
  }
}

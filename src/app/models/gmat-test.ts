import {Status, TestType} from "./constants.enum";
import {Question} from "./question";
/**
 * GMATTest class - There are two types of test. Quant - 37 questions & Verbal - 41 questions
 */
export class GMATTest {
  testType: TestType;
  numberOfQuestions: number;
  testName: string;
  testDifficulty: string;
  allowedTime: number;
  status: Status;
  fileLocation: string;
  questions: Question[];

  constructor(testType: TestType) {
    this.testType = testType;
    this.questions = [];
  }

  public isActive(): boolean {
    return this.status == Status.ACTIVE;
  }
}

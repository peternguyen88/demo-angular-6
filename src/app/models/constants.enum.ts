/**
 * Define Question Types
 */
export enum QuestionType {
  SENTENCE_CORRECTION = <any>'SC',
  CRITICAL_REASONING = <any>'CR',
  READING_COMPREHENSION = <any>'RC',
  DATA_SUFFICIENCY = <any>'DS',
  PROBLEM_SOLVING = <any>'PS'
}

export enum TestType {
  QUANTITATIVE,
  VERBAL
}

export enum Status {
  ACTIVE = <any>'ACTIVE',
  LOCKED = <any>'LOCKED',
  TEST = <any>'TEST'
}

export enum EnumTestStage {
  WELCOME = <any>'WELCOME',
  STARTED = <any>'STARTED',
  FINISHED = <any>'FINISHED',
  REVIEW = <any>'REVIEW'
}

export enum TestMode {
  TEST = <any>'TEST',
  PRACTICE = <any>'PRACTICE',
  REVIEW = <any>'REVIEW'
}

export enum PracticeMode {
  PRACTICE = <any>'PRACTICE',
  REVIEW = <any>'REVIEW',
  TEST = <any>'TEST'
}

export enum TimerType {
  QUANTITATIVE, VERBAL, PRACTICE
}

export enum TimerStage {
  WELCOME, TIMING, REVIEW
}

export enum Certainty {
  SURE = <any>'SURE',
  DOUBT = <any>'DOUBT',
  GUESS = <any>'GUESS'
}

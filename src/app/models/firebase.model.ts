export class FirebaseUser {
  email: string;
  uid: string;
  name: string;
  login_count: number;
  last_login: string;
  unlock_feature: boolean;
  disable: boolean;
  firebase_uid: string;
  is_student = false;
  photo_url: string;
  last_login_time: number;
  mobile_installed: boolean = null;
  class_joined: string = null;

  constructor(email: string, name: string, uid: string) {
    this.email = email;
    this.name = name;
    this.uid = uid;
    this.login_count = 0;
    this.disable = false;
    this.unlock_feature = false;
    this.is_student = false;
  }
}

export class FirebasePerformanceSummary {
  id: string;
  total_questions = 0;
  answered_questions = 0;
  correct_questions = 0;
  total_time = 0;
  last_saved: string;
  last_saved_time: number;
}

export class UserQuestionReport {
  question_set: string;
  question_number: string;
  report_content: string;
  report_time: string;
  report_user_name: string;
  report_user_id: string;
  processed = false;
  firebase_key: string;
}

export class FirebaseClass {
  class_id: string;
  class_name: string;
  class_desc: string;
  time_from: number;
  time_to: number;
}

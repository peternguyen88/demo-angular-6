export interface ConfirmMessage {
  header: string;
  message: string;
  icon?: string;
  accept?: Function;
  reject?: Function;
  acceptLabel?: string;
  rejectLabel?: string;
  textContent?: string;
  hasTextContent?: boolean;
  showCloseIcon?: boolean;
}

export class ConfirmMessageConstant {
  static ANSWER_REQUIRED: ConfirmMessage = {
    header: 'Answer Required!',
    message: 'You cannot continue with this question unanswered.',
    rejectLabel: 'Close',
    showCloseIcon: true
  };

  static CONFIRM_NEXT_QUESTION: ConfirmMessage = {
    header: 'Answer Confirmation!',
    message: 'Click Confirm to confirm your answer and continue to the next question.',
    acceptLabel: 'Confirm',
    rejectLabel: 'Close',
    showCloseIcon: true
  };

  static TEST_PAUSED: ConfirmMessage = {
    header: 'You Have Paused The Test!',
    message: 'Please click Resume to continue the test.',
    acceptLabel: 'Resume',
    showCloseIcon: false
  };

  static PRACTICE_PAUSED: ConfirmMessage = {
    header: 'Paused!',
    message: 'Please click Resume to continue.',
    acceptLabel: 'Resume',
    showCloseIcon: false
  };

  static TIMEOUT: ConfirmMessage = {
    header: 'Timeout!',
    message: 'Test time has run out. Please click Continue to continue the Test in Practice Mode.',
    acceptLabel: 'Continue',
    rejectLabel: 'End Test',
    showCloseIcon: false
  };

  static CANNOT_SWITCH_TO_TEST_MODE: ConfirmMessage = {
    header: 'Cannot Switch To Test Mode!',
    message: 'Test time has run out. You cannot switch to Test Mode',
    acceptLabel: 'OK',
    showCloseIcon: true
  };

  static FINAL_QUESTION_REACHED: ConfirmMessage = {
    header: 'Final Question',
    message: 'Congratulation, you have reached the end of the test. Click Finish to end the test or Cancel to change your answer.',
    acceptLabel: 'Finish',
    rejectLabel: 'Cancel',
    showCloseIcon: true
  };

  static CONFIRM_DELETE_SAVED_DATA: ConfirmMessage = {
    header: 'Confirm Delete Saved Data',
    message: 'Do you really want to delete saved data? This action cannot be undone.',
    acceptLabel: 'Confirm',
    rejectLabel: 'Cancel',
    showCloseIcon: true
  };

  static PLEASE_LOGIN_TO_CONTINUE: ConfirmMessage = {
    header: 'Please login to continue',
    message: 'You have to login to use this function!',
    acceptLabel: 'OK, Log Me In!',
    showCloseIcon: true
  };

  static PREMIUM_FEATURE_NOT_ENABLED: ConfirmMessage = {
    header: 'Premium Feature Access',
    message: 'This is premium feature, only available for GMAT - Zero To Hero Students, If you are eligible, please contact Admin!',
    acceptLabel: 'OK, I understand',
    showCloseIcon: true
  };

  static STUDENT_ACCESS_ONLY: ConfirmMessage = {
    header: 'Restricted Feature Access',
    message: 'This is premium feature, only available for GMAT - Zero To Hero Students!',
    acceptLabel: 'OK, I understand',
    showCloseIcon: true
  };

  static REPORT_REASON: ConfirmMessage = {
    header: 'Report',
    message: 'What is your reason for reporting this question?',
    acceptLabel: 'Submit',
    rejectLabel: 'Cancel',
    hasTextContent: true,
    showCloseIcon: true
  };
}

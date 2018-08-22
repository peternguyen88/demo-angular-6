import {QuestionType, Status} from '../../../models/constants.enum';
import {GMATPractice} from '../../../models/gmat-practice';
import {Question} from '../../../models/question';
import {WebService} from '../../../shared/services/web-service';


export class PracticeData {
  // Structure: 'practice name', 'number of questions', 'status', 'link to file', 'last time of major change in file', 'name', 'has explanation'
  static DATA = [
    ['OG15-CR', 124, Status.ACTIVE, 'practices/OG15/cr.txt', 0, 'Official Guide 2015 - CR', false],
    ['OG15-SC', 140, Status.ACTIVE, 'practices/OG15/sc.txt', 0, 'Official Guide 2015 - SC', true],
    ['OG15-RC', 144, Status.ACTIVE, 'practices/OG15/rc.txt', 0, 'Official Guide 2015 - RC', false],
    ['VR15-CR', 83, Status.ACTIVE, 'practices/VR15/cr.txt', 0, 'Verbal Review 2015 - CR', false],
    ['VR15-SC', 144, Status.ACTIVE, 'practices/VR15/sc.txt', 0, 'Verbal Review 2015 - SC', false],
    ['VR15-RC', 104, Status.ACTIVE, 'practices/VR15/rc.txt', 0, 'Verbal Review 2015 - RC', false],
    ['OG19', 59, Status.ACTIVE, 'premium/og19.txt', 0, 'Official Guide 2019', false],
    ['VR19', 47, Status.ACTIVE, 'premium/vr19.txt', 0, 'Verbal Review 2019', false],
  ];

  static PREMIUM_DATA = [
    ['OG16', 102, Status.ACTIVE, 'premium/og16.txt', 0, 'Official Guide 2016', false],
    ['VR16', 76, Status.ACTIVE, 'premium/vr16.txt', 0, 'Verbal Review 2016', false],
    ['OG17', 61, Status.ACTIVE, 'premium/og17.txt', 0, 'Official Guide 2017', false],
    ['VR17', 45, Status.ACTIVE, 'premium/vr17.txt', 0, 'Verbal Review 2017', false],
    ['OG18', 61, Status.ACTIVE, 'premium/og18.txt', 0, 'Official Guide 2018', false],
    ['VR18', 42, Status.ACTIVE, 'premium/vr18.txt', 0, 'Verbal Review 2018', false],
    ['QP1-CR', 75, Status.ACTIVE, 'practices/QP1/cr.txt', 0, 'Question Pack 1 - CR', false],
    ['QP1-SC', 75, Status.ACTIVE, 'practices/QP1/sc.txt', 0, 'Question Pack 1 - SC', false],
    ['QP1-RC', 75, Status.ACTIVE, 'practices/QP1/rc.txt', 0, 'Question Pack 1 - RC', false],
  ];

  static COMPREHENSIVE_SC = [
    ['COM-SC-01', 84, Status.ACTIVE, 'comprehensive/sc_01.txt', 0, 'SC Comprehensive - Part I', false],
    ['COM-SC-02', 84, Status.ACTIVE, 'comprehensive/sc_02.txt', 0, 'SC Comprehensive - Part II', false],
    ['COM-SC-03', 84, Status.ACTIVE, 'comprehensive/sc_03.txt', 0, 'SC Comprehensive - Part III', false],
    ['COM-SC-04', 84, Status.ACTIVE, 'comprehensive/sc_04.txt', 0, 'SC Comprehensive - Part IV', false],
    ['COM-SC-05', 83, Status.ACTIVE, 'comprehensive/sc_05.txt', 0, 'SC Comprehensive - Part V', false],
  ];

  static COMPREHENSIVE_CR = [
    ['COM-CR-01', 86, Status.ACTIVE, 'comprehensive/cr_01.txt', 0, 'CR Comprehensive - Part I', false],
    ['COM-CR-02', 86, Status.ACTIVE, 'comprehensive/cr_02.txt', 0, 'CR Comprehensive - Part II', false],
    ['COM-CR-03', 85, Status.ACTIVE, 'comprehensive/cr_03.txt', 0, 'CR Comprehensive - Part III', false],
  ];

  static COMPREHENSIVE_RC = [
    ['COM-RC-01', 88, Status.ACTIVE, 'comprehensive/rc_01.txt', 0, 'RC Comprehensive - Part I', false],
    ['COM-RC-02', 88, Status.ACTIVE, 'comprehensive/rc_02.txt', 0, 'RC Comprehensive - Part II', false],
    ['COM-RC-03', 89, Status.ACTIVE, 'comprehensive/rc_03.txt', 0, 'RC Comprehensive - Part III', false],
    ['COM-RC-04', 85, Status.ACTIVE, 'comprehensive/rc_04.txt', 0, 'RC Comprehensive - Part IV', false],
  ];

  static QUANTITATIVE = [
    ['MR700-PS', 53, Status.ACTIVE, 'quant/mr700-ps.txt', 0, 'Math Revolution - 700+ Level - PS', false],
    ['MR700-DS', 97, Status.ACTIVE, 'quant/mr700-ds.txt', 0, 'Math Revolution - 700+ Level - DS', false],
    ['IS-S1-I', 111, Status.ACTIVE, 'quant/is/is-s1-I.txt', 0, 'Ian Stewart - Set 1 - Part I', false],
    ['IS-S1-II', 111, Status.ACTIVE, 'quant/is/is-s1-II.txt', 0, 'Ian Stewart - Set 1 - Part II', false],
  ];

  static GMATCLUB_QUANT_TESTS = [
    ['GMC-01', 31, Status.TEST, 'tests/quant-tests/gcm-01.txt', 0, 'GMAT Club Quant Test 01', true],
    ['GMC-02', 31, Status.TEST, 'tests/quant-tests/gcm-02.txt', 0, 'GMAT Club Quant Test 02', true],
    ['GMC-03', 31, Status.TEST, 'tests/quant-tests/gcm-03.txt', 0, 'GMAT Club Quant Test 03', true],
  ];

  static DS_OPTIONS = [
    'Statement (1) ALONE is sufficient, but statement (2) alone is not sufficient.',
    'Statement (2) ALONE is sufficient, but statement (1) alone is not sufficient to answer the question asked.',
    'BOTH statements (1) and (2) TOGETHER are sufficient to answer the question asked, but NEITHER statement ALONE is sufficient to answer the question asked.',
    'EACH statement ALONE is sufficient to answer the question asked.',
    'Statements (1) and (2) TOGETHER are NOT sufficient to answer the question asked, and additional data specific to the problem are needed.',
  ];

  static practices: GMATPractice[];

  static premiumSets: GMATPractice[];

  static comprehensiveSC: GMATPractice[];

  public static getAllPracticeSets(): GMATPractice[] {
    if (PracticeData.practices === undefined) {
      PracticeData.practices = [];

      PracticeData.DATA.forEach(e => {
        PracticeData.practices.push(PracticeData.buildPractice(e));
      });
    }
    return PracticeData.practices;
  }

  public static getAllPremiumSets(): GMATPractice[] {
    if (PracticeData.premiumSets === undefined) {
      PracticeData.premiumSets = [];

      PracticeData.PREMIUM_DATA.forEach(e => {
        PracticeData.premiumSets.push(PracticeData.buildPractice(e));
      });
    }
    return PracticeData.premiumSets;
  }

  public static getComprehensiveSC(): GMATPractice[] {
    if (PracticeData.comprehensiveSC === undefined) {
      PracticeData.comprehensiveSC = [];
      PracticeData.COMPREHENSIVE_SC.forEach(e => {
        PracticeData.comprehensiveSC.push(PracticeData.buildPractice(e));
      });
    }
    return PracticeData.comprehensiveSC;
  }

  public static getComprehensiveCR(): GMATPractice[] {
    const cr = [];
    PracticeData.COMPREHENSIVE_CR.forEach(e => {
      cr.push(PracticeData.buildPractice(e));
    });
    return cr;
  }

  public static getQuantitativeSets(): GMATPractice[] {
    const quant = [];

    PracticeData.QUANTITATIVE.forEach(e => {
      quant.push(PracticeData.buildPractice(e));
    });

    return quant;
  }

  public static getGMATClubTests(): GMATPractice[] {
    const quant = [];

    PracticeData.GMATCLUB_QUANT_TESTS.forEach(e => {
      quant.push(PracticeData.buildPractice(e));
    });

    return quant;
  }

  public static getComprehensiveRC(): GMATPractice[] {
    const cr = [];
    PracticeData.COMPREHENSIVE_RC.forEach(e => {
      cr.push(PracticeData.buildPractice(e));
    });
    return cr;
  }

  private static buildPractice(e) {
    const practice = new GMATPractice();
    practice.practiceName = e[0] as string;
    practice.numberOfQuestions = e[1] as number;
    practice.status = e[2] as Status;
    practice.fileLocation = e[3] as string;
    practice.fileLocation = 'assets/' + practice.fileLocation;
    if (e.length >= 5) {
      practice.practiceFullName = e[5] as string;
    }
    practice.hasExplanation = e[6] as boolean;
    return practice;
  }

  public static processQuestionFile(practice: GMATPractice, fileContent: string) {
    const questions: Question[] = [];

    const headers: string[] = fileContent.substring(0, fileContent.indexOf('\n')).split('####');
    if (headers.length >= 5) {
      const maxTime: number = parseInt(headers[4], 10);
      practice.allowedTime = maxTime * 60;
    }

    const data = fileContent.slice(fileContent.indexOf('\n')).split('---------------------------------').filter(e => e.trim() !== '');

    data.forEach(e => {
      const lines = e.split('\n');
      const questionInfo = (lines[1] as string).split('#').filter(part => part.trim() !== '');

      const question = new Question();
      if (questionInfo[0] === 'CR') {
        question.question_type = QuestionType.CRITICAL_REASONING;
      } else if (questionInfo[0] === 'SC') {
        question.question_type = QuestionType.SENTENCE_CORRECTION;
      } else if (questionInfo[0] === 'RC') {
        question.question_type = QuestionType.READING_COMPREHENSION;
      } else if (questionInfo[0] === 'DS') {
        question.question_type = QuestionType.DATA_SUFFICIENCY;
      } else if (questionInfo[0] === 'PS') {
        question.question_type = QuestionType.PROBLEM_SOLVING;
      }

      question.question_number = questionInfo[1];
      question.correct_answer = questionInfo[2];
      question.question_time = 0;

      let questionStemStart = 2;
      if (question.question_type === QuestionType.READING_COMPREHENSION) {
        question.reading_passage = lines[2];
        questionStemStart = 3;
      }

      question.question_stem = lines[questionStemStart];

      if (question.question_type === QuestionType.DATA_SUFFICIENCY) {    // DS questions have no option
        const firstDatum = lines[questionStemStart + 1];
        const secondDatum = lines[questionStemStart + 2];

        question.question_stem += '<br><br>' + '(1) ' + firstDatum + '<br><br>' + '(2) ' + secondDatum;

        question.option_A = PracticeData.DS_OPTIONS[0];
        question.option_B = PracticeData.DS_OPTIONS[1];
        question.option_C = PracticeData.DS_OPTIONS[2];
        question.option_D = PracticeData.DS_OPTIONS[3];
        question.option_E = PracticeData.DS_OPTIONS[4];
      } else {
        const sliceLength = lines[questionStemStart + 1].startsWith('(A)') ? 4 : 3;

        question.option_A = lines[questionStemStart + 1].slice(sliceLength);
        question.option_B = lines[questionStemStart + 2].slice(sliceLength);
        question.option_C = lines[questionStemStart + 3].slice(sliceLength);
        question.option_D = lines[questionStemStart + 4].slice(sliceLength);
        question.option_E = lines[questionStemStart + 5].slice(sliceLength);
      }

      questions.push(question);
    });

    practice.numberOfQuestions = questions.length;
    practice.questions = questions;
  }

  public static processExplanationFile(practice: GMATPractice, fileContent: string) {
    const data = fileContent.slice(fileContent.indexOf('\n')).split('---------------------------------').filter(e => e.trim() !== '');

    let index = 0;
    data.forEach(e => {
      const explanation = e.trim();
      practice.questions[index++].question_explanation = explanation.slice(explanation.indexOf('\n') + 1);
    });
  }

  public static safeGuardExplanationForPremiumUser(practice: GMATPractice, webService: WebService) {
    if (webService.isLogin() && webService.isUnlockFeature()) {
      return;
    }

    if (practice.practiceName === 'OG15-SC') {
      for (let index = 14; index < 140; index++) {
        practice.questions[index].question_explanation = '<div class="alert alert-warning" style="text-align: center;">THIS CONTENT IS FOR PREMIUM USER ONLY</div>';
      }
    }
  }

  public static resolvePracticeSetsBySection(section: string): GMATPractice[] {
    if (section === 'standard') {
      return PracticeData.getAllPracticeSets();
    } else if (section === 'premium') {
      return PracticeData.getAllPremiumSets();
    } else if (section === 'quantitative') {
      return PracticeData.getQuantitativeSets();
    } else if (section === 'comprehensive') {
      return [...PracticeData.getComprehensiveSC(), ...PracticeData.getComprehensiveCR(), ...PracticeData.getComprehensiveRC()];
    } else if (section === 'gmat-club-test') {
      return PracticeData.getGMATClubTests();
    }

    return PracticeData.getAllPracticeSets();
  }

  public static isAuthenticationNeeded(practiceName: string) {
    if (practiceName.indexOf('IS-S') >= 0) {
      return true;
    }

    const premiums = [...PracticeData.COMPREHENSIVE_CR, ...PracticeData.COMPREHENSIVE_RC, ...PracticeData.COMPREHENSIVE_SC, ...PracticeData.PREMIUM_DATA];
    let needAuthentication = false;
    premiums.forEach(p => {
      if (p[0] === practiceName) {
        needAuthentication = true;
      }
    });

    return needAuthentication;
  }

  public static isStudentAccessOnly(practiceName: string) {
    const premiums = [...PracticeData.COMPREHENSIVE_CR, ...PracticeData.COMPREHENSIVE_RC, ...PracticeData.COMPREHENSIVE_SC, ...PracticeData.PREMIUM_DATA];
    let needToBeStudent = false;
    premiums.forEach(p => {
      if (p[0] === practiceName) {
        needToBeStudent = true;
      }
    });

    return needToBeStudent;
  }
}

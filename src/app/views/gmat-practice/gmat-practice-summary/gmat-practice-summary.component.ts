/**
 * Summary Screen - Showing a list of test for user to choose
 */
import {Component, OnDestroy, Pipe, PipeTransform} from '@angular/core';
import {PracticeService} from '../services/gmat-practice.service';
import {HttpClient} from '@angular/common/http';
import {GMATPractice} from '../../../models/gmat-practice';
import {Question} from '../../../models/question';
import {ColorConstants} from '../../../models/color-constants';
import {TimeUtils} from '../../../shared/utils/time-utils';

@Component({
  moduleId: module.id,
  selector: 'app-gmat-practice-summary',
  templateUrl: 'gmat-practice-summary.component.html'
})
export class GMATPracticeSummaryComponent implements OnDestroy {
  currentPractice: GMATPractice;
  resumable = true;
  isCollapsed = false; // Summary Panel Collapsed
  chartVisibility = true; // Small hack to refresh chart

  // Chart Data
  doughnutData = {
    labels: ['Correct', 'Incorrect', 'Not Try'],
    datasets: [
      {
        data: [],
        backgroundColor: [
          ColorConstants.green,
          ColorConstants.red,
          ColorConstants.yellow
        ],
      },
      {
        data: [],
        backgroundColor: [
          ColorConstants.green,
          ColorConstants.red,
          ColorConstants.yellow
        ],
      },
    ]
  };

  barData = {
    labels: ['Latest', 'First Try'],
    datasets: [
      {
        label: 'All',
        backgroundColor: ColorConstants.purple,
        borderColor: ColorConstants.purple,
        data: []
      },
      {
        label: 'Correct',
        backgroundColor: ColorConstants.green,
        borderColor: ColorConstants.green,
        data: []
      },
      {
        label: 'Incorrect',
        backgroundColor: ColorConstants.red,
        borderColor: ColorConstants.red,
        data: []
      }
    ],
  };

  timeAxisOption = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero:true,
          userCallback: function (v) {
            return TimeUtils.epoch_to_mm_ss(v);
          },
        }
      }]
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          return data.datasets[tooltipItem.datasetIndex].label + ': ' + TimeUtils.epoch_to_mm_ss(tooltipItem.yLabel);
        }
      }
    },
    title: {
      display: true,
      text: 'Average Time Spent'
    },
    legend:{
      position: 'bottom'
    }
  };

  doughnutOption = {
    title: {
      display: true,
      text: 'Small Circle: First Try - Large Circle: Latest'
    },
    legend:{
      position: 'bottom'
    }
  };

  constructor(private http: HttpClient, private practiceService: PracticeService) {
    this.currentPractice = practiceService.currentPractice;
    this.resumable = this.currentPractice.questions.length !== this.getUnansweredQuestionIndex();
    this.buildChartData();
    const self = this;

    this.practiceService.exitPracticeScreenSubject.subscribe(() => { // Subscribe to the event when user exit from Practice Screen
      if(self.currentPractice.hasChanges) {
        self.buildChartData();
        self.chartVisibility = false;
        self.currentPractice.hasChanges = false;
        setTimeout(function () {
          self.chartVisibility = true;
        }, 0);
      }
    });
  }

  startPractice() {
    if (this.currentPractice.isTest()) {
      this.practiceService.startTest();
    } else {
      this.practiceService.start();
    }
  }

  resumePractice() {
    if (this.resumable) {
      this.practiceService.resume(this.getUnansweredQuestionIndex());
    }
  }

  startPracticeAt(question: Question) {
    const index = this.currentPractice.questions.indexOf(question);
    this.practiceService.startAt(index);
  }

  startReview() {
    this.practiceService.review();
  }

  startReviewAt(question: Question) {
    const index = this.currentPractice.questions.indexOf(question);
    this.practiceService.reviewAt(index);
  }

  backToSelection() {
    this.practiceService.backToSelection();
  }

  getUnansweredQuestionIndex(): number {
    let index = 0;
    for (const question of this.currentPractice.questions) {
      if (!question.selected_answer) {
        break;
      }
      index++;
    }
    return index;
  }

  buildChartData() {
    this.buildChartForFirstTimeData();
    this.buildChartForLatestData();
  }

  buildChartForLatestData(){
    const self = this;
    if (!this.currentPractice.questions || this.currentPractice.questions.length === 0 || this.practiceService.isLoading) {
      setTimeout(function () {
        self.buildChartForLatestData();
      }, 300);
      return;
    }

    // Build Doughnut Chart - Correctness
    let correct = 0, incorrect = 0;
    let averageCorrect = 0, averageIncorrect = 0;
    for (const question of this.currentPractice.questions) {
      correct += (question.isCorrect() ? 1 : 0);
      incorrect += (question.isIncorrect() ? 1 : 0);
      averageCorrect += (question.isCorrect() ? question.question_time : 0);
      averageIncorrect += (question.isIncorrect() ? question.question_time : 0);
    }
    const notTry = this.currentPractice.questions.length - correct - incorrect;
    this.doughnutData.datasets[0].data = [correct, incorrect, notTry];

    // Build Bar Chart - Time Average
    const averageAll = (correct + incorrect > 0) ? (averageCorrect + averageIncorrect) / (correct + incorrect) : 0;
    averageCorrect = correct > 0 ? averageCorrect / correct : averageCorrect;
    averageIncorrect = incorrect > 0 ? averageIncorrect / incorrect : averageIncorrect;
    this.barData.datasets[0].data = [averageAll, ...this.barData.datasets[0].data];
    this.barData.datasets[1].data = [averageCorrect, ...this.barData.datasets[1].data];
    this.barData.datasets[2].data = [averageIncorrect, ...this.barData.datasets[2].data];
  }

  buildChartForFirstTimeData(){
    const self = this;
    if (!this.currentPractice.questions || this.currentPractice.questions.length === 0 || this.practiceService.isLoading) {
      setTimeout(function () {
        self.buildChartForFirstTimeData();
      }, 300);
      return;
    }

    // Build Doughnut Chart - Correctness
    let correct = 0, incorrect = 0;
    let averageCorrect = 0, averageIncorrect = 0;
    for (const question of this.currentPractice.questions) {
      const isCorrect = question.first ? question.first.answer === question.correct_answer : question.isCorrect();
      const isIncorrect = question.first ? (question.first.answer && question.first.answer !== question.correct_answer) : question.isIncorrect();
      const questionTime = question.first ? question.first.time : question.question_time;

      correct += (isCorrect ? 1 : 0);
      incorrect += (isIncorrect ? 1 : 0);
      averageCorrect += (isCorrect ? questionTime : 0);
      averageIncorrect += (isIncorrect ? questionTime : 0);
    }
    const notTry = this.currentPractice.questions.length - correct - incorrect;
    this.doughnutData.datasets[1].data = [correct, incorrect, notTry];

    // Build Bar Chart - Time Average
    const averageAll = (correct + incorrect > 0) ? (averageCorrect + averageIncorrect) / (correct + incorrect) : 0;
    averageCorrect = correct > 0 ? averageCorrect / correct : averageCorrect;
    averageIncorrect = incorrect > 0 ? averageIncorrect / incorrect : averageIncorrect;
    this.barData.datasets[0].data = [averageAll];
    this.barData.datasets[1].data = [averageCorrect];
    this.barData.datasets[2].data = [averageIncorrect];
  }

  ngOnDestroy() {

  }
}


@Pipe({name: 'filter'})
export class FilterPipe implements PipeTransform {
  transform(practices: GMATPractice[], term: string): GMATPractice[] {
    const matched: GMATPractice[] = [];
    for (const practice of practices) {
      if (practice.practiceName.indexOf(term) >= 0) {
        matched.push(practice);
      }
    }
    return matched;
  }
}

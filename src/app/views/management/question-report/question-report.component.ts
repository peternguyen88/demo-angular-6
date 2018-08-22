import {Component} from '@angular/core';
import {WebService} from '../../../shared/services/web-service';
import {UserQuestionReport} from '../../../models/firebase.model';
import {MessageService} from 'primeng/api';

@Component({
  templateUrl: 'question-report.component.html'
})
export class QuestionReportComponent {
  reports: UserQuestionReport[] = [];

  constructor(private webService: WebService, private toast: MessageService) {
    const subscription = this.webService.getUserQuestionReports().snapshotChanges().subscribe(userReports => {
      subscription.unsubscribe();

      userReports.forEach(snapshot => {
        snapshot.payload.forEach(e => {
          const report: UserQuestionReport = e.val();
          report.question_set = snapshot.key;
          report.firebase_key = e.key;
          this.reports.push(report);
          return false;
        });
      });
    });
  }

  saveReport(report: UserQuestionReport) {
    this.webService.refToQuestionReport(report).update(report).then(error => {
      if (!error) {
        this.toast.add({severity: 'success', summary: 'Updated!', detail: 'The report has been updated.'});
      }
    });
  }

  deleteReport(report: UserQuestionReport) {
    this.webService.refToQuestionReport(report).remove().then(error => {
      if (!error) {
        this.toast.add({severity: 'error', summary: 'Deleted!', detail: 'The report has been deleted.'});
      }
    });
    const index = this.reports.indexOf(report);
    if (index < this.reports.length - 1) {
      this.reports = [...this.reports.slice(0, index), ...this.reports.slice(index + 1)];
    } else {
      this.reports = [...this.reports.slice(0, index)];
    }
  }
}

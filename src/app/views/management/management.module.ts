import {NgModule} from '@angular/core';
import {GmatCommonModule} from '../../shared/modules/gmat-common-module';
import {RouterModule, Routes} from '@angular/router';
import {ManagementComponent} from './management.component';
import {TableModule} from 'primeng/table';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {QuestionReportComponent} from './question-report/question-report.component';

const routes: Routes = [
  {path: '', redirectTo: 'users', pathMatch: 'full', },
  {path: 'users', component: ManagementComponent, data: {title: 'Admin Console'}},
  {path: 'question-reports', component: QuestionReportComponent, data: {title: 'Question Report'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes), GmatCommonModule, TableModule, CommonModule, FormsModule, ToastModule],
  declarations: [ManagementComponent, QuestionReportComponent],
  providers: [MessageService]
})
export class ManagementModule {
}

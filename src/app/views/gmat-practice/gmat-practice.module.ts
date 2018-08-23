/**
 * Create a separate Module for GMAT Practice
 */
import {NgModule} from '@angular/core';
import {GMATPracticeRoutingModule} from './gmat-practice-routing.module';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {GMATPracticeComponent} from './gmat-practice.component';
import {PracticeService} from './services/gmat-practice.service';
import {GMATPracticeListComponent} from './gmat-practice-list/gmat-practice-list.component';
import {FilterPipe, GMATPracticeSummaryComponent} from './gmat-practice-summary/gmat-practice-summary.component';
import {PracticeScreenComponent} from './practice-screen/practice-screen.component';
import {GmatCommonModule} from '../../shared/modules/gmat-common-module';
import {HttpClient} from '@angular/common/http';
import {TableModule} from 'primeng/table';
import {AlertModule, CollapseModule, ModalModule, PopoverModule, TooltipModule} from 'ngx-bootstrap';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {ChartModule} from 'primeng/chart';

@NgModule({
  imports: [CommonModule, GmatCommonModule, GMATPracticeRoutingModule, FormsModule, TableModule, AlertModule.forRoot(), ToastModule,
    CollapseModule.forRoot(), ChartModule, TooltipModule.forRoot(), PopoverModule.forRoot(), ModalModule.forRoot()],
  declarations: [GMATPracticeComponent, GMATPracticeListComponent,
    GMATPracticeSummaryComponent, PracticeScreenComponent, FilterPipe],
  providers: [PracticeService, HttpClient, MessageService]
})

export class GMATPracticeModule {
}

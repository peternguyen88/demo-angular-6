import {Component, OnInit} from '@angular/core';
import {PracticeService} from './services/gmat-practice.service';
import {Stage} from './data/Model';
import {ActivatedRoute} from '@angular/router';
import {PracticeData} from './data/practice-sets';
import {GMATPractice} from '../../models/gmat-practice';
import {WebService} from '../../shared/services/web-service';
import {Location} from '@angular/common';
import {MessageService} from 'primeng/api';

/**
 * Main Component for taking GMAT CAT
 */
@Component({
  templateUrl: 'gmat-practice.component.html'
})
export class GMATPracticeComponent implements OnInit {
  constructor(private route: ActivatedRoute, private location: Location,
              private practiceService: PracticeService, private webService: WebService,
              private toast: MessageService) {
  }

  isSelectStage(): boolean {
    return this.practiceService.stage === Stage.SELECT;
  }

  isSummaryStage(): boolean {
    return this.practiceService.stage === Stage.SUMMARY;
  }

  isPracticeStage(): boolean {
    return this.practiceService.stage === Stage.PRACTICE;
  }

  ngOnInit() {
    const section = this.route.snapshot.paramMap.get('section');
    const setID = this.route.snapshot.paramMap.get('setID');
    const questionNoReview = this.route.snapshot.paramMap.get('questionNoReview');
    const questionNoPractice = this.route.snapshot.paramMap.get('questionNoPractice');
    const practiceSets: GMATPractice[] = PracticeData.resolvePracticeSetsBySection(section);

    this.practiceService.stage = Stage.SELECT;  // Will be changed later if match condition
    if (setID) {
      const matchedSets: GMATPractice[] = practiceSets.filter(p => p.practiceName === setID);
      if (matchedSets.length) {
        // Check if is premium data
        if (PracticeData.isAuthenticationNeeded(matchedSets[0].practiceName) && !this.webService.isLogin()) {
          // Subscribe to login event
          const loginSubscription = this.webService.getRealLoginEvent().subscribe(() => {
            loginSubscription.unsubscribe();
              if (PracticeData.isStudentAccessOnly(matchedSets[0].practiceName) && !this.webService.isStudent()) {
                this.toast.add({severity: 'error', summary: 'Access Denied!', detail: 'This resource is only for Premium Members!', life: 10000});
                return;
              }
              this.openPracticeScreen(matchedSets[0], questionNoPractice, questionNoReview);
          });
          // Auto unsubscribe after 1 minutes
          setTimeout(function () {
            loginSubscription.unsubscribe();
          }, 60000);
          // Kick user back to the right place
          const currentURL = this.location.path(true);
          this.location.go(currentURL.substring(0, currentURL.indexOf('/' + setID)));
          return;
        }

        this.openPracticeScreen(matchedSets[0], questionNoPractice, questionNoReview);
      }
    }
  }

  openPracticeScreen(practiceSet: GMATPractice, questionNoPractice: string, questionNoReview: string) {
    this.practiceService.selectPracticeSet(practiceSet);
    this.practiceService.stage = Stage.SUMMARY;

    if (questionNoReview) {
      this.practiceService.reviewAt(parseInt(questionNoReview, 10) - 1);
    }
    if (questionNoPractice) {
      this.practiceService.startAt(parseInt(questionNoPractice, 10) - 1);
    }
  }
}

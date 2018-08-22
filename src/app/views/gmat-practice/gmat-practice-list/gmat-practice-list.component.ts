/**
 * Summary Screen - Showing a list of test for user to choose
 */
import {Component, OnInit} from '@angular/core';
import {PracticeService} from '../services/gmat-practice.service';
import {PracticeData} from '../data/practice-sets';
import {GMATPractice} from '../../../models/gmat-practice';
import {ConfirmMessage, ConfirmMessageConstant} from '../../../models/confirm-message';
import {WebService} from '../../../shared/services/web-service';
import {ActivatedRoute, Event, NavigationEnd, Router} from '@angular/router';
import {Stage} from '../data/Model';

@Component({
  moduleId: module.id,
  selector: 'app-gmat-practice-list',
  templateUrl: 'gmat-practice-list.component.html'
})
export class GMATPracticeListComponent implements OnInit {
  practiceSets: GMATPractice[];
  popupMessage: ConfirmMessage;
  section: string;

  constructor(private router: Router, private route: ActivatedRoute, private practiceService: PracticeService, private webService: WebService) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.section = this.route.snapshot.paramMap.get('section');
        this.practiceSets = PracticeData.resolvePracticeSetsBySection(this.section);
        if (this.practiceService.stage === Stage.SUMMARY) {
          this.practiceService.backToSelection();
        }
      }
    });
  }

  selectPracticeSet(practice: GMATPractice) {
    // Have to login to use practice set
    if (PracticeData.isAuthenticationNeeded(practice.practiceName)) {
      if (!this.webService.isLogin()) {
        this.popupMessage = ConfirmMessageConstant.PLEASE_LOGIN_TO_CONTINUE;
        this.popupMessage.accept = () => {
          this.webService.login();
        };
        return;
      }
    }

    if (PracticeData.isStudentAccessOnly(practice.practiceName)) {
      if (!this.webService.isStudent()) {
        this.popupMessage = ConfirmMessageConstant.STUDENT_ACCESS_ONLY;
        return;
      }
    }

    // Continue selecting practice
    this.practiceService.selectPracticeSet(practice);
  }

  ngOnInit(): void {
    this.section = this.route.snapshot.paramMap.get('section');
    this.practiceSets = PracticeData.resolvePracticeSetsBySection(this.section);
  }

  isSpecialRender() {
    return this.isComprehensiveRender();
  }

  isComprehensiveRender() {
    return this.section === 'comprehensive';
  }
}

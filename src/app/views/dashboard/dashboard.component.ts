import {Component} from '@angular/core';
import {WebService} from '../../shared/services/web-service';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent {
  constructor(public webService: WebService) {

  }

  public dataCorrection(){
    this.webService.dataCorrection();
  }
}

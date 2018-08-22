import {Injectable} from '@angular/core';
import {WebService} from '../../shared/services/web-service';

@Injectable()
export class PracticeService {
  constructor(private webService: WebService) {
  }
}

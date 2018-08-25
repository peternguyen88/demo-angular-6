import {WebService} from '../services/web-service';
import {PracticeResult} from '../../models/test-result';

export class SyncUtils {
  public static synchronizeDataToServer(webService: WebService) {
    if (localStorage.getItem('unsynchronized')) {
      const unsyncData = JSON.parse(localStorage.getItem('unsynchronized')) as string[];
      for (const setID of unsyncData) {
        const localResults = JSON.parse(localStorage.getItem(setID)) as PracticeResult;
        webService.processRetrievePerformanceFromServer(setID, 0, (serverResults) => {
          console.log(localResults);
          console.log(serverResults);
          PracticeResult.mergeArrayResultToLocalQuestions(localResults.questions, serverResults);
          localStorage.setItem(setID, JSON.stringify(localResults));
          console.log(localResults);
          webService.processSavePerformanceToServer(setID, new Date().getTime(), localResults.questions, []);
        }, () => {
        });
      }
    }
  }
}

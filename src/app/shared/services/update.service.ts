import { Injectable } from '@angular/core';

import { SwUpdate } from '@angular/service-worker';

@Injectable()
export class UpdateService {
  constructor(private swUpdate: SwUpdate) {
  }

  public checkForUpdate(){
    this.swUpdate.available.subscribe(() => {
      // an update is available, add some logic here.
      window.location.reload();
    });
    this.swUpdate.checkForUpdate().then();
  }
}

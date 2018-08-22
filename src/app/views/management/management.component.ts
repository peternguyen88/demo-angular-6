import {Component, OnInit} from '@angular/core';
import {WebService} from '../../shared/services/web-service';
import {FirebaseUser} from '../../models/firebase.model';
import {MessageService} from 'primeng/api';

@Component({
  templateUrl: 'management.component.html'
})
export class ManagementComponent implements OnInit {
  users: FirebaseUser[];

  constructor(private webService: WebService, private toast: MessageService) {
    const subscription = this.webService.getUserList().valueChanges().subscribe(e => {
      subscription.unsubscribe();
      this.users = e;

      this.users.forEach(u => {
        u.last_login_time = new Date(u.last_login).getTime();
      });

      this.users.sort((a, b) =>
        b.last_login_time - a.last_login_time
      );
    });
  }

  saveUser(user: FirebaseUser) {
    this.webService.updateUser(user).then(error => {
      if (error) { // Error when update
        this.toast.add({severity: 'error', summary: 'Update Error!', detail: 'Error when updating. Check console for detail.'});
        console.log(error);
      } else { // Successfully Updated
        this.toast.add({
          severity: 'success',
          summary: 'Update Successfully!',
          detail: 'User ' + user.name + ' has been successfully updated.'
        });
      }
    });
  }

  ngOnInit(): void {
  }
}

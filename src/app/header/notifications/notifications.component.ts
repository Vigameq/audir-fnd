import { Component } from '@angular/core';
import { AudirService } from 'src/services/audir-services.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  notifications : any[] =[];

  constructor(private audirService: AudirService){

  }

  ngOnInit(){
    this.getNotifications();
  }

  getNotifications(){
    const email = 'user1@gmail.com';
    this.audirService.getNotifications(email).subscribe(response => {
      this.notifications = response.notifications;
    })
  }
}

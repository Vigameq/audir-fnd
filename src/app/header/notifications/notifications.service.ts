import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NotificationItem } from './notifications.component';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private refreshNotficationCountSubject = new Subject<void>();
  refreshNotificationCount$ = this.refreshNotficationCountSubject.asObservable();
  constructor(private http: HttpClient,) { }

  getNotifications(email: string): Observable<NotificationItem[]> {
    const payload = {
      'email': email
    };
    return this.http.post<any>('/audire/api/getNotifications', payload);
  }
  updateNotifications(email: string, notificationId: number): any {
    const payload = {
      'email': email,
      'notification_id': [notificationId]
    };
    return this.http.post<any>('/audire/api/updateNotifications', payload);
  }

  triggerRefresh() {
    this.refreshNotficationCountSubject.next();
  }
}

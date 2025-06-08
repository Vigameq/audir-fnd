import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NotificationItem } from './notifications.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


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
    return this.http.post<any>(`${environment.apiUrl}/api/getNotifications`, payload);
  }
  updateNotifications(email: string, notificationId: number): any {
    const payload = {
      'email': email,
      'notification_id': [notificationId]
    };
    return this.http.post<any>(`${environment.apiUrl}/api/updateNotifications`, payload);
  }

  triggerRefresh() {
    this.refreshNotficationCountSubject.next();
  }
}

import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NotificationsService } from './notifications.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
export interface NotificationItem {
  id: number;
  message: string;
  is_read: boolean;
  created_at: string;
}
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  providers: [DatePipe],
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  @ViewChild('notificationItem', { static: false }) notificationItem!: ElementRef;
  notifications: NotificationItem[] = [];
  unreadCount = 0;
  showNotifications = false;
  email!: string;
  private subscription!: Subscription;

  constructor(private router: Router, private datePipe: DatePipe, private notificationService: NotificationsService) {
    this.email = localStorage.getItem('user')?.toString() || '';
    this.loadNotifications();
  }

  ngOnInit(): void {
    this.subscription = this.notificationService.refreshNotificationCount$.subscribe(() => {
      this.loadNotifications();
    });
  }

  loadNotifications(): void {
    this.notificationService.getNotifications(this.email).subscribe((data: any) => {
      this.notifications = data.notifications;
      this.unreadCount = this.notifications.filter(notification => !notification.is_read).length;
    }, (error: any) => {
      console.error('Error loading notifications', error);
    });
  }

  onNotificationIconClick(): void {
    this.showNotifications = !this.showNotifications;
  }

  getNotificationTime(messageTimestamp: string): any {
    const now = new Date();
    const timeStamp = new Date(messageTimestamp);
    const seconds = Math.floor((now.getTime() - timeStamp.getTime()) / 1000);
    if (seconds < 60) {
      return 'Just now';
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)} min ago`;
    } else if (seconds < 86400) {
      return `${Math.floor(seconds / 3600)} hr ago`;
    }
    return (this.datePipe.transform(timeStamp.toLocaleDateString(), 'dd MMM', 'UTC'));
  }

  onNotificationRead(notification: NotificationItem) {
    if (!notification.is_read) {
      this.notificationService.updateNotifications(this.email, notification.id).subscribe((message: any) => {
        console.log(message.message)
      }, (error: any) => {
        console.error(error);
      });
    }
    this.navigateToAuditPerform();
    this.loadNotifications();
    //     event.stopPropagation();
  }

  public navigateToAuditPerform() {
    localStorage.setItem('header', 'Audit Perform');
    this.router.navigate(['/auditPerform']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const notificationItemElement = this.notificationItem?.nativeElement;
    if (notificationItemElement && !notificationItemElement.contains(event.target as Node)) {
      this.showNotifications = false;
    }
  }
}

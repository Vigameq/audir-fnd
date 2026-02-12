import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { animate, style, transition, trigger } from '@angular/animations';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import { LoaderService } from './shared/loader/services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('animateView', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AppComponent {
  title = 'audir-fnd';
  receivedHeaderName: any = localStorage.getItem('header') ? localStorage.getItem('header') : '';
  private readonly routeHeaderMap: Record<string, string> = {
    dashboard: 'Dashboard',
    auditPlan: 'Audit Plan',
    auditPerform: 'Audit Perform',
    auditManage: 'Audit Manage',
    findingsManagement: 'Findings Management',
    templates: 'Templates',
    reports: 'Reports',
    userManagement: 'User Management'
  };

  constructor(private authService: AuthService, private router: Router, private loaderService: LoaderService) { }
  isAuthenticated(): boolean {
    return (this.authService.isAuthenticated() === 'success');
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loaderService.show();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        if (event instanceof NavigationEnd) {
          const path = event.urlAfterRedirects.split('?')[0].split('/')[1];
          const header = this.routeHeaderMap[path] || '';
          this.receivedHeaderName = header;
          localStorage.setItem('header', header);
        }
        this.loaderService.hide();
      }
    });
  }

  getHeaderName(data: string) {
    this.receivedHeaderName = data;
  }
}

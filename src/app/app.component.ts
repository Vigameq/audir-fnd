import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { animate, style, transition, trigger } from '@angular/animations';

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

  constructor(private authService: AuthService) { }
  isAuthenticated(): boolean {
    return (this.authService.isAuthenticated() === 'success');
  }
  getHeaderName(data: string) {
    this.receivedHeaderName = data;
  }

}

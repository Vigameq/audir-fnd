import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'audir-fnd';
  receivedHeaderName: string = 'Dashboard';

  constructor(private authService: AuthService) { }
  isAuthenticated(): boolean {
    return (this.authService.isAuthenticated() === 'success');
  }
  getHeaderName(data: string) {
    this.receivedHeaderName = data;
  }

}

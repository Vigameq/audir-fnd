import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Output, EventEmitter } from '@angular/core';
import { AudirService } from 'src/services/audir-services.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  constructor(private authService: AuthService, private router: Router, private audirService: AudirService) {
    localStorage.setItem('login_success', '');
  }

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe(
      (response: any) => {
        if (response) {
          localStorage.setItem('login_success', 'success');
          localStorage.setItem("userDetails", JSON.stringify(response));
          localStorage.setItem('user', response.eMail);
          localStorage.setItem('header', 'Dashboard');
          this.router.navigate(['/dashboard']);
          //this.audirService.showSuccess('Login Successfull');
        } else {
          this.audirService.showError('Invalid credentials');
        }
      }, (error: any) => {
        if (error.error.status === 500) {
          this.audirService.showError(error.error.statusText);
        } else {
          this.audirService.showError(error.error.message);
        }
        console.error(error);
      }
    );
  }
}

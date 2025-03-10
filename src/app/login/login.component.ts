import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  constructor(private authService: AuthService, private router: Router) {
    localStorage.setItem('login_success', '');
  }



  onSubmit() {
    this.authService.login(this.email, this.password).subscribe(
      (response: any) => {
        if (response) {
          localStorage.setItem('login_success', 'success');
          localStorage.setItem('user', response.eMail);
          localStorage.setItem('header', 'Audit Plan');
          this.router.navigate(['/auditPlan']);
        } else {
          this.errorMessage = 'Invalid login credentials';
        }
      },
      (error: any) => {
        this.errorMessage = 'An error occurred. Please try again.';
        console.error(error);
      }
    );
  }
}

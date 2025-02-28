import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = '/audire/api/userLogin'; // API endpoint
  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const credentials: any = { eMail: email, password: password }
    return this.http.post(this.apiUrl, credentials);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): any {
    return localStorage.getItem('login_success');
  }
}


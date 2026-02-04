import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/userLogin`;
  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const credentials: any = { eMail: email, password: password }
    return this.http.post(this.apiUrl, credentials);
  }



  getCurrentRole(): string {
    const details = localStorage.getItem('userDetails');
    if (!details) {
      return '';
    }
    try {
      const parsed = JSON.parse(details);
      return parsed?.role || '';
    } catch {
      return '';
    }
  }
  logout(): void {
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): any {
    return localStorage.getItem('login_success');
  }
}


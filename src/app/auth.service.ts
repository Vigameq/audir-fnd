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
      const rawRole = (parsed?.role || '').toString().trim().toLowerCase();
      const roleMap: Record<string, string> = {
        'admin': 'Admin',
        'lead auditor': 'Lead Auditor',
        'manager': 'Manager',
        'auditor': 'Auditor',
        'auditee': 'Auditee'
      };
      return roleMap[rawRole] || '';
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

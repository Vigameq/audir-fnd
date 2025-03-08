import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AudirService {
  constructor(private http: HttpClient) { }

  getPlanItems(email: string): Observable<any> {
    const emailId = { "eMail": email }
    return this.http.post('/audire/api/planItems', emailId);
  }

  createAuditPlan(auditPlan: any) {
    return this.http.post('/audire/api/planAudit', auditPlan);
  }
}

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

  downloadTemplate(): Observable<ArrayBuffer> {
    return this.http.get<any>('/audire/api/downloadAuditPlan', {
      responseType: 'arraybuffer' as 'json'
    });
  }

  uploadPlan(email: any, uploadTemplate: any): any {
    return this.http.post<any>('/audire/api/uploadTemplate', uploadTemplate, email);
  }
  validatePlan(formData: FormData): any {
    return this.http.post<any>('/audire/api/validateAuditPlan', formData);
  }
  createPlans(formData: FormData): any {
    return this.http.post<any>('/audire/api/bulkAuditCreate', formData);
  }

  getData(): any {
    return this.http.get('/assets/json/data.json');
  }
}

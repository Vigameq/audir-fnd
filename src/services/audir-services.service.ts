import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AudirService {
  constructor(private http: HttpClient, private toastr: ToastrService) { }

  getPlanItems(email: string): Observable<any> {
    const emailId = { "eMail": email };
    return this.http.post('/audire/api/planItems', emailId);
  }

  createAuditPlan(auditPlan: any) {
    return this.http.post('/audire/api/planAudit', auditPlan);
  }

  getAuditPlan(audit_id:any){
    return this.http.post('/audire/api/getAuditPlan', audit_id);
  }

  getTemplate(template_id: any) {
    const templateDetails = { "template_id": template_id };
    return this.http.post('/audire/api/getTemplate', templateDetails);
  }

  getAllPlans(email: any, date: any) {
    const emailDateDetails = {
      "eMail": email,
      "start_date_filter": {
        "from": date,
        "to": date
      },
      "status_filter": ["completed", "created"]
    };
    return this.http.post('/audire/api/listAudits', emailDateDetails);
  }

  updateAuditPlan(updatedAuditDetails:any) {
    return this.http.post('/audire/api/updateAuditPlan', updatedAuditDetails);
  }

  downloadPlanTemplate(): Observable<ArrayBuffer> {
    return this.http.get<any>('/audire/api/downloadAuditPlan', {
      responseType: 'arraybuffer' as 'json'
    });
  }

  downloadTemplate(): Observable<ArrayBuffer> {
    return this.http.get<any>('/audire/api/downloadAuditTemplate', {
      responseType: 'arraybuffer' as 'json'
    });
  }

  uploadTemplate(formData: FormData): any {
    return this.http.post<any>('/audire/api/uploadTemplate', formData);
  }
  validatePlan(formData: FormData): any {
    return this.http.post<any>('/audire/api/validateAuditPlan', formData);
  }
  createPlans(formData: FormData): any {
    return this.http.post<any>('/audire/api/bulkAuditCreate', formData);
  }

  /* services for Audit perform */

  getAuditLists(payload:any){
    return this.http.post<any>('/audire/api/listAudits', payload);
  }

  getAuditQuestions(payload:any){
    return this.http.post<any>('/audire/api/getAuditQuestions', payload);
  }


  getData(): any {
    return this.http.get('/assets/json/data.json');
  }

  getNotifications(email: string): Observable<any> {
    const emailId = { "email": email };
    return this.http.post('/audire/api/getNotifications', emailId);
  }

  updateNotifications(id: number[]): Observable<any> {    
    const payload ={
      "email": "user1@gmail.com",
      "notification_id": [id]
  }
    return this.http.post('/audire/api/updateNotifications', payload);
  }

  showSuccess(message: string) {
    this.toastr.success(message, 'Success', {
      timeOut: 2000,
      positionClass: 'toast-bottom-right',
      progressBar: true,
      progressAnimation: 'decreasing'
    });
  }

  showError(message: string) {
    this.toastr.error(message, 'Error', {
      timeOut: 2000,
      positionClass: 'toast-bottom-right',
      progressBar: true,
      progressAnimation: 'decreasing'
    });
  }

  showWarning(message: string) {
    this.toastr.warning(message, 'Warning', {
      timeOut: 2000,
      positionClass: 'toast-bottom-right',
      progressBar: true,
      progressAnimation: 'decreasing'
    });
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AudirService {
  constructor(private http: HttpClient, private toastr: ToastrService) { }

  getPlanItems(email: string): Observable<any> {
    const emailId = { "eMail": email };
    return this.http.post(`${environment.apiUrl}/api/planItems`, emailId);
  }

  createAuditPlan(auditPlan: any) {
    return this.http.post(`${environment.apiUrl}/api/planAudit`, auditPlan);
  }

  getAuditPlan(audit_id: any) {
    return this.http.post(`${environment.apiUrl}/api/getAuditPlan`, audit_id);
  }

  getTemplate(template_id: any) {
    const templateDetails = { "template_id": template_id };
    return this.http.post(`${environment.apiUrl}/api/getTemplate`, templateDetails);
  }

  getAllChildPlans(email: any, date: any) {
    const emailDateDetails = {
      "eMail": email,
      "start_date_filter": {
        "from": date,
        "to": date
      },
      "status_filter": ["completed", "created", "lead_auditor"]
    };
    return this.http.post(`${environment.apiUrl}/api/listChildAudits`, emailDateDetails);
  }

  getQuestionData(payload: any) {
    return this.http.post(`${environment.apiUrl}/api/getQuestionData`, payload);
  }

  getNCQuestionData(payload: any) {
    return this.http.post(`${environment.apiUrl}/api/getNCQuestionData`, payload);
  }

  saveAuditFinding(payload: any) {
    return this.http.post(`${environment.apiUrl}/api/saveAuditFinding`, payload);
  }

  saveAuditeeResponse(payload: any) {
    return this.http.post(`${environment.apiUrl}/api/saveAuditeeResponse`, payload);
  }

  saveAuditorNotes(payload: any) {
    return this.http.post(`${environment.apiUrl}/api/saveAuditorNotes`, payload);
  }

  saveCorrectionsResponse(payload: any) {
    return this.http.post(`${environment.apiUrl}/api/saveNCCorrectionData`, payload);
  }

  saveRootCauseResponse(payload: any) {
    return this.http.post(`${environment.apiUrl}/api/saveNCRootCauseData`, payload);
  }

  savesCorrectiveActionPlanResponse(payload: any) {
    return this.http.post(`${environment.apiUrl}/api/saveNCCorrectiveActionPlanData`, payload);
  }

  updateAuditPlan(updatedAuditDetails: any) {
    return this.http.post(`${environment.apiUrl}/api/updateAuditPlan`, updatedAuditDetails);
  }

  getAuditCompletionPercentage(audit_id: any) {
    return this.http.post(`${environment.apiUrl}/api/getAuditCompletionPercent`, audit_id);
  }

  getEvidence(audit_id: any, evidenceFileName: any) {
    return this.http.get<any>(`${environment.apiUrl}/api/questionDataFile/` + audit_id + '/' + evidenceFileName, {
      responseType: 'arraybuffer' as 'json'
    });
  }

  getNCEvidence(audit_id: any, evidenceFileName: any, responseTYpe: any) {
    return this.http.get<any>(`${environment.apiUrl}/api/questionNCDataFile/` + audit_id + '/' + responseTYpe + '/' + evidenceFileName, {
      responseType: 'arraybuffer' as 'json'
    });
  }

  downloadPlanTemplate(): Observable<ArrayBuffer> {
    return this.http.get<any>(`${environment.apiUrl}/api/downloadAuditPlan`, {
      responseType: 'arraybuffer' as 'json'
    });
  }

  downloadTemplate(): Observable<ArrayBuffer> {
    return this.http.get<any>(`${environment.apiUrl}/api/downloadAuditTemplate`, {
      responseType: 'arraybuffer' as 'json'
    });
  }

  uploadTemplate(formData: FormData): any {
    return this.http.post<any>(`${environment.apiUrl}/api/uploadTemplate`, formData);
  }
  validatePlan(formData: FormData): any {
    return this.http.post<any>(`${environment.apiUrl}/api/validateAuditPlan`, formData);
  }
  createPlans(formData: FormData): any {
    return this.http.post<any>(`${environment.apiUrl}/api/bulkAuditCreate`, formData);
  }

  /* services for Audit perform */

  getAuditLists(payload: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/listAudits`, payload);
  }

  getAuditQuestions(payload: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/getAuditQuestions`, payload);
  }

  getNCAuditQuestions(payload: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/getNCAuditQuestions`, payload);
  }

  submitAudit(payload: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/submitAudit`, payload);
  }

  submitNCAudit(payload: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/submitNC`, payload);
  }

  /* services for audit findings */

  getNCAuditLists(payload: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/listNCAudits`, payload);
  }

  getData(): any {
    return this.http.get('/assets/json/data.json');
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

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

  getAuditPlan(audit_id: any) {
    return this.http.post('/audire/api/getAuditPlan', audit_id);
  }

  getTemplate(template_id: any) {
    const templateDetails = { "template_id": template_id };
    return this.http.post('/audire/api/getTemplate', templateDetails);
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
    return this.http.post('/audire/api/listChildAudits', emailDateDetails);
  }

  getQuestionData(payload: any) {
    return this.http.post('/audire/api/getQuestionData', payload);
  }

  getNCQuestionData(payload: any) {
    return this.http.post('/audire/api/getNCQuestionData', payload);
  }

  saveAuditFinding(payload: any) {
    return this.http.post('/audire/api/saveAuditFinding', payload);
  }

  saveAuditeeResponse(payload: any) {
    return this.http.post('/audire/api/saveAuditeeResponse', payload);
  }

  saveAuditorNotes(payload: any) {
    return this.http.post('/audire/api/saveAuditorNotes', payload);
  }

  saveCorrectionsResponse(payload: any) {
    return this.http.post('/audire/api/saveNCCorrectionData', payload);
  }

  saveRootCauseResponse(payload: any) {
    return this.http.post('/audire/api/saveNCRootCauseData', payload);
  }

  savesCorrectiveActionPlanResponse(payload: any) {
    return this.http.post('/audire/api/saveNCCorrectiveActionPlanData', payload);
  }

  updateAuditPlan(updatedAuditDetails: any) {
    return this.http.post('/audire/api/updateAuditPlan', updatedAuditDetails);
  }

  getAuditCompletionPercentage(audit_id: any) {
    return this.http.post('/audire/api/getAuditCompletionPercent', audit_id);
  }

  getEvidence(audit_id: any, evidenceFileName: any) {
    return this.http.get<any>('/audire/api/questionDataFile/' + audit_id + '/' + evidenceFileName, {
      responseType: 'arraybuffer' as 'json'
    });
  }

  getNCEvidence(audit_id: any, evidenceFileName: any, responseTYpe: any) {
    return this.http.get<any>('/audire/api/questionNCDataFile/' + audit_id + '/' + responseTYpe + '/' + evidenceFileName, {
      responseType: 'arraybuffer' as 'json'
    });
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

  getAuditLists(payload: any) {
    return this.http.post<any>('/audire/api/listAudits', payload);
  }

  getAuditQuestions(payload: any) {
    return this.http.post<any>('/audire/api/getAuditQuestions', payload);
  }

  getNCAuditQuestions(payload: any) {
    return this.http.post<any>('/audire/api/getNCAuditQuestions', payload);
  }

  submitAudit(payload: any) {
    return this.http.post<any>('/audire/api/submitAudit', payload);
  }

  /* services for audit findings */

  getNCAuditLists(payload: any) {
    return this.http.post<any>('/audire/api/listNCAudits', payload);
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

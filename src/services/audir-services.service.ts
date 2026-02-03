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

  apiBaseUrl(): string {
    return environment.apiUrl;
  }

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

  createNewUser(userDetails: FormData): any {
    return this.http.post(`${environment.apiUrl}/api/createUser`, userDetails);
  }

  updateUser(userDetails: any): any {
    return this.http.post(`${environment.apiUrl}/api/updateUser`, userDetails);
  }

  updatePassword(userDetails: any): any {
    return this.http.post(`${environment.apiUrl}/api/updatePassword`, userDetails);
  }

  getTemplate(template_id: any) {
    const templateDetails = { "template_id": template_id };
    return this.http.post(`${environment.apiUrl}/api/getTemplate`, templateDetails);
  }

  updateTemplateQuestions(payload: any) {
    return this.http.post(`${environment.apiUrl}/api/updateTemplateQuestions`, payload);
  }

  listUsers(payload: any) {
    return this.http.post(`${environment.apiUrl}/api/listUsers`, payload);
  }

  deleteUser(payload: any) {
    return this.http.post(`${environment.apiUrl}/api/deleteUser`, payload);
  }

  dashboardSummary(payload: any) {
    return this.http.post(`${environment.apiUrl}/api/dashboardSummary`, payload);
  }

  getAllChildPlans(email: any, date: any) {
    const emailDateDetails = {
      "eMail": email,
      "start_date_filter": {
        "from": date,
        "to": date
      },
      "status_filter": ["completed", "created","inprogress"]
    };
    return this.http.post(`${environment.apiUrl}/api/ListChildAuditsByUser`, emailDateDetails);
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

  submitNCQuestion(payload: any){
    return this.http.post(`${environment.apiUrl}/api/submitNCQuestion`, payload);
  }

  updateAuditPlan(updatedAuditDetails: any) {
    return this.http.post(`${environment.apiUrl}/api/updateAuditPlan`, updatedAuditDetails);
  }

  getAuditCompletionPercentage(audit_id: any) {
    return this.http.post(`${environment.apiUrl}/api/getAuditCompletionPercent`, audit_id);
  }

  getEvidence(audit_id: any, evidenceFileName: any) {
    const safeFileName = encodeURIComponent(evidenceFileName || '');
    const cacheBuster = `?t=${Date.now()}`;
    return this.http.get(`${environment.apiUrl}/api/questionDataFile/` + audit_id + '/' + safeFileName + cacheBuster, {
      observe: 'response',
      responseType: 'blob'
    });
  }

  getNCEvidence(audit_id: any, evidenceFileName: any, responseTYpe: any) {
    const safeFileName = encodeURIComponent(evidenceFileName || '');
    const cacheBuster = `?t=${Date.now()}`;
    return this.http.get(`${environment.apiUrl}/api/questionNCDataFile/` + audit_id + '/' + responseTYpe + '/' + safeFileName + cacheBuster, {
      observe: 'response',
      responseType: 'blob'
    });
  }

  downloadPlanTemplate(): Observable<Blob> {
    const cacheBuster = `?t=${Date.now()}`;
    return this.http.get(`${environment.apiUrl}/api/downloadAuditPlan${cacheBuster}`, {
      responseType: 'blob'
    });
  }

  downloadTemplate(): Observable<Blob> {
    const cacheBuster = `?t=${Date.now()}`;
    return this.http.get(`${environment.apiUrl}/api/downloadAuditTemplate${cacheBuster}`, {
      responseType: 'blob'
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
    return this.http.post<any>(`${environment.apiUrl}/api/ListRelativeAuditsByUser`, payload);
  }

  getAuditQuestions(payload: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/getAuditQuestions`, payload);
  }

  listAuditQuestionOverrides(payload: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/listAuditQuestionOverrides`, payload);
  }

  addAuditQuestion(payload: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/addAuditQuestion`, payload);
  }

  updateAuditQuestion(payload: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/updateAuditQuestion`, payload);
  }

  deleteAuditQuestion(payload: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/deleteAuditQuestion`, payload);
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
    return this.http.post<any>(`${environment.apiUrl}/api/listNCAuditsUser`, payload);
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
    this.toastr.warning(message, 'Alert', {
      timeOut: 2000,
      positionClass: 'toast-bottom-right',
      progressBar: true,
      progressAnimation: 'decreasing'
    });
  }
}

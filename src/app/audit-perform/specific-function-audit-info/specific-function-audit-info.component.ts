import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomiseAuditQuestionDialogComponent } from '../customise-audit-question-dialog/customise-audit-question-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AudirService } from 'src/services/audir-services.service';
import { Location } from "@angular/common";
import { SubmitConfirmationDialogComponent } from '../submit-confirmation-dialog/submit-confirmation-dialog.component';
import { catchError, forkJoin, of } from 'rxjs';
import { ApprovalRemarksDialogComponent } from 'src/app/findings-management/approval-remarks-dialog/approval-remarks-dialog.component';
@Component({
  selector: 'app-specific-function-audit-info',
  templateUrl: './specific-function-audit-info.component.html',
  styleUrls: ['./specific-function-audit-info.component.scss']
})
export class SpecificFunctionAuditInfoComponent {

  auditQuestions: { text: string; template: string; templateType: string; responded: boolean; answered: boolean; submitted: boolean; overrideId?: number; overrideAction?: string; originalText?: string; isCustom?: boolean }[] = [];
  baseAuditQuestions: { text: string; template: string; templateType: string; responded: boolean; answered: boolean; submitted: boolean }[] = [];
  auditQuestionOverrides: any[] = [];
  isAuditor = false;
  auditCompletionPercentage!: any;
  auditInfo: any;
  auditId: any;
  parentAuditID: any;
  currentUserEmail = '';
  auditInitiated = false;
  supportsAuditQuestionOverrides = true;
  pendingApprovalFindings: any[] = [];

  constructor(private dialog: MatDialog,
    private route: ActivatedRoute,
    private audirService: AudirService,
    private router: Router,
    private location: Location) {
    this.isAuditor = ((JSON.parse(localStorage.getItem('userDetails') as any))?.role === 'Auditor');
    this.currentUserEmail = localStorage.getItem('user')?.toString().toLowerCase() || '';
    this.route.paramMap.subscribe(params => {
      this.auditId = { "audit_id": params.get('id') };
      this.route.queryParams.subscribe(params => {
        this.parentAuditID = { "audit_id": params['parentAuditID'] };
      });
      this.getPlanAudit(this.auditId);
      this.getQuestions(this.auditId, this.parentAuditID);
    });
  }

  ngOnInit() {
  }

  getQuestions(auditId: any, parentAuditID: any) {
    const questionTemplates: any = {};
    const templateTypeByKey: Record<string, string> = {};

    const addTemplates = (templates: any, templateType: string) => {
      if (!templates) {
        return;
      }
      Object.keys(templates).forEach((key) => {
        questionTemplates[key] = templates[key];
        templateTypeByKey[key] = templateType;
      });
    };

    this.audirService.getAuditQuestions(parentAuditID).subscribe((auditQuestion: any) => {
      if (auditQuestion) {
        addTemplates(auditQuestion.questions?.function_template, 'function_template');
        addTemplates(auditQuestion.questions?.template, 'template');
        this.audirService.getAuditQuestions(auditId).subscribe((childQuestion: any) => {
          if (childQuestion) {
            addTemplates(childQuestion.questions?.function_template, 'function_template');
          }
          this.buildQuestions(questionTemplates, templateTypeByKey);
          if (this.supportsAuditQuestionOverrides) {
            this.loadQuestionOverrides();
          } else {
            this.auditQuestions = [...this.baseAuditQuestions];
            this.loadQuestionStatuses();
          }
        }, (error: any) => {
          console.error('Error for getting questions:', error);
        });
      }
    }, (error: any) => {
      console.error('Error for getting questions:', error);
    });
  }

  buildQuestions(questionTemplates: any, templateTypeByKey: Record<string, string>) {
    const templates = new Set();
    const questions: any[] = [];
    for (const key of Object.keys(questionTemplates || {})) {
      const normalizedKey = key.replace(/[\s_]/g, '').toLowerCase();
      if (!templates.has(normalizedKey)) {
        templates.add(normalizedKey);
        const templateType = templateTypeByKey[key] || 'function_template';
        const questionList = Array.isArray(questionTemplates[key]) ? questionTemplates[key] : [];
        questionList.forEach((question: any) => {
          questions.push({
            text: question,
            template: key,
            templateType: templateType,
            responded: false,
            answered: false,
            submitted: false
          });
        });
      }
    }
    this.baseAuditQuestions = questions;
    this.auditQuestions = [...questions];
  }

  loadQuestionStatuses() {
    if (!this.auditQuestions.length) {
      return;
    }
    const email = localStorage.getItem('user')?.toString() || '';
    const requests = this.auditQuestions.map((question) => {
      const payload = {
        audit_id: this.auditId.audit_id,
        template: question.template,
        template_type: question.templateType,
        question: question.text,
        email: email
      };
      return this.audirService.getQuestionData(payload).pipe(
        catchError(() => of(null))
      );
    });

    forkJoin(requests).subscribe((responses: any[]) => {
      responses.forEach((response, index) => {
        let submitted = this.isSubmittedFlag(response?.is_submitted) || this.hasAuditeeServerResponse(response);
        if (!submitted && !this.isAuditor) {
          submitted = this.getAuditeeSubmittedFlag(this.auditQuestions[index]);
        }
        let answered = this.hasResponseForRole(response);
        if (!answered && !this.isAuditor) {
          const draft = this.getAuditeeDraft(this.auditQuestions[index]);
          answered = (draft?.auditee_response || '').trim() !== '' || (draft?.link || '').trim() !== '';
        }
        this.auditQuestions[index].submitted = submitted;
        this.auditQuestions[index].answered = answered;
        this.auditQuestions[index].responded = answered;
      });
      this.updateCompletionPercentage();
      this.loadPendingApprovalFindings();
    }, (error: any) => {
      console.error('Error getting question responses:', error);
    });
  }

  refreshQuestionStatus(index: number) {
    const question = this.auditQuestions[index];
    if (!question) {
      return;
    }
    const payload = {
      audit_id: this.auditId.audit_id,
      template: question.template,
      template_type: question.templateType,
      question: question.text,
      email: localStorage.getItem('user')?.toString() || ''
    };
    this.audirService.getQuestionData(payload).subscribe((response: any) => {
      let submitted = this.isSubmittedFlag(response?.is_submitted) || this.hasAuditeeServerResponse(response);
      if (!submitted && !this.isAuditor) {
        submitted = this.getAuditeeSubmittedFlag(question);
      }
      let answered = this.hasResponseForRole(response);
      if (!answered && !this.isAuditor) {
        const draft = this.getAuditeeDraft(question);
        answered = (draft?.auditee_response || '').trim() !== '' || (draft?.link || '').trim() !== '';
      }
      question.submitted = submitted;
      question.answered = answered;
      question.responded = answered;
      this.updateCompletionPercentage();
      this.loadPendingApprovalFindings();
    }, (error: any) => {
      console.error('Error getting question data:', error);
    });
  }

  private normalizeFindingStatus(status: any): string {
    return (status || '').toString().trim().toLowerCase().replace(/\s+/g, '_');
  }

  private isNCFindingCategory(category: any): boolean {
    const value = (category || '').toString().trim().toLowerCase();
    return value === 'major non-conformance'
      || value === 'minor non-conformance'
      || value === 'major_non_conformance'
      || value === 'minor_non_conformance';
  }

  private isPendingApprovalStatus(status: any): boolean {
    const value = this.normalizeFindingStatus(status);
    return value === '' || value === 'created' || value === 'pending_approval' || value === 'pendingapproval';
  }

  private isQualifiedNcStatus(status: any): boolean {
    const value = this.normalizeFindingStatus(status);
    return value === 'approved'
      || value === 'approved_nc'
      || value === 'nc_inprogress'
      || value === 'inprogress'
      || value === 'in_progress'
      || value === 'completed'
      || value === 'nc_closed'
      || value === 'closed';
  }

  private isClosedNcStatus(status: any): boolean {
    const value = this.normalizeFindingStatus(status);
    return value === 'completed' || value === 'nc_closed' || value === 'closed';
  }

  isLeadAuditor(): boolean {
    if (!this.isAuditor) {
      return false;
    }
    const email = this.currentUserEmail;
    const lead = this.auditInfo?.lead_auditor;
    const leadEmail = (typeof lead === 'string' ? lead : lead?.email || '').toString().toLowerCase();
    if (leadEmail && leadEmail === email) {
      return true;
    }
    const auditors = Array.isArray(this.auditInfo?.auditors) ? this.auditInfo.auditors : [];
    const hasCurrent = auditors.some((auditor: any) => (auditor?.email || '').toString().toLowerCase() === email);
    if (!hasCurrent) {
      return false;
    }
    if (!leadEmail) {
      return true;
    }
    const leadName = (typeof lead === 'string' ? lead : lead?.name || '').toString().toLowerCase();
    return auditors.some((auditor: any) =>
      (auditor?.email || '').toString().toLowerCase() === email
      && (auditor?.name || '').toString().toLowerCase() === leadName
    );
  }

  loadPendingApprovalFindings() {
    if (!this.auditQuestions.length) {
      this.pendingApprovalFindings = [];
      return;
    }
    const email = localStorage.getItem('user')?.toString() || '';
    const requests = this.auditQuestions.map((question) => {
      const payload = {
        audit_id: this.auditId.audit_id,
        template: question.template,
        template_type: question.templateType,
        question: question.text,
        email: email
      };
      return this.audirService.getQuestionData(payload).pipe(catchError(() => of(null)));
    });

    forkJoin(requests).subscribe((responses: any[]) => {
      const pending: any[] = [];
      responses.forEach((response: any, index: number) => {
        const findings = Array.isArray(response?.audit_findings) ? response.audit_findings : [];
        findings.forEach((finding: any) => {
          if (!this.isNCFindingCategory(finding?.finding_category)) {
            return;
          }
          if (!this.isPendingApprovalStatus(finding?.audit_finding_status)) {
            return;
          }
          pending.push({
            ...finding,
            questionText: this.auditQuestions[index]?.text,
            template: this.auditQuestions[index]?.template,
            templateType: this.auditQuestions[index]?.templateType
          });
        });
      });
      this.pendingApprovalFindings = pending;
    }, () => {
      this.pendingApprovalFindings = [];
    });
  }

  approvePendingFinding(finding: any) {
    if (!this.isLeadAuditor()) {
      this.audirService.showError('Only lead auditor can approve NC findings');
      return;
    }
    const payload = {
      audit_id: this.auditId.audit_id,
      email: localStorage.getItem('user')?.toString() || '',
      approval_status: 'approved',
      auditor_remarks: '',
      audit_finding_id: finding?.audit_finding_id
    };
    this.audirService.submitNCQuestion(payload).subscribe(() => {
      this.audirService.showSuccess('NC approved and moved to Findings Management');
      this.loadPendingApprovalFindings();
    }, () => {
      this.audirService.showError('Failed to approve NC');
    });
  }

  rejectPendingFinding(finding: any) {
    if (!this.isLeadAuditor()) {
      this.audirService.showError('Only lead auditor can reject NC findings');
      return;
    }
    const dialogRef = this.dialog.open(ApprovalRemarksDialogComponent, {
      disableClose: true,
      data: { isQuestionSubmit: false }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) {
        return;
      }
      const note = (result.auditor_remarks || '').trim();
      if (!note) {
        this.audirService.showError('Rejection note is mandatory');
        return;
      }
      const payload = {
        audit_id: this.auditId.audit_id,
        email: localStorage.getItem('user')?.toString() || '',
        approval_status: 'rejected',
        auditor_remarks: note,
        audit_finding_id: finding?.audit_finding_id
      };
      this.audirService.submitNCQuestion(payload).subscribe(() => {
        this.audirService.showSuccess('NC rejected and sent back with note');
        this.loadPendingApprovalFindings();
      }, () => {
        this.audirService.showError('Failed to reject NC');
      });
    });
  }


  private hasAuditeeServerResponse(response: any): boolean {
    const auditee = response?.auditee_response?.[0] || {};
    const hasDirect = (auditee.auditee_response || '').toString().trim() !== ''
      || (auditee.link || '').toString().trim() !== ''
      || (auditee.attach_evidence && auditee.attach_evidence !== 'None');
    if (hasDirect) {
      return true;
    }
    const history = Array.isArray(response?.history) ? response.history : [];
    return history.some((item: any) => (item?.type || '').toString().toLowerCase() === 'auditee_response');
  }

  hasResponseForRole(response: any) {
    const value = this.isAuditor
      ? response?.auditor_notes?.[0]?.auditor_notes
      : response?.auditee_response?.[0]?.auditee_response;
    return value != null && value.toString().trim() !== '';
  }

  allQuestionsAnswered() {
    return this.auditQuestions.length > 0
      && this.auditQuestions.every((question) => question.submitted);
  }

  updateCompletionPercentage() {
    const total = this.auditQuestions.length;
    if (!total) {
      this.auditCompletionPercentage = 0;
      return;
    }
    const submittedCount = this.auditQuestions.filter((question) => question.submitted).length;
    const percent = (submittedCount / total) * 100;
    this.auditCompletionPercentage = parseFloat(percent.toFixed(2));
  }

  getAuditeeDraft(question: { text: string; template: string; templateType: string }) {
    const questionKey = encodeURIComponent(question.text || '');
    const key = `auditeeDraft:${this.auditId.audit_id}:${question.templateType}:${question.template}:${questionKey}`;
    const draftRaw = localStorage.getItem(key);
    if (!draftRaw) {
      return null;
    }
    try {
      return JSON.parse(draftRaw);
    } catch (error) {
      return null;
    }
  }

  getAuditeeSubmittedFlag(question: { text: string; template: string; templateType: string }) {
    const questionKey = encodeURIComponent(question.text || '');
    const key = `auditeeSubmitted:${this.auditId.audit_id}:${question.templateType}:${question.template}:${questionKey}`;
    return localStorage.getItem(key) === 'true';
  }



  isSubmittedFlag(value: any) {
    if (typeof value === 'string') {
      const normalized = value.toLowerCase();
      return normalized === 'true' || normalized === '1' || normalized === 'submitted';
    }
    return value === true || value === 1;
  }


  getAuditPlanCompletionPercentage(auditId: any) {
    this.audirService.getAuditCompletionPercentage(auditId).subscribe((response: any) => {
      if (response) {
        const rawPercent = Number(response.completion_percent);
        const clampedPercent = Number.isFinite(rawPercent)
          ? Math.min(100, Math.max(0, rawPercent))
          : 0;
        this.auditCompletionPercentage = parseFloat(clampedPercent.toFixed(2));
      } else {
        console.error('Unable to get audit completion percentage');
      }
    }, (error: any) => {
      console.error('Unable to get audit completion percentage:', error);
    });
  }

  getPlanAudit(auditId: any) {
    this.audirService.getAuditPlan(auditId).subscribe((audit: any) => {
      if (audit) {
        const auditData = Array.isArray(audit.audit_data) ? audit.audit_data[0] : audit.audit_data;
        if (auditData) {
          this.auditInfo = this.normalizeAuditInfo(auditData);
          this.auditInitiated = this.isInitiatedStatus(auditData.audit_status);
          if (this.supportsAuditQuestionOverrides && this.baseAuditQuestions.length) {
            this.loadQuestionOverrides();
          }
          return;
        }
      }
      if (this.parentAuditID?.audit_id && auditId?.audit_id !== this.parentAuditID.audit_id) {
        this.getPlanAudit(this.parentAuditID);
      }
    }, (error: any) => {
      console.error('Error for getting audit plan:', error);
    });
  }

  questionInfo(index: number) {
    const question = this.auditQuestions[index];
    if (!question) {
      return;
    }
    const auditInfo = this.auditInfo || { audit_id: this.auditId?.audit_id };
    const dialogRef = this.dialog.open(CustomiseAuditQuestionDialogComponent, {
      disableClose: true,
      width: '1300px',
      position: { right: '0', top: '0' },
      panelClass: 'customize-question-dialog-container',
      data: {
        index: index + 1,
        questionText: question.text,
        template: question.template,
        templateType: question.templateType,
        auditInfo: auditInfo
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
          this.refreshQuestionStatus(index);
      }
      console.log(`Dialog result: ${result}`);
    });
  }


  private getDefaultTemplateInfo() {
    const fromBase = this.baseAuditQuestions[0];
    if (fromBase && fromBase.template) {
      return { template: fromBase.template, templateType: fromBase.templateType };
    }
    const functionTemplate = this.auditInfo?.function_template?.[0];
    const template = this.auditInfo?.template?.[0];
    if (functionTemplate) {
      return { template: functionTemplate, templateType: 'function_template' };
    }
    if (template) {
      return { template: template, templateType: 'template' };
    }
    return { template: '', templateType: 'function_template' };
  }

  private getOverrideStorageKey() {
    return `auditQuestionOverrides:${this.auditId?.audit_id || ''}`;
  }

  private loadCachedOverrides() {
    const raw = localStorage.getItem(this.getOverrideStorageKey());
    if (!raw) {
      return [];
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  private cacheOverrides(overrides: any[]) {
    localStorage.setItem(this.getOverrideStorageKey(), JSON.stringify(overrides || []));
  }

  private extractOverrides(response: any) {
    const normalize = (override: any) => ({
      id: this.getOverrideId(override),
      audit_id: override?.audit_id || override?.auditId || this.auditId?.audit_id,
      template: override?.template || '',
      template_type: override?.template_type || override?.templateType || '',
      original_question: override?.original_question || override?.originalQuestion || '',
      question: override?.question || override?.question_text || override?.questionText || '',
      action: override?.action || override?.operation || '',
      created_by: override?.created_by || override?.createdBy || '',
      created_at: override?.created_at || override?.createdAt || '',
      updated_at: override?.updated_at || override?.updatedAt || ''
    });

    if (Array.isArray(response)) {
      return response.map(normalize);
    }
    if (Array.isArray(response?.overrides)) {
      return response.overrides.map(normalize);
    }
    if (Array.isArray(response?.data)) {
      return response.data.map(normalize);
    }
    if (Array.isArray(response?.audit_data)) {
      return response.audit_data.map(normalize);
    }
    return [];
  }

  private getOverrideId(override: any) {
    return override?.id ?? override?._id ?? override?.override_id ?? override?.overrideId;
  }

  private generateLocalOverrideId() {
    return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  private getOverrideUniqueKey(override: any) {
    const id = this.getOverrideId(override);
    if (id != null) {
      return `id:${id}`;
    }
    const action = (override?.action || '').toString().toLowerCase();
    const template = (override?.template || '').toString();
    const templateType = (override?.template_type || override?.templateType || '').toString();
    const original = (override?.original_question || override?.originalText || '').toString();
    const question = (override?.question || override?.text || '').toString();
    return `${action}|${templateType}|${template}|${original}|${question}`;
  }

  private mergeOverrides(cached: any[], server: any[]) {
    const merged = [...(cached || []), ...(server || [])];
    const map = new Map<string, any>();
    merged.forEach((item: any) => {
      const key = this.getOverrideUniqueKey(item);
      const existing = map.get(key);
      if (!existing) {
        map.set(key, item);
        return;
      }
      const existingTime = new Date(existing?.updated_at || existing?.created_at || 0).getTime();
      const incomingTime = new Date(item?.updated_at || item?.created_at || 0).getTime();
      // Keep the latest version of the same override key.
      if (incomingTime >= existingTime) {
        map.set(key, item);
      }
    });
    return Array.from(map.values());
  }

  loadQuestionOverrides() {
    const currentEmail = localStorage.getItem('user')?.toString() || '';
    const auditorEmails = Array.isArray(this.auditInfo?.auditors)
      ? this.auditInfo.auditors.map((auditor: any) => (auditor?.email || '').toString()).filter((email: string) => !!email)
      : [];
    const emailSet = new Set<string>([currentEmail, ...auditorEmails].filter((email: string) => !!email));
    const emails = Array.from(emailSet);
    const requests = (emails.length ? emails : [currentEmail]).map((email: string) =>
      this.audirService.listAuditQuestionOverrides({
        audit_id: this.auditId.audit_id,
        email: email
      }).pipe(catchError(() => of({ overrides: [] })))
    );

    forkJoin(requests).subscribe((responses: any[]) => {
      const serverOverrides = responses.flatMap((response: any) => this.extractOverrides(response));
      const cachedOverrides = this.loadCachedOverrides();
      this.auditQuestionOverrides = serverOverrides.length
        ? this.mergeOverrides(cachedOverrides, serverOverrides)
        : cachedOverrides;
      this.cacheOverrides(this.auditQuestionOverrides);
      this.applyQuestionOverrides();
    }, () => {
      this.auditQuestionOverrides = this.loadCachedOverrides();
      if (!this.auditQuestionOverrides.length) {
        this.auditQuestions = [...this.baseAuditQuestions];
        this.loadQuestionStatuses();
        return;
      }
      this.applyQuestionOverrides();
    });
  }

  applyQuestionOverrides() {
    const questions = this.baseAuditQuestions.map((question) => ({ ...question })) as any[];
    const overrides = Array.isArray(this.auditQuestionOverrides) ? this.auditQuestionOverrides : [];
    const sortedOverrides = [...overrides].sort((a: any, b: any) => {
      const aTime = new Date(a?.updated_at || a?.created_at || 0).getTime();
      const bTime = new Date(b?.updated_at || b?.created_at || 0).getTime();
      if (aTime && bTime && aTime !== bTime) {
        return aTime - bTime;
      }
      // If only one side has timestamp, treat it as newer so it applies later.
      if (aTime && !bTime) {
        return 1;
      }
      if (!aTime && bTime) {
        return -1;
      }
      const aId = Number(this.getOverrideId(a));
      const bId = Number(this.getOverrideId(b));
      if (Number.isFinite(aId) && Number.isFinite(bId) && aId !== bId) {
        return aId - bId;
      }
      return 0;
    });

    sortedOverrides.forEach((override: any) => {
      const action = (override?.action || '').toString().toLowerCase();
      const originalText = (override?.original_question || '').toString();
      const overrideText = (override?.question || '').toString();
      const overrideId = this.getOverrideId(override);
      const targetText = originalText || overrideText;
      const normalizeText = (value: string) => (value || '').toString().trim().replace(/\s+/g, ' ').toLowerCase();
      const findQuestionIndex = (text: string) => {
        if (!text) {
          return -1;
        }
        const normalizedText = normalizeText(text);
        return questions.findIndex((question: any) =>
          normalizeText(question.text) === normalizedText || normalizeText(question.originalText || '') === normalizedText
        );
      };

      if (action === 'edit') {
        let index = findQuestionIndex(targetText);
        if (index < 0 && overrideId != null) {
          index = questions.findIndex((question: any) => question.overrideId === overrideId);
        }
        if (index >= 0) {
          questions[index].originalText = targetText || questions[index].originalText || questions[index].text;
          questions[index].text = overrideText || questions[index].text;
          questions[index].overrideId = overrideId;
          questions[index].overrideAction = 'edit';
          questions[index].isCustom = true;
        } else if (overrideText) {
          const defaults = this.getDefaultTemplateInfo();
          questions.push({
            text: overrideText,
            template: override.template || defaults.template,
            templateType: override.template_type || defaults.templateType,
            responded: false,
            answered: false,
            submitted: false,
            overrideId: overrideId,
            overrideAction: 'edit',
            originalText: targetText,
            isCustom: true
          });
        }
      } else if (action === 'delete') {
        let index = findQuestionIndex(targetText);
        if (index < 0 && overrideText) {
          index = findQuestionIndex(overrideText);
        }
        if (index < 0 && overrideId != null) {
          index = questions.findIndex((question: any) => question.overrideId === overrideId);
        }
        if (index >= 0) {
          questions.splice(index, 1);
        }
      } else if (action === 'add') {
        if (!overrideText) {
          return;
        }
        const alreadyExists = questions.some((question: any) => question.text === overrideText);
        if (alreadyExists) {
          return;
        }
        const defaults = this.getDefaultTemplateInfo();
        questions.push({
          text: overrideText,
          template: override.template || defaults.template,
          templateType: override.template_type || defaults.templateType,
          responded: false,
          answered: false,
          submitted: false,
          overrideId: overrideId,
          overrideAction: 'add',
          originalText: overrideText,
          isCustom: true
        });
      }
    });

    this.auditQuestions = questions;
    this.loadQuestionStatuses();
  }

  addQuestion() {
    if (!this.isAuditor || this.isQuestionEditingLocked()) {
      return;
    }
    const input = window.prompt('Enter new question');
    const questionText = (input || '').trim();
    if (!questionText) {
      return;
    }
    const defaults = this.getDefaultTemplateInfo();
    const payload = {
      audit_id: this.auditId.audit_id,
      template: defaults.template,
      template_type: defaults.templateType,
      question: questionText,
      action: 'add',
      created_by: localStorage.getItem('user')?.toString() || ''
    };
    this.audirService.addAuditQuestion(payload).subscribe((response: any) => {
      const overrideId = this.getOverrideId(response) || this.generateLocalOverrideId();
      this.auditQuestionOverrides.push({
        id: overrideId,
        audit_id: this.auditId.audit_id,
        template: defaults.template,
        template_type: defaults.templateType,
        question: questionText,
        action: 'add',
        created_by: payload.created_by,
        updated_at: new Date().toISOString()
      });
      this.cacheOverrides(this.auditQuestionOverrides);
      this.loadQuestionOverrides();
      this.audirService.showSuccess('Question added');
    }, () => {
      this.audirService.showError('Failed to add question');
    });
  }

  editQuestion(index: number, event: Event) {
    event.stopPropagation();
    if (!this.isAuditor || this.isQuestionEditingLocked()) {
      return;
    }
    const question = this.auditQuestions[index];
    if (!question) {
      return;
    }
    const input = window.prompt('Edit question', question.text || '');
    const updatedText = (input || '').trim();
    if (!updatedText || updatedText === question.text) {
      return;
    }

    const defaults = this.getDefaultTemplateInfo();
    if (question.overrideId) {
      const payload = {
        id: question.overrideId,
        audit_id: this.auditId.audit_id,
        template: question.template || defaults.template,
        template_type: question.templateType || defaults.templateType,
        original_question: question.originalText || question.text,
        question: updatedText,
        action: question.overrideAction || 'edit',
        created_by: localStorage.getItem('user')?.toString() || ''
      };
      const now = new Date().toISOString();
      const existingIndex = this.auditQuestionOverrides.findIndex((item: any) => this.getOverrideId(item) === question.overrideId);
      if (existingIndex >= 0) {
        this.auditQuestionOverrides[existingIndex] = {
          ...this.auditQuestionOverrides[existingIndex],
          question: updatedText,
          original_question: payload.original_question,
          action: 'edit',
          updated_at: now
        };
      } else {
        this.auditQuestionOverrides.push({
          id: question.overrideId,
          audit_id: this.auditId.audit_id,
          template: payload.template,
          template_type: payload.template_type,
          original_question: payload.original_question,
          question: updatedText,
          action: 'edit',
          created_by: payload.created_by,
          updated_at: now
        });
      }
      this.cacheOverrides(this.auditQuestionOverrides);
      this.applyQuestionOverrides();
      this.audirService.updateAuditQuestion(payload).subscribe(() => {
        this.loadQuestionOverrides();
        this.audirService.showSuccess('Question updated');
      }, () => {
        this.loadQuestionOverrides();
        this.audirService.showError('Failed to update question');
      });
      return;
    }

    const payload = {
      audit_id: this.auditId.audit_id,
      template: question.template || defaults.template,
      template_type: question.templateType || defaults.templateType,
      original_question: question.text,
      question: updatedText,
      action: 'edit',
      created_by: localStorage.getItem('user')?.toString() || ''
    };
    const tempId = this.generateLocalOverrideId();
    this.auditQuestionOverrides.push({
      id: tempId,
      audit_id: this.auditId.audit_id,
      template: payload.template,
      template_type: payload.template_type,
      original_question: payload.original_question,
      question: updatedText,
      action: 'edit',
      created_by: payload.created_by,
      updated_at: new Date().toISOString()
    });
    this.cacheOverrides(this.auditQuestionOverrides);
    this.applyQuestionOverrides();
    this.audirService.addAuditQuestion(payload).subscribe((response: any) => {
      const overrideId = this.getOverrideId(response);
      if (overrideId) {
        const tempIndex = this.auditQuestionOverrides.findIndex((item: any) => this.getOverrideId(item) === tempId);
        if (tempIndex >= 0) {
          this.auditQuestionOverrides[tempIndex].id = overrideId;
        }
      }
      this.cacheOverrides(this.auditQuestionOverrides);
      this.loadQuestionOverrides();
      this.audirService.showSuccess('Question updated');
    }, () => {
      this.auditQuestionOverrides = this.auditQuestionOverrides.filter((item: any) => this.getOverrideId(item) !== tempId);
      this.cacheOverrides(this.auditQuestionOverrides);
      this.applyQuestionOverrides();
      this.audirService.showError('Failed to update question');
    });
  }

  deleteQuestion(index: number, event: Event) {
    event.stopPropagation();
    if (!this.isAuditor || this.isQuestionEditingLocked()) {
      return;
    }
    const question = this.auditQuestions[index];
    if (!question) {
      return;
    }
    const confirmed = window.confirm('Delete this question?');
    if (!confirmed) {
      return;
    }

    if (question.overrideAction === 'add' && question.overrideId) {
      const previousOverrides = [...this.auditQuestionOverrides];
      this.auditQuestionOverrides = this.auditQuestionOverrides.filter((item: any) => this.getOverrideId(item) !== question.overrideId);
      this.cacheOverrides(this.auditQuestionOverrides);
      this.applyQuestionOverrides();
      this.audirService.deleteAuditQuestion({ id: question.overrideId, audit_id: this.auditId.audit_id }).subscribe(() => {
        this.cacheOverrides(this.auditQuestionOverrides);
        this.loadQuestionOverrides();
        this.audirService.showSuccess('Question deleted');
      }, () => {
        this.auditQuestionOverrides = previousOverrides;
        this.cacheOverrides(this.auditQuestionOverrides);
        this.applyQuestionOverrides();
        this.audirService.showError('Failed to delete question');
      });
      return;
    }

    const defaults = this.getDefaultTemplateInfo();
    const payload = {
      audit_id: this.auditId.audit_id,
      template: question.template || defaults.template,
      template_type: question.templateType || defaults.templateType,
      original_question: question.originalText || question.text,
      question: question.text,
      action: 'delete',
      created_by: localStorage.getItem('user')?.toString() || ''
    };
    const tempDeleteId = this.generateLocalOverrideId();
    this.auditQuestionOverrides.push({
      id: tempDeleteId,
      audit_id: this.auditId.audit_id,
      template: payload.template,
      template_type: payload.template_type,
      original_question: payload.original_question,
      question: payload.question,
      action: 'delete',
      created_by: payload.created_by,
      updated_at: new Date().toISOString()
    });
    this.cacheOverrides(this.auditQuestionOverrides);
    this.applyQuestionOverrides();
    this.audirService.addAuditQuestion(payload).subscribe((response: any) => {
      const overrideId = this.getOverrideId(response);
      if (overrideId) {
        const tempIndex = this.auditQuestionOverrides.findIndex((item: any) => this.getOverrideId(item) === tempDeleteId);
        if (tempIndex >= 0) {
          this.auditQuestionOverrides[tempIndex].id = overrideId;
        }
      }
      this.cacheOverrides(this.auditQuestionOverrides);
      this.loadQuestionOverrides();
      this.audirService.showSuccess('Question deleted');
    }, () => {
      this.auditQuestionOverrides = this.auditQuestionOverrides.filter((item: any) => this.getOverrideId(item) !== tempDeleteId);
      this.cacheOverrides(this.auditQuestionOverrides);
      this.applyQuestionOverrides();
      this.audirService.showError('Failed to delete question');
    });
  }

  back() {
    this.location.back();
  }

  showAllOptionsByName(options: any) {
    const names = this.extractDisplayNames(options);
    return names.join(', ');
  }

  private extractDisplayNames(options: any): string[] {
    const people = this.normalizePeopleList(options);
    return people
      .map((person: any) => (person?.name || '').toString().trim())
      .filter((name: string) => name.length > 0);
  }

  private normalizeAuditInfo(auditData: any): any {
    const auditors = this.normalizePeopleList(auditData?.auditors);
    const auditees = this.normalizePeopleList(auditData?.auditees);
    return {
      ...auditData,
      template: this.normalizeTextList(auditData?.template),
      function_template: this.normalizeTextList(auditData?.function_template),
      auditors,
      auditees,
      lead_auditor: this.normalizeLeadAuditor(auditData?.lead_auditor, auditors)
    };
  }

  private normalizeLeadAuditor(value: any, auditors: any[]): any {
    if (value && typeof value === 'object') {
      return value;
    }
    const text = (value || '').toString().trim();
    if (!text) {
      return '';
    }
    const lower = text.toLowerCase();
    const matched = (auditors || []).find((auditor: any) => (auditor?.email || '').toString().toLowerCase() === lower);
    if (matched) {
      return matched;
    }
    return {
      email: this.isLikelyEmail(text) ? text : '',
      name: this.displayNameFromValue(text)
    };
  }

  private normalizePeopleList(options: any): any[] {
    if (!options) {
      return [];
    }
    if (Array.isArray(options)) {
      const hasObjects = options.some((item: any) => item && typeof item === 'object' && !Array.isArray(item));
      if (hasObjects) {
        return options
          .map((item: any) => {
            const email = (item?.email || '').toString().trim();
            const name = (item?.name || item?.Name || this.displayNameFromValue(email)).toString().trim();
            if (!email && !name) {
              return null;
            }
            return { ...item, email, name };
          })
          .filter((item: any) => !!item);
      }
    }
    return this.normalizeTextList(options)
      .map((value: string) => {
        const email = this.isLikelyEmail(value) ? value : '';
        const name = this.displayNameFromValue(value);
        if (!name && !email) {
          return null;
        }
        return { name, email };
      })
      .filter((item: any) => !!item);
  }

  private normalizeTextList(value: any): string[] {
    if (Array.isArray(value)) {
      const stringItems = value
        .filter((item: any) => typeof item === 'string')
        .map((item: string) => item);
      if (stringItems.length === value.length) {
        const joined = stringItems.join('');
        const looksLikeCharStream = stringItems.length > 1 && stringItems.every((part: string) => part.length <= 1);
        if (looksLikeCharStream) {
          return joined
            .split(',')
            .map((item: string) => item.trim())
            .filter((item: string) => item.length > 0);
        }
        return stringItems
          .map((item: string) => item.trim())
          .filter((item: string) => item.length > 0);
      }
      return value
        .map((item: any) => (item ?? '').toString().trim())
        .filter((item: string) => item.length > 0);
    }
    const text = (value ?? '').toString();
    if (!text.trim()) {
      return [];
    }
    return text
      .split(',')
      .map((item: string) => item.trim())
      .filter((item: string) => item.length > 0);
  }

  private displayNameFromValue(value: any): string {
    const text = (value || '').toString().trim();
    if (!text) {
      return '';
    }
    if (this.isLikelyEmail(text)) {
      const local = text.split('@')[0] || '';
      return local
        .replace(/[._-]+/g, ' ')
        .trim()
        .replace(/\b\w/g, (ch: string) => ch.toUpperCase());
    }
    return text;
  }

  private isLikelyEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  canInitiateAudit() {
    if (this.isAuditor) {
      return true;
    }
    const auditors = Array.isArray(this.auditInfo?.auditors) ? this.auditInfo.auditors : [];
    return auditors.some((auditor: any) =>
      (auditor?.email || '').toString().toLowerCase() === this.currentUserEmail
    );
  }

  initiateAudit() {
    if (!this.auditId?.audit_id || this.auditInitiated) {
      return;
    }
    const confirmed = window.confirm('Initiate this audit? This will enable Perform for the Auditee.');
    if (!confirmed) {
      return;
    }
    const payload: any = {
      audit_id: this.auditId.audit_id,
      eMail: localStorage.getItem('user')?.toString() || ''
    };

    const auditors = Array.isArray(this.auditInfo?.auditors) ? this.auditInfo.auditors : [];
    const auditees = Array.isArray(this.auditInfo?.auditees) ? this.auditInfo.auditees : [];
    const fallbackPayload: any = {
      audit_id: this.auditId.audit_id,
      start_date: this.auditInfo?.start_date,
      end_date: this.auditInfo?.end_date,
      auditors: auditors.map((auditor: any) => auditor?.email || auditor).filter((email: any) => !!email),
      auditees: auditees.map((auditee: any) => auditee?.email || auditee).filter((email: any) => !!email),
      city: this.auditInfo?.city || '',
      country: this.auditInfo?.country || '',
      lead_auditor: this.auditInfo?.lead_auditor || '',
      link_audit: this.auditInfo?.link_audit || '',
      template: this.auditInfo?.template || [],
      function_template: this.auditInfo?.function_template || [],
      audit_type: this.auditInfo?.audit_type || '',
      audit_status: 'inprogress'
    };

    this.audirService.initiateAudit(payload).subscribe({
      next: (response: any) => {
        if (!response) {
          this.audirService.showError('Failed to initiate audit');
          return;
        }
        this.auditInitiated = true;
        this.auditInfo = { ...this.auditInfo, audit_status: 'inprogress' };
        this.saveInitialAuditorResponse();
        this.audirService.showSuccess('Audit initiated. Auditee can now perform.');
      },
      error: (error: any) => {
        // Backward-compatible fallback for deployments that do not yet expose /api/initiateAudit.
        this.audirService.updateAuditPlan(fallbackPayload).subscribe({
          next: (fallbackResponse: any) => {
            if (!fallbackResponse) {
              this.audirService.showError('Failed to initiate audit');
              return;
            }
            this.auditInitiated = true;
            this.auditInfo = { ...this.auditInfo, audit_status: 'inprogress' };
            this.saveInitialAuditorResponse();
            this.audirService.showSuccess('Audit initiated. Auditee can now perform.');
          },
          error: (fallbackError: any) => {
            console.error('Error initiating audit (primary):', error);
            console.error('Error initiating audit (fallback):', fallbackError);
            const backendMessage = fallbackError?.error?.message || error?.error?.message || 'Failed to initiate audit';
            this.audirService.showError(backendMessage);
          }
        });
      }
    });
  }

  private saveInitialAuditorResponse() {
    const firstQuestion = this.auditQuestions?.[0];
    if (!firstQuestion) {
      return;
    }
    const payload: any = {
      audit_id: this.auditId.audit_id,
      template: firstQuestion.template,
      template_type: firstQuestion.templateType,
      question: firstQuestion.text,
      auditor_notes: 'Audit initiated',
      email: localStorage.getItem('user')?.toString() || ''
    };
    this.audirService.saveAuditorNotes(payload).subscribe({
      next: () => {},
      error: (error: any) => {
        console.error('Error saving initial auditor response:', error);
      }
    });
  }

  private isInitiatedStatus(status: any): boolean {
    const value = (status || '').toString().trim().toLowerCase();
    return value === 'inprogress' || value === 'in progress' || value === 'in_progress' || value === 'initiated' || value === 'submitted' || value === 'completed' || value === 'closed';
  }

  isQuestionEditingLocked(): boolean {
    return this.isInitiatedStatus(this.auditInfo?.audit_status);
  }

  private submitAuditNow() {
    const payload = {
      audit_id: this.auditId.audit_id,
      email: localStorage.getItem('user')?.toString() || ''
    }
    this.audirService.submitAudit(payload).subscribe((audit: any) => {
      if (audit) {
        this.audirService.showSuccess('Audit submitted successfully');
        console.log('Audit submitted successfully');
        this.navigateToAuditPerform();
      }
    }, (error: any) => {
      this.audirService.showError('Audit submission failed');
      console.error('Error for audit submission:', error);
    });
  }

  onsubmit() {
    if (this.pendingApprovalFindings.length > 0) {
      this.audirService.showError('Please clear pending NC approvals before closing this audit');
      return;
    }
    this.audirService.getNCAuditQuestions(this.auditId).pipe(catchError(() => of(null))).subscribe((response: any) => {
      const findings = Array.isArray(response?.nc_questions) ? response.nc_questions : [];
      const unresolvedApproved = findings.some((item: any) =>
        this.isQualifiedNcStatus(item?.audit_finding_status) && !this.isClosedNcStatus(item?.audit_finding_status)
      );
      if (unresolvedApproved) {
        this.audirService.showError('Cannot close audit until all approved NC findings are closed');
        return;
      }
      this.submitAuditNow();
    });
  }

  openSubmitConfirmationDialog(): void {
    const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, {
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onsubmit();
      }
    });
  }
  public navigateToAuditPerform() {
    localStorage.setItem('header', 'Audit Perform');
    this.router.navigate(['/auditPerform']);
  }
}

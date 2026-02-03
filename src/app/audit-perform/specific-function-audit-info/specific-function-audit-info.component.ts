import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomiseAuditQuestionDialogComponent } from '../customise-audit-question-dialog/customise-audit-question-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AudirService } from 'src/services/audir-services.service';
import { Location } from "@angular/common";
import { SubmitConfirmationDialogComponent } from '../submit-confirmation-dialog/submit-confirmation-dialog.component';
import { catchError, forkJoin, of } from 'rxjs';
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

  constructor(private dialog: MatDialog,
    private route: ActivatedRoute,
    private audirService: AudirService,
    private router: Router,
    private location: Location) {
    this.isAuditor = ((JSON.parse(localStorage.getItem('userDetails') as any))?.role === 'Auditor');
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
          this.loadQuestionOverrides();
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
    }, (error: any) => {
      console.error('Error getting question data:', error);
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
          this.auditInfo = auditData;
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

  loadQuestionOverrides() {
    const payload = {
      audit_id: this.auditId.audit_id,
      email: localStorage.getItem('user')?.toString() || ''
    };
    this.audirService.listAuditQuestionOverrides(payload).subscribe((overrides: any) => {
      this.auditQuestionOverrides = Array.isArray(overrides) ? overrides : [];
      this.applyQuestionOverrides();
    }, () => {
      this.auditQuestionOverrides = [];
      this.auditQuestions = [...this.baseAuditQuestions];
      this.loadQuestionStatuses();
    });
  }

  applyQuestionOverrides() {
    const baseQuestions = this.baseAuditQuestions.map((question) => ({ ...question })) as any[];
    const overrides = Array.isArray(this.auditQuestionOverrides) ? this.auditQuestionOverrides : [];
    const removeIndexes = new Set();
    const addedQuestions: any[] = [];

    overrides.forEach((override: any) => {
      const action = (override?.action || '').toString().toLowerCase();
      const originalText = (override?.original_question || '').toString();
      const overrideText = (override?.question || '').toString();
      const targetText = originalText || overrideText;

      if (action === 'edit') {
        const index = baseQuestions.findIndex((question: any) => question.text === targetText || question.originalText === targetText);
        if (index >= 0) {
          baseQuestions[index].originalText = targetText;
          baseQuestions[index].text = overrideText || baseQuestions[index].text;
          baseQuestions[index].overrideId = override.id;
          baseQuestions[index].overrideAction = 'edit';
          baseQuestions[index].isCustom = true;
        } else if (overrideText) {
          const defaults = this.getDefaultTemplateInfo();
          addedQuestions.push({
            text: overrideText,
            template: override.template || defaults.template,
            templateType: override.template_type || defaults.templateType,
            responded: false,
            answered: false,
            submitted: false,
            overrideId: override.id,
            overrideAction: 'edit',
            originalText: targetText,
            isCustom: true
          });
        }
      } else if (action === 'delete') {
        const index = baseQuestions.findIndex((question: any) => question.text === targetText || question.originalText === targetText);
        if (index >= 0) {
          removeIndexes.add(index);
        }
      } else if (action === 'add') {
        if (!overrideText) {
          return;
        }
        const defaults = this.getDefaultTemplateInfo();
        addedQuestions.push({
          text: overrideText,
          template: override.template || defaults.template,
          templateType: override.template_type || defaults.templateType,
          responded: false,
          answered: false,
          submitted: false,
          overrideId: override.id,
          overrideAction: 'add',
          originalText: overrideText,
          isCustom: true
        });
      }
    });

    const merged = baseQuestions.filter((_, index) => !removeIndexes.has(index));
    this.auditQuestions = merged.concat(addedQuestions);
    this.loadQuestionStatuses();
  }

  addQuestion() {
    if (!this.isAuditor) {
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
      this.auditQuestionOverrides.push({
        id: response?.id,
        audit_id: this.auditId.audit_id,
        template: defaults.template,
        template_type: defaults.templateType,
        question: questionText,
        action: 'add',
        created_by: payload.created_by
      });
      this.applyQuestionOverrides();
      this.audirService.showSuccess('Question added');
    }, () => {
      this.audirService.showError('Failed to add question');
    });
  }

  editQuestion(index: number, event: Event) {
    event.stopPropagation();
    if (!this.isAuditor) {
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
      this.audirService.updateAuditQuestion(payload).subscribe(() => {
        const override = this.auditQuestionOverrides.find((item: any) => item.id === question.overrideId);
        if (override) {
          override.question = updatedText;
          override.original_question = payload.original_question;
          override.action = payload.action;
        }
        question.text = updatedText;
        question.overrideAction = payload.action;
        question.originalText = payload.original_question;
        this.applyQuestionOverrides();
        this.audirService.showSuccess('Question updated');
      }, () => {
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
    this.audirService.addAuditQuestion(payload).subscribe((response: any) => {
      this.auditQuestionOverrides.push({
        id: response?.id,
        audit_id: this.auditId.audit_id,
        template: payload.template,
        template_type: payload.template_type,
        original_question: payload.original_question,
        question: updatedText,
        action: 'edit',
        created_by: payload.created_by
      });
      this.applyQuestionOverrides();
      this.audirService.showSuccess('Question updated');
    }, () => {
      this.audirService.showError('Failed to update question');
    });
  }

  deleteQuestion(index: number, event: Event) {
    event.stopPropagation();
    if (!this.isAuditor) {
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
      this.audirService.deleteAuditQuestion({ id: question.overrideId, audit_id: this.auditId.audit_id }).subscribe(() => {
        this.auditQuestionOverrides = this.auditQuestionOverrides.filter((item: any) => item.id !== question.overrideId);
        this.applyQuestionOverrides();
        this.audirService.showSuccess('Question deleted');
      }, () => {
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
    this.audirService.addAuditQuestion(payload).subscribe((response: any) => {
      this.auditQuestionOverrides.push({
        id: response?.id,
        audit_id: this.auditId.audit_id,
        template: payload.template,
        template_type: payload.template_type,
        original_question: payload.original_question,
        question: payload.question,
        action: 'delete',
        created_by: payload.created_by
      });
      this.applyQuestionOverrides();
      this.audirService.showSuccess('Question deleted');
    }, () => {
      this.audirService.showError('Failed to delete question');
    });
  }

  back() {
    this.location.back();
  }

  showAllOptionsByName(options: any) {
    if (options) {
      return ((options.map((option: any) => option.name)).join(', '));
    }
    return
  }

  onsubmit() {
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

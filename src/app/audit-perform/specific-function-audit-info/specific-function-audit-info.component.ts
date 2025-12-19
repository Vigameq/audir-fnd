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

  auditQuestions: { text: string; template: string; templateType: string; responded: boolean; answered: boolean; submitted: boolean }[] = [];
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
          this.loadQuestionStatuses();
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
    this.auditQuestions = questions;
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
        const submitted = this.isSubmittedFlag(response?.is_submitted);
        const answered = this.hasResponseForRole(response);
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
      const submitted = this.isSubmittedFlag(response?.is_submitted);
      const answered = this.hasResponseForRole(response);
      question.submitted = submitted;
      question.answered = answered;
      question.responded = answered;
      this.updateCompletionPercentage();
    }, (error: any) => {
      console.error('Error getting question data:', error);
    });
  }

  hasResponseForRole(response: any) {
    const value = this.isAuditor
      ? response?.auditor_notes?.[0]?.auditor_notes
      : response?.auditee_response?.[0]?.auditee_response;
    return value != null && value.toString().trim() !== '';
  }

  allQuestionsAnswered() {
    return this.auditQuestions.length > 0
      && this.auditQuestions.every((question) => question.answered);
  }

  updateCompletionPercentage() {
    const total = this.auditQuestions.length;
    if (!total) {
      this.auditCompletionPercentage = 0;
      return;
    }
    const answeredCount = this.auditQuestions.filter((question) => question.answered).length;
    const percent = (answeredCount / total) * 100;
    this.auditCompletionPercentage = parseFloat(percent.toFixed(2));
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
        this.auditInfo = audit.audit_data;
      }
    }, (error: any) => {
      console.error('Error for getting audit plan:', error);
    });
  }

  questionInfo(index: number) {
    const dialogRef = this.dialog.open(CustomiseAuditQuestionDialogComponent, {
      disableClose: true,
      width: '1300px',
      position: { right: '0', top: '0' },
      panelClass: 'customize-question-dialog-container',
      data: {
        index: index + 1,
        questionText: this.auditQuestions[index].text,
        template: this.auditQuestions[index].template,
        templateType: this.auditQuestions[index].templateType,
        auditInfo: this.auditInfo
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
          this.refreshQuestionStatus(index);
      }
      console.log(`Dialog result: ${result}`);
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

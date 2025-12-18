import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomiseAuditQuestionDialogComponent } from '../customise-audit-question-dialog/customise-audit-question-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AudirService } from 'src/services/audir-services.service';
import { Location } from "@angular/common";
import { SubmitConfirmationDialogComponent } from '../submit-confirmation-dialog/submit-confirmation-dialog.component';
@Component({
  selector: 'app-specific-function-audit-info',
  templateUrl: './specific-function-audit-info.component.html',
  styleUrls: ['./specific-function-audit-info.component.scss']
})
export class SpecificFunctionAuditInfoComponent {

  allFunctionalQuestions!: any[];
  auditCompletionPercentage!: any;
  auditInfo: any;
  auditId: any;
  parentAuditID: any;

  constructor(private dialog: MatDialog,
    private route: ActivatedRoute,
    private audirService: AudirService,
    private router: Router,
    private location: Location) {
    this.route.paramMap.subscribe(params => {
      this.auditId = { "audit_id": params.get('id') };
      this.route.queryParams.subscribe(params => {
        this.parentAuditID = { "audit_id": params['parentAuditID'] };
      });
      this.getPlanAudit(this.auditId);
      this.getAuditPlanCompletionPercentage(this.auditId);
      this.getQuestions(this.auditId, this.parentAuditID);
    });
  }

  ngOnInit() {
  }

  getQuestions(auditId: any, parentAuditID: any) {
    let questionTemplates: any;
    this.audirService.getAuditQuestions(parentAuditID).subscribe((auditQuestion: any) => {
      if (auditQuestion) {
        questionTemplates =
        {
          ...auditQuestion.questions?.function_template,
          ...auditQuestion.questions?.template
        };
        this.audirService.getAuditQuestions(auditId).subscribe((auditQuestion: any) => {
          if (auditQuestion) {
            questionTemplates = {
              ...questionTemplates,
              ...(auditQuestion.questions?.function_template)
            };
            this.getAllQuestions(questionTemplates);
          }
        }, (error: any) => {
          console.error('Error for getting questions:', error);
        });
      }
    }, (error: any) => {
      console.error('Error for getting questions:', error);
    });
  }

  getAllQuestions(questionTemplates: any): any {
    const templates = new Set();
    const result: any = {};
    for (const key of Object.keys(questionTemplates)) {
      const normalizedKey = key.replace(/[\s_]/g, '').toLowerCase();
      if (!templates.has(normalizedKey)) {
        templates.add(normalizedKey);
        result[key] = questionTemplates[key];
      }
    }
    this.allFunctionalQuestions = Object.values(result).flat();
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
        questionText: this.allFunctionalQuestions[index],
        auditInfo: this.auditInfo
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getAuditPlanCompletionPercentage(this.auditId);
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

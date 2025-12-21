import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AudirService } from 'src/services/audir-services.service';
import { Location } from "@angular/common";
import { ApprovalRemarksDialogComponent } from '../approval-remarks-dialog/approval-remarks-dialog.component';
import { FindingsQuestionResponseDialogComponent } from '../findings-question-response-dialog/findings-question-response-dialog.component';
@Component({
  selector: 'app-findings-audit-info',
  templateUrl: './findings-audit-info.component.html',
  styleUrls: ['./findings-audit-info.component.scss']
})
export class FindingsAuditInfoComponent {

  allQuestions!: any[];
  auditInfo: any;
  auditId: any;
  disableFlag: boolean | undefined;
  audit_status: string | null | undefined;


  constructor(private dialog: MatDialog,
    private route: ActivatedRoute,
    private audirService: AudirService,
    private router: Router,
    private location: Location) {
    this.route.paramMap.subscribe(params => {
      const auditParam = params.get('id');
      if (!auditParam) {
        return;
      }
      const auditIdValue = Number(auditParam);
      this.auditId = { audit_id: Number.isFinite(auditIdValue) ? auditIdValue : auditParam };
      this.audit_status = params.get('audit_status');
      this.getPlanAudit(this.auditId);
      this.getQuestions(this.auditId);
    });
  }

  ngOnInit() {
  }

  getQuestions(auditId: any) {
    this.audirService.getNCAuditQuestions(auditId).subscribe((auditQuestion: any) => {
      if (auditQuestion) {
        this.allQuestions = auditQuestion.nc_questions;
        this.disableFlag = this.allQuestions.every(
          (item) => item.audit_finding_status === "inprogress"
        );
      }
    }, (error: any) => {
      console.error('Error for getting questions:', error);
    });
  }

  getPlanAudit(auditId: any) {
    if (!auditId?.audit_id) {
      return;
    }
    this.audirService.getAuditPlan(auditId).subscribe((audit: any) => {
      if (audit) {
        const auditData = Array.isArray(audit.audit_data) ? audit.audit_data[0] : audit.audit_data;
        if (auditData) {
          this.auditInfo = auditData;
        }
      }
    }, (error: any) => {
      console.error('Error for getting audit plan:', error);
    });
  }

  questionInfo(index: number, audit_finding_id: number) {
    const question = this.allQuestions?.[index];
    if (!question) {
      return;
    }
    const auditInfo = this.auditInfo || { audit_id: this.auditId?.audit_id };
    const dialogRef = this.dialog.open(FindingsQuestionResponseDialogComponent, {
      disableClose: true,
      width: '1300px',
      position: { right: '0', top: '0' },
      panelClass: 'customize-question-dialog-container',
      data: {
        index: index + 1,
        questionText: question.question,
        auditInfo: auditInfo,
        audit_finding_id: audit_finding_id
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.getQuestions(this.auditId);
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

  onsubmit(data: any) {
    const payload = {
      audit_id: this.auditId.audit_id,
      email: localStorage.getItem('user')?.toString() || '',
      approval_status: data.approval_status,
      auditor_remarks: data.auditor_remarks
    }
    this.audirService.submitNCAudit(payload).subscribe((audit: any) => {
      if (audit) {
        this.audirService.showSuccess('Audit submitted successfully');
        console.log('Audit submitted successfully');
        this.navigateToFindingsManagement();
      }
    }, (error: any) => {
      this.audirService.showError('Audit submission failed');
      console.error('Error for audit submission:', error);
    });
  }

  openSubmitConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ApprovalRemarksDialogComponent, {
      disableClose: true,
      data: { isQuestionSubmit: false}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onsubmit(result);
      }
    });
  }
  public navigateToFindingsManagement() {
    localStorage.setItem('header', 'Findings Management');
    this.router.navigate(['/findingsManagement']);
  }
}

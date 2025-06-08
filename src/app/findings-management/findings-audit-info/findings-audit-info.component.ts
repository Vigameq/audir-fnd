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

  constructor(private dialog: MatDialog,
    private route: ActivatedRoute,
    private audirService: AudirService,
    private router: Router,
    private location: Location) {
    this.route.paramMap.subscribe(params => {
      this.auditId = { "audit_id": params.get('id') };
      this.getPlanAudit(this.auditId);
      this.getQuestions(this.auditId);
    });
  }

  ngOnInit() {
  }

  getQuestions(auditId: any) {
    this.audirService.getNCAuditQuestions(auditId).subscribe((auditQuestion: any) => {
      if (auditQuestion) {
        this.allQuestions = auditQuestion.nc_questions
      }
    }, (error: any) => {
      console.error('Error for getting questions:', error);
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
    const dialogRef = this.dialog.open(FindingsQuestionResponseDialogComponent, {
      disableClose: true,
      width: '1300px',
      position: { right: '0', top: '0' },
      panelClass: 'customize-question-dialog-container',
      data: {
        index: index + 1,
        questionText: this.allQuestions[index].question,
        auditInfo: this.auditInfo
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
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
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result?.approval_status != '') {
        this.onsubmit(result);
      }
    });
  }
  public navigateToFindingsManagement() {
    localStorage.setItem('header', 'Findings Management');
    this.router.navigate(['/findingsManagement']);
  }
}

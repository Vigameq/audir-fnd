import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-approval-remarks-dialog',
  templateUrl: './approval-remarks-dialog.component.html',
  styleUrls: ['./approval-remarks-dialog.component.scss']
})
export class ApprovalRemarksDialogComponent {
  auditorRemarks: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data : { isQuestionSubmit: boolean},
    public dialogRef: MatDialogRef<ApprovalRemarksDialogComponent>
  ) { 
  }

  onApproval(): void {
    this.dialogRef.close({
      approval_status: this.data?.isQuestionSubmit ? 'submitted' : 'approved',
      auditor_remarks: this.auditorRemarks
    });
  }

  onReject(): void {
    this.dialogRef.close({
      approval_status: 'rejected',
      auditor_remarks: this.auditorRemarks
    });
  }
}

import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-approval-remarks-dialog',
  templateUrl: './approval-remarks-dialog.component.html',
  styleUrls: ['./approval-remarks-dialog.component.scss']
})
export class ApprovalRemarksDialogComponent {
  auditorRemarks: string = '';
  constructor(
    public dialogRef: MatDialogRef<ApprovalRemarksDialogComponent>
  ) { }

  onApproval(): void {
    this.dialogRef.close({
      approval_status: 'approved',
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

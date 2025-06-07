import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-approval-remarks-dialog',
  templateUrl: './approval-remarks-dialog.component.html',
  styleUrls: ['./approval-remarks-dialog.component.scss']
})
export class ApprovalRemarksDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router) {
  }
  closeDialog() {
    this.router.navigate(['/templates']);
  }
}

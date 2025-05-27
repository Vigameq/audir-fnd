import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-submit-confirmation-dialog',
  templateUrl: './submit-confirmation-dialog.component.html',
  styleUrls: ['./submit-confirmation-dialog.component.scss']
})
export class SubmitConfirmationDialogComponent {

    constructor(
    public dialogRef: MatDialogRef<SubmitConfirmationDialogComponent>
  ) {}

    onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

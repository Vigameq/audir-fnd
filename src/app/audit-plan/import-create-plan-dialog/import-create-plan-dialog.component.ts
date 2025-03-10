import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-import-create-plan-dialog',
  templateUrl: './import-create-plan-dialog.component.html',
  styleUrls: ['./import-create-plan-dialog.component.scss']
})
export class ImportCreatePlanDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router) { }

  closeDialog() {
    this.router.navigate(['/auditPlan']);
  }
}

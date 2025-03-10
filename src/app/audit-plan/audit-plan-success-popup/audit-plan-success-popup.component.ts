import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-audit-plan-success-popup',
  templateUrl: './audit-plan-success-popup.component.html',
  styleUrls: ['./audit-plan-success-popup.component.scss']
})
export class AuditPlanSuccessPopupComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}

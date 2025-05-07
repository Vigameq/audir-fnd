import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AudirService } from 'src/services/audir-services.service';

@Component({
  selector: 'app-edit-plan-dialog',
  templateUrl: './edit-plan-dialog.component.html',
  styleUrls: ['./edit-plan-dialog.component.scss']
})
export class EditPlanDialogComponent {
  planDetails: any = {};
  editPlanForm: FormGroup = new FormGroup({
    startDateTimeValue: new FormControl(''),
    assignToValue: new FormControl(''),
    endDateTimeValue: new FormControl(''),
    leadAuditorValue: new FormControl('')
  });
  auditees: any[] = [];
  auditors: any[] = [];
  constructor(private audirService: AudirService, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,public  dialogRef: MatDialogRef<EditPlanDialogComponent>) {
  }

  ngOnInit(): void {
    this.editPlanForm = this.fb.group({
      startDateTimeValue: new FormControl(''),
      assignToValue: new FormControl(''),
      endDateTimeValue: new FormControl(''),
      leadAuditorValue: new FormControl('')
    });
    this.planDetails = this.data.planDetails;
    this.auditees = this.data.auditees;
    this.auditors = this.data.auditors;
    this.setPlanFormValues();
  }

  setPlanFormValues() {
    this.editPlanForm.setValue({
      startDateTimeValue: this.planDetails.start_date,
      endDateTimeValue: (new Date(this.planDetails.end_date)).toISOString().slice(0, 16),
      assignToValue: this.planDetails.auditees[0],
      leadAuditorValue: this.planDetails.auditors[0]
    });
  }
  onSaveChanges() {
    const editedAuditPlan: any = {
      'audit_id': this.planDetails.audit_id,
      'start_date': this.editPlanForm.value.startDateTimeValue,
      'end_date': this.editPlanForm.value.endDateTimeValue,
      'auditors': [this.editPlanForm.value.leadAuditorValue],
      'auditees': [this.editPlanForm.value.assignToValue],
      'city': this.planDetails.city,
      'country': this.planDetails.country,
      'audit_type': this.planDetails.audit_type
    };
    this.audirService.updateAuditPlan(editedAuditPlan).subscribe((response: any) => {
      if (response) {
        this.audirService.showSuccess(response.message);
      } else {
        this.audirService.showError('Failed to update audit plan');
      }
    }, (error: any) => {
      this.audirService.showError('Failed to update audit plan');
      console.error('Error for updating audit plan:', error);
    });
  }

  onSuccess() {
    this.dialogRef.close('success');
  }

  onClose() {
    this.dialogRef.close();
  }
}

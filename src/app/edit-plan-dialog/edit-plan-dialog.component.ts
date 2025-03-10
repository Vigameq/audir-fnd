import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-plan-dialog',
  templateUrl: './edit-plan-dialog.component.html',
  styleUrls: ['./edit-plan-dialog.component.scss']
})
export class EditPlanDialogComponent {
  cities = ["Agartala", "Aizawl", "Amaravati", "Bengaluru", "Bhopal", "Bhubaneswar", "Chandigarh", "Chandigarh", "Chennai", "Dehradun", "Dispur", "Gandhinagar", "Gangtok", "Hyderabad", "Imphal", "Itanagar", "Jaipur", "Kohima", "Kolkata", "Lucknow", "Mumbai", "Panaji", "Patna", "Raipur", "Ranchi", "Shillong", "Shimla", "Thiruvananthapuram"];
  countries = ["India"];
  auditees: any[] = ['1234@gmail.com'];
  auditors: any[] = ['1234567@gmail.com'];
  editPlanForm: FormGroup = new FormGroup({
    startDateTimeValue: new FormControl(''),
    auditTypeValue: new FormControl(''),
    assignToValue: new FormControl(''),
    cityNameValue: new FormControl(''),
    endDateTimeValue: new FormControl(''),
    subAuditTypeValue: new FormControl(''),
    leadAuditorValue: new FormControl(''),
    countryNameValue: new FormControl([])
  });
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
  onSaveChanges() {

  }
}

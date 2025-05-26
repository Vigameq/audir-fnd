import { DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AudirService } from 'src/services/audir-services.service';

@Component({
  selector: 'app-edit-plan-dialog',
  templateUrl: './edit-plan-dialog.component.html',
  styleUrls: ['./edit-plan-dialog.component.scss'],
  providers: [DatePipe],
})
export class EditPlanDialogComponent {
  @ViewChild('auditorsDropdown', { static: false }) auditorsDropdown!: ElementRef;
  @ViewChild('auditeesDropdown', { static: false }) auditeesDropdown!: ElementRef;
  planDetails: any = {};
  selectedAuditorOptions: string = 'Select Auditor..';
  selectedAuditeesOptions: string = 'Select Auditee..';
  isAuditorDropdownOpened = false;
  isAuditorOptionsOpen = false;
  selectedAuditor: string[] = [];
  selectedAuditorsEmail: string[] = [];
  selectedAuditees: string[] = [];
  selectedAuditeesEmail: string[] = [];
  isAuditeesOptionsOpen = false;
  isAuditeesDropdownOpened = false;
  maxWidth!: any;
  editPlanForm: FormGroup = new FormGroup({
    startDateTimeValue: new FormControl(''),
    endDateTimeValue: new FormControl('')
  });
  auditees: any[] = [];
  auditors: any[] = [];
  parent_audits_details!: any;
  minDateTime!: any;
  maxDateTime!: any;

  constructor(private datePipe: DatePipe, private audirService: AudirService, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EditPlanDialogComponent>) { }

  ngOnInit(): void {
    this.editPlanForm = this.fb.group({
      startDateTimeValue: new FormControl(''),
      endDateTimeValue: new FormControl(''),
    });
    this.planDetails = this.data.planDetails;
    this.auditees = this.data.auditees;
    this.auditors = this.data.auditors;
    this.setPlanValues();
  }

  setPlanValues() {
    this.parent_audits_details = this.getParentAuditDetails(this.data.parent_audits, this.planDetails.link_audit);
    this.maxDateTime = this.datePipe.transform(this.parent_audits_details.end_date, 'yyyy-MM-dd\'T\'HH:mm:ss', 'UTC');
    this.minDateTime = this.datePipe.transform(this.parent_audits_details.start_date, 'yyyy-MM-dd\'T\'HH:mm:ss', 'UTC');
    this.editPlanForm.setValue({
      startDateTimeValue: (new Date(this.planDetails.start_date)).toISOString().slice(0, 16),
      endDateTimeValue: (new Date(this.planDetails.end_date)).toISOString().slice(0, 16)
    });
    this.auditors = this.selectedOptionValuesChecked(this.auditors, this.planDetails.auditors);
    this.auditees = this.selectedOptionValuesChecked(this.auditees, this.planDetails.auditees);
    this.selectedAuditor = this.selectedOptionNames(this.planDetails.auditors);
    this.selectedAuditorOptions = this.selectedAuditor.length > 0 ? this.selectedAuditor.join(', ') : 'Select Auditor..';
    this.selectedAuditees = this.selectedOptionNames(this.planDetails.auditees);
    this.selectedAuditeesOptions = this.selectedAuditees.length > 0 ? this.selectedAuditees.join(', ') : 'Select Auditee..';
    this.selectedAuditorsEmail = this.selectedOptionEmails(this.planDetails.auditors);
    this.selectedAuditeesEmail = this.selectedOptionEmails(this.planDetails.auditees);
  }

  getParentAuditDetails(parent_audits: any, link_audit: any) {
    return parent_audits.find((parent_audit: any) => parent_audit.title === link_audit);
  }

  selectedOptionNames(options: any) {
    if (options)
      return (options.map((options: any) => options.name));
    else {
      return [];
    }
  }

  selectedOptionValuesChecked(AllValues: any, selectedValues: any) {
    this.setCheckedOption(AllValues)
    AllValues.forEach((user: any) => {
      if (selectedValues.find((selectedUser: any) => selectedUser.email === user.email)) {
        user.checked = true;
      }
    });
    return AllValues;
  }

  selectedOptionEmails(options: any) {
    if (options)
      return (options.map((options: any) => options.email));
    else {
      return [];
    }
  }

  onSaveChanges() {
    const editedAuditPlan: any = {
      'audit_id': this.planDetails.audit_id,
      'start_date': this.editPlanForm.value.startDateTimeValue,
      'end_date': this.editPlanForm.value.endDateTimeValue,
      'auditors': this.selectedAuditorsEmail,
      'auditees': this.selectedAuditeesEmail,
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

  auditorToggleDropdown(event: any) {
    this.isAuditeesOptionsOpen = false;
    event.stopPropagation();
    this.isAuditorOptionsOpen = !this.isAuditorOptionsOpen;
    if (!this.isAuditorDropdownOpened) {
      this.isAuditorDropdownOpened = true;
    }
  }

  onAuditorSelectionChange(event: Event, index: any, auditor: any) {
    const checkbox = event.target as HTMLInputElement;
    if (!this.selectedAuditor.includes(checkbox.value)) {
      if (checkbox.checked) {
        this.selectedAuditor.push(checkbox.value);
        this.selectedAuditorsEmail.push(auditor.email);
        this.auditors[index].checked = true;
      }
    }
    else {
      this.auditors[index].checked = false;
      this.selectedAuditor = this.selectedAuditor.filter((option: any) => option !== checkbox.value);
      this.selectedAuditorsEmail = this.selectedAuditorsEmail.filter(option => option !== auditor.email);
    }
    this.selectedAuditorOptions = this.selectedAuditor.length > 0 ? this.selectedAuditor.join(', ') : 'Select Auditor..';
  }

  setCheckedOption(optionsList: any) {
    return optionsList.map((objectValue: any) => {
      objectValue.checked = false;
      return objectValue;
    });
  }

  onCheckboxClick(event: Event) {
    event.stopPropagation();
  }

  auditeesToggleDropdown(event: any) {
    this.isAuditorOptionsOpen = false;
    event.stopPropagation();
    this.isAuditeesOptionsOpen = !this.isAuditeesOptionsOpen;
    if (!this.isAuditeesDropdownOpened) {
      this.isAuditeesDropdownOpened = true;
    }
  }

  onAuditeeSelectionChange(event: Event, index: any, auditee: any) {
    const checkbox = event.target as HTMLInputElement;
    if (!this.selectedAuditees.includes(checkbox.value)) {
      if (checkbox.checked) {
        this.selectedAuditees.push(checkbox.value);
        this.selectedAuditeesEmail.push(auditee.email);
        this.auditees[index].checked = true;
      }
    }
    else {
      this.auditees[index].checked = false;
      this.selectedAuditees = this.selectedAuditees.filter(option => option !== checkbox.value);
      this.selectedAuditeesEmail = this.selectedAuditeesEmail.filter(option => option !== auditee.email);
    }
    this.selectedAuditeesOptions = this.selectedAuditees.length > 0 ? this.selectedAuditees.join(', ') : 'Select Auditee..';
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const auditorsDropdownMenuElement = this.auditorsDropdown?.nativeElement;
    const auditeesDropdownMenuElement = this.auditeesDropdown?.nativeElement;
    if (this.isAuditorOptionsOpen) {
      if (auditorsDropdownMenuElement && !auditorsDropdownMenuElement.contains(event.target as Node)) {
        this.isAuditorOptionsOpen = false;
      }
    }
    else if (this.isAuditeesOptionsOpen) {
      if (auditeesDropdownMenuElement && !auditeesDropdownMenuElement.contains(event.target as Node)) {
        this.isAuditeesOptionsOpen = false;
      }
    }
  }
}

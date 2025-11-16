import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
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
  selectedFunctionTemplateOptions: string = 'Select function templates..';
  selectedAuditorOptions: string = 'Select Auditor..';
  selectedAuditeesOptions: string = 'Select Auditee..';
  isFunctionTemplateDropdownOpen = false;
  isFunctionTemplateDropdownOpened = false;
  selectedDate: any = new Date();
  auditPlans: any = [];
  isDateMatched: boolean = false;
  isAuditorDropdownOpened = false;
  isAuditorOptionsOpen = false;
  functionTemplates: any[] = [];
  selectedFunctionTemplate: string[] = [];
  selectedAuditor: string[] = [];
  selectedAuditorsEmail: string[] = [];
  selectedAuditees: string[] = [];
  selectedAuditeesEmail: string[] = [];
  isAuditeesOptionsOpen = false;
  isAuditeesDropdownOpened = false;
  maxWidth!: any;
  startDate: any;
  editPlanForm: FormGroup = new FormGroup({
    functionsValue: new FormControl(''),
    startDateTimeValue: new FormControl(''),
    endDateTimeValue: new FormControl(''),
    cityNameValue: new FormControl(''),
    countryNameValue: new FormControl(''),
    auditScopeValue: new FormControl('')
  });
  auditees: any[] = [];
  auditors: any[] = [];
  parent_audits_details!: any;
  minDateTime!: any;
  maxDateTime!: any;
  cities = ["Amaravati", "Bengaluru", "Bhopal", "Bhubaneswar", "Chandigarh", "Chennai", "Dehradun", "Gandhinagar", "Gangtok", "Hyderabad", "Jaipur", "Kolkata", "Lucknow", "Mumbai", "Panaji", "Patna", "Raipur", "Ranchi", "Shillong", "Shimla", "Thiruvananthapuram"];
  countries = ["India"];
  completeAuditees: any[] = [];
  completeAuditors: any[] = [];
  userEmail: string = '';

  constructor(private datePipe: DatePipe, private audirService: AudirService,
    private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, private changeDetectorRef: ChangeDetectorRef, public dialogRef: MatDialogRef<EditPlanDialogComponent>) { }

  ngOnInit(): void {
    this.userEmail = this.getEmail();
    this.editPlanForm = this.fb.group({
      functionsValue: new FormControl(''),
      startDateTimeValue: new FormControl(''),
      endDateTimeValue: new FormControl(''),
      cityNameValue: new FormControl(''),
      countryNameValue: new FormControl(''),
      auditScopeValue: new FormControl('')
    });
    this.data = { ...this.data };
    this.planDetails = this.data.planDetails;
    this.completeAuditees = this.data.auditees;
    this.completeAuditors = this.data.auditors;
    this.auditees = this.data.auditees;
    this.auditors = this.data.auditors;
    this.functionTemplates = this.data.functionTemplates;
    this.setPlanValues();
  }

  getEmail() {
    return localStorage.getItem('user')?.toString() || '';
  }

  setPlanValues() {
    this.parent_audits_details = this.getParentAuditDetails(this.data.parent_audits, this.planDetails.link_audit);
    this.editPlanForm.setValue({
      functionsValue: this.planDetails.functions,
      startDateTimeValue: (new Date(this.planDetails.start_date)).toISOString().slice(0, 16),
      endDateTimeValue: (new Date(this.planDetails.end_date)).toISOString().slice(0, 16),
      cityNameValue: this.planDetails.city,
      countryNameValue: this.planDetails.country,
      auditScopeValue: this.planDetails.audit_scope
    });
    this.auditors = this.selectedOptionValuesChecked(this.auditors, this.planDetails.auditors);
    this.auditees = this.selectedOptionValuesChecked(this.auditees, this.planDetails.auditees);
    this.selectedAuditor = this.selectedOptionNames(this.planDetails.auditors);
    this.selectedAuditorOptions = this.selectedAuditor.length > 0 ? this.selectedAuditor.join(', ') : 'Select Auditor..';
    this.selectedAuditees = this.selectedOptionNames(this.planDetails.auditees);
    this.selectedAuditeesOptions = this.selectedAuditees.length > 0 ? this.selectedAuditees.join(', ') : 'Select Auditee..';
    this.selectedAuditorsEmail = this.selectedOptionEmails(this.planDetails.auditors);
    this.selectedAuditeesEmail = this.selectedOptionEmails(this.planDetails.auditees);
    this.setFunctionTemplateValues();
    const now = new Date();
    this.minDateTime = (this.parent_audits_details?.start_date > now) ?
      this.datePipe.transform(this.parent_audits_details?.start_date, 'yyyy-MM-dd\'T\'HH:mm:ss', 'UTC') :
      this.datePipe.transform(now, 'yyyy-MM-dd\'T\'HH:mm:ss', 'UTC');
    this.startDate = this.editPlanForm.get('startDateTimeValue')?.value;
    this.maxDateTime = this.datePipe.transform(this.parent_audits_details?.end_date, 'yyyy-MM-dd\'T\'HH:mm:ss', 'UTC');
  }

  setFunctionTemplateValues() {
    this.selectedFunctionTemplate = this.planDetails.function_template;
    this.selectedFunctionTemplateOptions = this.selectedFunctionTemplate.length > 0 ? this.selectedFunctionTemplate.join(', ') : 'Select function templates..';
    this.setFunctionTemplateCheckedOptions();
  }

  setFunctionTemplateCheckedOptions() {
    this.functionTemplates = this.functionTemplates.map((template: any) => {
      template.checked = this.selectedFunctionTemplate.includes(template.name);
      return template;
    });
  }

  functionTemplateToggleDropdown(event: any) {
    this.isAuditorOptionsOpen = false;
    this.isAuditeesOptionsOpen = false;
    event.stopPropagation();
    this.isFunctionTemplateDropdownOpen = !this.isFunctionTemplateDropdownOpen;
    if (!this.isFunctionTemplateDropdownOpened) {
      this.isFunctionTemplateDropdownOpened = true;
      this.setFunctionTemplateCheckedOptions();
    }
  }

  customISOToDate(customISOString: string): Date {
    return new Date(customISOString + 'Z');
  }

  async onStartDateChange(date: any) {
    const input: any = date.target as HTMLInputElement;
    this.startDate = input.value;
    if ((this.editPlanForm.get('endDateTimeValue')?.value < this.startDate)) {
      this.editPlanForm.get('endDateTimeValue')?.setValue(this.startDate);
    }
    await this.onEndDateChange();
  }

  async onEndDateChange() {
    this.isDateMatched = false;
    this.selectedDate = new Date(this.editPlanForm.value?.startDateTimeValue);
    await this.getAllChildAuditPlan();
    this.filterDropdown(this.auditors, this.auditPlans, 'auditors');
    this.filterDropdown(this.auditees, this.auditPlans, 'auditees');
  }

  filterDropdown(dropdownList: any, auditPlanList: any, key: any, size = 10000) {
    const filterEmails = new Set();
    for (const audit of auditPlanList) {
      const arr = audit[key];

      if (Array.isArray(arr) &&
        (new Date(audit.start_date).getTime() === this.customISOToDate(this.editPlanForm.value?.startDateTimeValue).getTime()
          && new Date(audit.end_date).getTime() === this.customISOToDate(this.editPlanForm.value?.endDateTimeValue).getTime())) {
        this.isDateMatched = true;
        for (const obj of arr) {
          if (obj.email !== undefined) {
            filterEmails.add(obj.email);
          }
        }
      }
    }
    const filteredDropdown = [];
    for (let i = 0; i < dropdownList.length; i += size) {
      const chunk = dropdownList.slice(i, i + size);
      const filteredChunk = chunk.filter((dropdownValue: any) => !filterEmails.has(dropdownValue.email));
      filteredDropdown.push(...filteredChunk);
    }
    if (this.isDateMatched) {
      if (key === 'auditors') {
        this.resetAuditors();
        this.auditors = filteredDropdown;
      }
      else if (key === 'auditees') {
        this.resetAuditees();
        this.auditees = filteredDropdown;
      }
    }
    else {
      if (key === 'auditors') {
        this.resetAuditors();
        this.auditors = this.completeAuditors;
        this.auditors = this.selectedOptionValuesChecked(this.auditors, this.planDetails.auditors);
        this.selectedAuditor = this.selectedOptionNames(this.planDetails.auditors);
        this.selectedAuditorOptions = this.selectedAuditor.length > 0 ? this.selectedAuditor.join(', ') : 'Select Auditor..';
        this.selectedAuditorsEmail = this.selectedOptionEmails(this.planDetails.auditors);
      }
      else if (key === 'auditees') {
        this.resetAuditees();
        this.auditees = this.completeAuditees;
        this.auditees = this.selectedOptionValuesChecked(this.auditees, this.planDetails.auditees);
        this.selectedAuditees = this.selectedOptionNames(this.planDetails.auditees);
        this.selectedAuditeesOptions = this.selectedAuditees.length > 0 ? this.selectedAuditees.join(', ') : 'Select Auditee..';
        this.selectedAuditeesEmail = this.selectedOptionEmails(this.planDetails.auditees);
      }
    }
  }

  resetAuditees() {
    this.selectedAuditees = [];
    this.selectedAuditeesEmail = [];
    this.selectedAuditeesOptions = 'Select auditees..';
    this.auditees = this.setCheckedOption(this.auditees);
  }

  resetAuditors() {
    this.selectedAuditor = [];
    this.selectedAuditorsEmail = [];
    this.selectedAuditorOptions = 'Select auditors..';
    this.auditors = this.setCheckedOption(this.auditors);
  }

  async getAllChildAuditPlan() {
    const formattedDate: any = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
    try {
      const response: any = await firstValueFrom(this.audirService.getAllChildPlans(this.userEmail, formattedDate));
      if (response) {
        this.auditPlans = response.audit_data.length > 0 ? response.audit_data : [];
      } else {
        this.audirService.showError('Failed to get audit plans');
      }
    } catch (error) {
      this.audirService.showError('Failed to get audit plans');
      console.error('Error for getting audit plan:', error);
    }
    this.changeDetectorRef.detectChanges();
  }

  onFunctionTemplateSelectionChange(event: Event, index: any) {
    const checkbox = event.target as HTMLInputElement;
    if (!this.selectedFunctionTemplate.includes(checkbox.value)) {
      if (checkbox.checked) {
        this.selectedFunctionTemplate.push(checkbox.value);
        this.functionTemplates[index].checked = true;
      }
    }
    else {
      this.functionTemplates[index].checked = false;
      this.selectedFunctionTemplate = this.selectedFunctionTemplate.filter(option => option !== checkbox.value);
    }
    this.selectedFunctionTemplateOptions = this.selectedFunctionTemplate.length > 0 ? this.selectedFunctionTemplate.join(', ') : 'Select function templates..';
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
    this.setCheckedOption(AllValues);
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
      'city': this.editPlanForm.value.cityNameValue,
      'country': this.editPlanForm.value.countryNameValue,
      'lead_auditor': this.planDetails.lead_auditor,
      'link_audit': this.planDetails.link_audit,
      'template': this.planDetails.template,
      'function_template': this.selectedFunctionTemplate.length > 0 ? this.selectedFunctionTemplate : '',
      'audit_type': this.planDetails.audit_type,
      'audit_scope': this.editPlanForm.value.auditScopeValue === '' ? this.planDetails.audit_scope : this.editPlanForm.value.auditScopeValue
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

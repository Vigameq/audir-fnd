import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Audit } from 'src/model/audit.model';
import { AudirService } from 'src/services/audir-services.service';
import { AuditPlanSuccessPopupComponent } from './audit-plan-success-popup/audit-plan-success-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ImportCreatePlanDialogComponent } from './import-create-plan-dialog/import-create-plan-dialog.component';
import { EditPlanDialogComponent } from './edit-plan-dialog/edit-plan-dialog.component';
import { DatePipe } from '@angular/common';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { NotificationsService } from '../header/notifications/notifications.service';

@Component({
  selector: 'app-audit-plan',
  templateUrl: './audit-plan.component.html',
  styleUrls: ['./audit-plan.component.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuditPlanComponent {
  @ViewChild('templateDropdown', { static: false }) templateDropdown!: ElementRef;
  @ViewChild('auditorsDropdown', { static: false }) auditorsDropdown!: ElementRef;
  @ViewChild('auditeesDropdown', { static: false }) auditeesDropdown!: ElementRef;
  @ViewChild('functionTemplateDropdown', { static: false }) functionTemplateDropdown!: ElementRef;
  @ViewChild('leadAuditorDropdown', { static: false }) leadAuditorDropdown!: ElementRef;
  @ViewChild('cityDropdown', { static: false }) cityDropdown!: ElementRef;
  @ViewChild('countryDropdown', { static: false }) countryDropdown!: ElementRef;
  @ViewChild('auditTitle', { static: false }) auditTitleElement!: ElementRef;
  @ViewChild('auditTypeDropdown', { static: false }) auditTypeDropdown!: ElementRef;

  auditPlanForm: FormGroup = new FormGroup({
    parentAudit: new FormControl(''),
    auditType: new FormControl('Physical'),
    auditTitle: new FormControl(''),
    functions: new FormControl(''),
    templateValue: new FormControl([]),
    functionTemplateValue: new FormControl([]),
    startDateTime: new FormControl(''),
    endDateTime: new FormControl(''),
    leadAuditorValue: new FormControl(''),
    auditorValue: new FormControl([]),
    auditeesValue: new FormControl([]),
    cityName: new FormControl(''),
    countryName: new FormControl(''),
    auditScopeValue: new FormControl('')
  });
  isTemplateOptionsOpen = false;
  isTemplateDropdownOpened = false;
  isFunctionTemplateDropdownOpened = false;
  cities = ["Amaravati", "Bengaluru", "Bhopal", "Bhubaneswar", "Chandigarh", "Chennai", "Dehradun", "Gandhinagar", "Gangtok", "Hyderabad", "Jaipur", "Kolkata", "Lucknow", "Mumbai", "Panaji", "Patna", "Raipur", "Ranchi", "Shillong", "Shimla", "Thiruvananthapuram"];
  auditTypes = ["Physical", "Offline", "Virtual"];
  countries = ["India"];
  selectedTemplate: string[] = [];
  selectedFunctionTemplate: string[] = [];
  selectedAuditor: string[] = [];
  selectedAuditorsEmail: string[] = [];
  selectedAuditees: string[] = [];
  selectedAuditeesEmail: string[] = [];
  parent_audits: any[] = [];
  parentAudits: any[] = [];
  templates: any[] = [];
  functionTemplates: any[] = [];
  auditees: any[] = [];
  auditors: any[] = [];
  isImportVisible: boolean = true;
  isDateMatched: boolean = false;
  // showAllPlans: boolean = false;
  auditPlans: any = [];
  selectedDate: any = new Date();
  isClear: boolean = false;
  isLoading: boolean = false;
  isParentAudit: boolean = false;
  private destroy$ = new Subject<void>();
  selectedTemplateOptions: string = 'Select templates..';
  selectedFunctionTemplateOptions: string = 'Select function templates..';
  selectedAuditorOptions: string = 'Select auditors..';
  selectedAuditeesOptions: string = 'Select auditees..';
  maxWidth: any;
  isAuditorOptionsOpen = false;
  isAuditeesOptionsOpen = false;
  isAuditorDropdownOpened = false;
  isAuditeesDropdownOpened = false;
  isFunctionTemplateDropdownOpen = false;
  isLeadAuditorDropdownOpen = false;
  isCityDropdownOpen = false;
  isCountryDropdownOpen = false;
  isAuditTypeDropdownOpen = false;
  startDate: any;
  userEmail: string = '';
  minDateTime: any;
  maxDateTime: any;
  parentLeadAuditor: any[] = [];
  completeAuditees: any[] = [];
  completeAuditors: any[] = [];

  constructor(private datePipe: DatePipe, private formBuilder: FormBuilder, private audirService: AudirService, private notificationsService: NotificationsService, private dialog: MatDialog, private router: Router, private changeDetectorRef: ChangeDetectorRef) {
    this.setMaxMinDateTime();
    this.userEmail = this.getEmail();
  }

  async ngOnInit(): Promise<void> {
    this.isImportVisible = true;
    // this.showAllPlans = (this.auditPlans.length <= 4) ? true : false;
    this.auditPlanForm = this.formBuilder.group(
      {
        parentAudit: [''],
        auditType: ['Physical'],
        auditTitle: ['', Validators.required],
        functions: [''],
        templateValue: [[], Validators.required],
        functionTemplateValue: [[], Validators.required],
        startDateTime: ['', Validators.required],
        endDateTime: [{ value: '', disabled: true }, Validators.required],
        leadAuditorValue: ['', Validators.required],
        auditorValue: [[], Validators.required],
        auditeesValue: [[], Validators.required],
        cityName: ['', Validators.required],
        countryName: ['', Validators.required],
        auditScopeValue: ['', Validators.required]
      });
    this.auditPlanForm.get('parentAudit')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (value) {
        this.isParentAudit = true;
        this.auditPlanForm.get('leadAuditorValue')?.setValue('');
        this.auditors = this.completeAuditors;
        this.auditees = this.completeAuditees;
      }
      else {
        this.isParentAudit = false;
        this.resetAuditorsAuditees();
        this.auditors = this.completeAuditors;
      }
    });
    this.getPlanItems();
    this.getAuditLists();
    this.getAllChildAuditPlan();
  }

  getAuditLists() {
    const now = new Date();
    const utcToday = new Date(Date.UTC(now.getUTCFullYear() - 50, now.getUTCMonth(), now.getUTCDate()));
    const utcTomorrow = new Date(Date.UTC(now.getUTCFullYear() + 50, now.getUTCMonth(), now.getUTCDate() + 1));
    const fromDate = utcToday.toISOString().substring(0, 10);
    const toDate = utcTomorrow.toISOString().substring(0, 10);
    const email = localStorage.getItem('user')?.toString() || '';
    var payload = {
      eMail: email,
      start_date_filter: {
        from: fromDate,
        to: toDate
      },
      status_filter: ["created", "inprogress"]
    };

    this.audirService.getAuditLists(payload).subscribe((response: any) => {
      if (response) {
        const completeAuditList = response.audit_data;
        this.parent_audits = completeAuditList.filter((item: any) => item.hasOwnProperty('audit_title'))
          .map((item: any) => ({ title: item.audit_title }));
        this.parent_audits = this.parentAudits.filter(item =>
          this.parent_audits.some(t => t.title === item.title)
        );
      }
    }, (error: any) => {
      console.error('Error for getting audits:', error);
    });
  }

  setMaxMinDateTime() {
    this.minDateTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss', 'UTC');
    this.maxDateTime = '9999-12-31T23:59:59';
  }

  getPlanItems() {
    this.audirService.getPlanItems(this.userEmail).subscribe((items: any) => {
      if (items) {
        this.parentAudits = items.parent_audits;
        this.templates = items.templates.map((template: any) => ({ ...template }));
        this.functionTemplates = items.templates.map((template: any) => ({ ...template }));
        this.auditees = items.users.auditees;
        this.auditors = items.users.auditors;
        this.completeAuditees = items.users.auditees;
        this.completeAuditors = items.users.auditors;
      }
    }, (error: any) => {
      console.error('Error for getting plans:', error);
    });
  }

  onTemplateSelectionChange(event: Event, index: any) {
    const checkbox = event.target as HTMLInputElement;
    if (!this.selectedTemplate.includes(checkbox.value)) {
      if (checkbox.checked) {
        this.selectedTemplate.push(checkbox.value);
        this.templates[index].checked = true;
      }
    }
    else {
      this.templates[index].checked = false;
      this.selectedTemplate = this.selectedTemplate.filter(option => option !== checkbox.value);
    }
    this.selectedTemplateOptions = this.selectedTemplate.length > 0 ? this.selectedTemplate.join(', ') : 'Select templates..';
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
    this.selectedAuditeesOptions = this.selectedAuditees.length > 0 ? this.selectedAuditees.join(', ') : 'Select auditees..';
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
      this.selectedAuditor = this.selectedAuditor.filter(option => option !== checkbox.value);
      this.selectedAuditorsEmail = this.selectedAuditorsEmail.filter(option => option !== auditor.email);
    }
    this.selectedAuditorOptions = this.selectedAuditor.length > 0 ? this.selectedAuditor.join(', ') : 'Select auditors..';
  }

  onSubmit() {
    if (this.auditPlanForm) {
      if (this.auditPlanForm.value?.parentAudit.title) {
        this.parentLeadAuditor = this.parent_audits.filter(p => p.title === this.auditPlanForm.value?.parentAudit.title);
      }

      const plan: Audit = {
        link_audit: this.auditPlanForm.value?.parentAudit ? this.auditPlanForm.value?.parentAudit.title : null,
        audit_title: this.auditPlanForm.value?.auditTitle,
        functions: this.auditPlanForm.value?.functions,
        template: this.selectedTemplate,
        function_template: this.selectedFunctionTemplate.length > 0 ? this.selectedFunctionTemplate : '',
        start_date: this.auditPlanForm.value?.startDateTime,
        end_date: this.auditPlanForm.value?.endDateTime,
        lead_auditor: this.auditPlanForm?.value?.leadAuditorValue,
        auditors: this.selectedAuditorsEmail.length === 0 && this.auditPlanForm.value?.parentAudit.title ? this.parentLeadAuditor[0]?.lead_auditor : this.selectedAuditorsEmail,
        auditees: this.selectedAuditeesEmail,
        city: this.auditPlanForm.value?.cityName,
        country: this.auditPlanForm.value?.countryName,
        audit_scope: this.auditPlanForm.value?.auditScopeValue,
        // audit_type: this.auditPlanForm.value?.auditType,
        audit_type: 'Physical',
        eMail: this.userEmail
      }
      if (this.checkRequiredPlanValues(plan)) {
        this.audirService.createAuditPlan(plan).subscribe(response => {
          if (response) {
            this.resetForm();
            this.openSuccessDialog(plan.audit_title);
          } else {
            this.audirService.showError('Failed to create audit plan');
          }
        }, (error: any) => {
          this.audirService.showError(error.error.message);
          console.error('Error for creation of audit plan:', error);
        }
        )
      } else {
        if (!this.isClear) this.audirService.showError('Please enter mandatory (*) fields');
      }
    }
  }

  checkRequiredPlanValues(plan: Audit) {
    const checkPlanValues = plan.audit_title && plan.start_date && plan.end_date && plan.audit_scope;
    return (this.isParentAudit ? checkPlanValues : (checkPlanValues && plan.lead_auditor));
  }

  onClearForm() {
    this.isClear = true;
    this.resetForm();
  }

  resetForm() {
    this.isParentAudit = false;
    this.isTemplateDropdownOpened = false;
    this.isFunctionTemplateDropdownOpened = false;
    this.auditPlanForm.reset({
      parentAudit: '',
      auditType: 'Physical',
      auditTitle: '',
      functions: '',
      templateValue: [],
      functionTemplateValue: [],
      startDateTime: '',
      endDateTime: { value: '', disabled: true },
      leadAuditorValue: [],
      auditorValue: [],
      auditeesValue: [],
      cityName: '',
      countryName: '',
      auditScopeValue: ''
    });
    this.selectedTemplate = [];
    this.selectedFunctionTemplate = [];
    this.selectedAuditor = [];
    this.selectedAuditorsEmail = [];
    this.selectedAuditeesEmail = [];
    this.selectedAuditees = [];
    this.selectedTemplateOptions = 'Select templates..';
    this.selectedFunctionTemplateOptions = 'Select function templates..';
    this.selectedAuditorOptions = 'Select auditors..';
    this.selectedAuditeesOptions = 'Select auditees..';
    this.setMaxMinDateTime();
  }

  openImportPlanDialog(): void {
    this.importVisibility();
    const dialogRef = this.dialog.open(ImportCreatePlanDialogComponent, {
      disableClose: true,
      width: '654px',
      height: '464px',
      data: { id: 'GG196678' }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.router.navigate(['/auditPlan']);
      this.refreshNotifications();
      this.importVisibility();
      this.getPlanItems();
      this.changeDetectorRef.detectChanges();
      console.log(`Dialog result: ${result}`);
    });
  }

  openEditPlanDialog(planDetails: any): void {
    const dialogRef = this.dialog.open(EditPlanDialogComponent, {
      autoFocus: false,
      disableClose: true,
      width: '654px',
      height: '658px',
      data: JSON.parse(JSON.stringify({
        'planDetails': planDetails,
        'auditees': this.auditees,
        'auditors': this.auditors,
        'functionTemplates': this.functionTemplates,
        'parent_audits': this.parent_audits
      }))
    });

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result === 'success') {
        this.getAllChildAuditPlan();
        this.router.navigate(['/auditPlan']);
        this.refreshNotifications();
        this.changeDetectorRef.detectChanges();
      }
      console.log(`Dialog result: ${result}`);
    });
  }

  importVisibility() {
    this.isImportVisible = !this.isImportVisible;
  }

  openSuccessDialog(audit_title: string) {
    const dialogRef = this.dialog.open(AuditPlanSuccessPopupComponent, {
      disableClose: true,
      width: '500px',
      height: '480px',
      data: { id: audit_title }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.router.navigate(['/auditPlan']);
      this.refreshNotifications();
      this.setMaxMinDateTime();
      this.getPlanItems();
      console.log(`Dialog result: ${result}`);
    });
  }

  refreshNotifications() {
    this.notificationsService.triggerRefresh();
  }

  templateToggleDropdown(event: any) {
    this.isAuditorOptionsOpen = false;
    this.isAuditeesOptionsOpen = false;
    this.isFunctionTemplateDropdownOpen = false;
    event.stopPropagation();
    this.isTemplateOptionsOpen = !this.isTemplateOptionsOpen;
    if (!this.isTemplateDropdownOpened) {
      this.isTemplateDropdownOpened = true;
      this.templates = this.setCheckedOption(this.templates);
    }
  }

  functionTemplateToggleDropdown(event: any) {
    this.isAuditorOptionsOpen = false;
    this.isAuditeesOptionsOpen = false;
    this.isTemplateOptionsOpen = false;
    event.stopPropagation();
    this.isFunctionTemplateDropdownOpen = !this.isFunctionTemplateDropdownOpen;
    if (!this.isFunctionTemplateDropdownOpened) {
      this.isFunctionTemplateDropdownOpened = true;
      this.functionTemplates = this.setCheckedOption(this.functionTemplates);
    }
  }

  auditorToggleDropdown(event: any) {
    this.resetDropDownsArrows();
    this.isTemplateOptionsOpen = false;
    this.isAuditeesOptionsOpen = false;
    this.isFunctionTemplateDropdownOpen = false;
    event.stopPropagation();
    this.isAuditorOptionsOpen = !this.isAuditorOptionsOpen;
    if (!this.isAuditorDropdownOpened) {
      this.isAuditorDropdownOpened = true;
      this.auditors = this.setCheckedOption(this.auditors);
    }
  }

  auditeesToggleDropdown(event: any) {
    this.resetDropDownsArrows();
    this.isTemplateOptionsOpen = false;
    this.isAuditorOptionsOpen = false;
    this.isFunctionTemplateDropdownOpen = false;
    event.stopPropagation();
    this.isAuditeesOptionsOpen = !this.isAuditeesOptionsOpen;
    if (!this.isAuditeesDropdownOpened) {
      this.isAuditeesDropdownOpened = true;
      this.auditees = this.setCheckedOption(this.auditees);
    }
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

  async onSelection(date: any) {
    this.isLoading = true;
    if (date) {
      this.getAllChildAuditPlan();
    }
  }

  public navigateToAuditPerform() {
    localStorage.setItem('header', 'Audit Perform');
    this.router.navigate(['/auditPerform']);
  }

  async getAllChildAuditPlan() {
    const formattedDate: any = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
    try {
      const response: any = await firstValueFrom(this.audirService.getAllChildPlans(this.userEmail, formattedDate));
      if (response) {
        this.isLoading = false;
        this.auditPlans = response.audit_data.length > 0 ? response.audit_data : [];
      } else {
        this.isLoading = false;
        this.audirService.showError('Failed to get audit plans');
      }
    } catch (error) {
      this.isLoading = false;
      this.audirService.showError('Failed to get audit plans');
      console.error('Error for getting audit plan:', error);
    }
    this.changeDetectorRef.detectChanges();
  }

  updateWidth() {
    this.maxWidth = this.auditTitleElement.nativeElement.offsetWidth - 38;
  }

  onLeadAuditorDropdownClick(): void {
    this.isLeadAuditorDropdownOpen = !this.isLeadAuditorDropdownOpen;
  }

  onCityDropdownClick(): void {
    this.isCityDropdownOpen = !this.isCityDropdownOpen;
  }

  onCountryDropdownClick(): void {
    this.isCountryDropdownOpen = !this.isCountryDropdownOpen;
  }

  onAuditTypeDropdownClick(): void {
    this.isAuditTypeDropdownOpen = !this.isAuditTypeDropdownOpen;
  }

  getEmail() {
    return localStorage.getItem('user')?.toString() || '';
  }

  ngAfterViewInit() {
    this.updateWidth();
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.updateWidth();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const templateDropdownMenuElement = this.templateDropdown?.nativeElement;
    const auditorsDropdownMenuElement = this.auditorsDropdown?.nativeElement;
    const auditeesDropdownMenuElement = this.auditeesDropdown?.nativeElement;
    const functionTemplateDropdownMenuElement = this.functionTemplateDropdown?.nativeElement;
    const leadAuditorDropdownMenuElement = this.leadAuditorDropdown?.nativeElement;
    const cityDropdownMenuElement = this.cityDropdown?.nativeElement;
    const countryDropdownMenuElement = this.countryDropdown?.nativeElement;
    const auditTypeDropdownMenuElement = this.auditTypeDropdown?.nativeElement;

    if (this.isTemplateOptionsOpen) {
      if (templateDropdownMenuElement && !templateDropdownMenuElement.contains(event.target as Node)) {
        this.isTemplateOptionsOpen = false;
      }
    }
    else if (this.isAuditorOptionsOpen) {
      if (auditorsDropdownMenuElement && !auditorsDropdownMenuElement.contains(event.target as Node)) {
        this.isAuditorOptionsOpen = false;
      }
    }
    else if (this.isAuditeesOptionsOpen) {
      if (auditeesDropdownMenuElement && !auditeesDropdownMenuElement.contains(event.target as Node)) {
        this.isAuditeesOptionsOpen = false;
      }
    }
    else if (this.isFunctionTemplateDropdownOpen) {
      if (functionTemplateDropdownMenuElement && !functionTemplateDropdownMenuElement.contains(event.target as Node)) {
        this.isFunctionTemplateDropdownOpen = false;
      }
    }
    else if (this.isLeadAuditorDropdownOpen) {
      if (leadAuditorDropdownMenuElement && !leadAuditorDropdownMenuElement.contains(event.target as Node)) {
        this.isLeadAuditorDropdownOpen = false;
      }
    }
    else if (this.isCityDropdownOpen) {
      if (cityDropdownMenuElement && !cityDropdownMenuElement.contains(event.target as Node)) {
        this.isCityDropdownOpen = false;
      }
    }
    else if (this.isCountryDropdownOpen) {
      if (countryDropdownMenuElement && !countryDropdownMenuElement.contains(event.target as Node)) {
        this.isCountryDropdownOpen = false;
      }
    }
    else if (this.isAuditTypeDropdownOpen) {
      if (auditTypeDropdownMenuElement && !auditTypeDropdownMenuElement.contains(event.target as Node)) {
        this.isAuditTypeDropdownOpen = false;
      }
    }
  }

  async onStartDateChange(date: any) {
    const input: any = date.target as HTMLInputElement;
    this.startDate = input.value;
    if (this.auditPlanForm.get('endDateTime')?.enabled && (this.auditPlanForm.get('endDateTime')?.value < this.startDate)) {
      this.auditPlanForm.get('endDateTime')?.setValue(this.startDate);
    }
    await this.onEndDateChange();
    this.auditPlanForm.get('endDateTime')?.enable();
  }

  onParentAuditChange() {
    this.auditPlanForm.get('startDateTime')?.setValue('');
    this.auditPlanForm.get('endDateTime')?.setValue('');
    this.auditPlanForm.get('auditTitle')?.setValue('');
    this.auditPlanForm.get('endDateTime')?.disable();
    const now = new Date();
    this.minDateTime = (this.auditPlanForm.value.parentAudit.start_date > now) ?
      this.datePipe.transform(this.auditPlanForm.value.parentAudit.start_date, 'yyyy-MM-dd\'T\'HH:mm:ss', 'UTC') :
      this.datePipe.transform(now, 'yyyy-MM-dd\'T\'HH:mm:ss', 'UTC');
    this.maxDateTime = this.datePipe.transform(this.auditPlanForm.value.parentAudit.end_date, 'yyyy-MM-dd\'T\'HH:mm:ss', 'UTC');
  }

  resetAuditorsAuditees() {
    this.auditPlanForm.get('leadAuditorValue')?.setValue('');
    this.selectedAuditor = [];
    this.selectedAuditees = [];
    this.selectedAuditorsEmail = [];
    this.selectedAuditeesEmail = [];
    this.selectedAuditorOptions = 'Select auditors..';
    this.selectedAuditeesOptions = 'Select auditees..';
    this.auditors = this.setCheckedOption(this.auditors);
    this.auditees = this.setCheckedOption(this.auditees);
  }

  async onEndDateChange() {
    this.isDateMatched = false;
    this.resetAuditorsAuditees();
    if (this.auditPlanForm.value?.parentAudit.title) {
      this.selectedDate = new Date(this.auditPlanForm.value?.startDateTime);
      this.getAllChildAuditPlan();
      this.filterDropdown(this.auditors, this.auditPlans, 'auditors');
      this.filterDropdown(this.auditees, this.auditPlans, 'auditees');
    }
  }

  filterDropdown(dropdownList: any, auditPlanList: any, key: any, size = 10000) {
    const filterEmails = new Set();
    for (const audit of auditPlanList) {
      const arr = audit[key];

      if (Array.isArray(arr) &&
        (new Date(audit.start_date).getTime() === this.customISOToDate(this.auditPlanForm.value?.startDateTime).getTime()
          && new Date(audit.end_date).getTime() === this.customISOToDate(this.auditPlanForm.value?.endDateTime).getTime())) {
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
        this.auditors = filteredDropdown;
      }
      else if (key === 'auditees') {
        this.auditees = filteredDropdown;
      }
    }
    else {
      if (key === 'auditors') {
        this.auditors = this.completeAuditors;
      }
      else if (key === 'auditees') {
        this.auditees = this.completeAuditees;
      }
    }
  }

  customISOToDate(customISOString: string): Date {
    return new Date(customISOString + 'Z');
  }

  onAuditTypeChange() { }

  resetDropDownsArrows() {
    this.isLeadAuditorDropdownOpen = false;
    this.isCityDropdownOpen = false;
    this.isCountryDropdownOpen = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

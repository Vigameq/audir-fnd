import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
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
  @ViewChild('auditTitle') auditTitleElement!: ElementRef;

  auditPlanForm: FormGroup = new FormGroup({
    parentAudit: new FormControl(''),
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
  cities = ["Amaravati", "Bengaluru", "Bhopal", "Bhubaneswar", "Chandigarh", "Chennai", "Dehradun", "Gandhinagar", "Gangtok", "Hyderabad", "Jaipur", "Kolkata", "Lucknow", "Mumbai", "Panaji", "Patna", "Raipur", "Ranchi", "Shillong", "Shimla", "Thiruvananthapuram"];
  countries = ["India"];
  selectedTemplate: string[] = [];
  selectedAuditor: string[] = [];
  selectedAuditees: string[] = [];
  parent_audits: any[] = [];
  templates: any[] = [];
  auditees: any[] = [];
  auditors: any[] = [];
  isImportVisible: boolean = true;
  // showAllPlans: boolean = false;
  auditPlans: any = [];
  selectedDate: any = new Date();
  isClear: boolean = false;
  isLoading: boolean = false;
  isParentAudit: boolean = false;
  private destroy$ = new Subject<void>();
  selectedTemplateOptions: string = 'Select templates..';
  selectedAuditorOptions: string = 'Select Auditors..';
  selectedAuditeesOptions: string = 'Select Auditees..';
  maxWidth: any;
  isAuditorOptionsOpen = false;
  isAuditeesOptionsOpen = false;
  isAuditorDropdownOpened = false;
  isAuditeesDropdownOpened = false;
  isFunctionTemplateDropdownOpen = false;
  isLeadAuditorDropdownOpen = false;
  isCityDropdownOpen = false;
  isCountryDropdownOpen = false;

  constructor(private renderer: Renderer2, private datePipe: DatePipe, private formBuilder: FormBuilder, private audirService: AudirService, private dialog: MatDialog, private router: Router, private changeDetectorRef: ChangeDetectorRef) {
  }

  async ngOnInit(): Promise<void> {
    this.isImportVisible = true;
    // this.showAllPlans = (this.auditPlans.length <= 4) ? true : false;
    this.auditPlanForm = this.formBuilder.group(
      {
        parentAudit: [''],
        auditTitle: ['', Validators.required],
        functions: [''],
        templateValue: [[], Validators.required],
        functionTemplateValue: [[], Validators.required],
        startDateTime: ['', Validators.required],
        endDateTime: ['', Validators.required],
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
      }
    });
    this.getPlanItems();
    await this.getAllAuditPlan();
  }

  getPlanItems() {
    const email = localStorage.getItem('user')?.toString() || '';
    this.audirService.getPlanItems(email).subscribe((items: any) => {
      if (items) {
        this.parent_audits = items.parent_audits;
        this.templates = items.templates;
        this.auditees = items.users.auditees;
        this.auditors = items.users.auditors;
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

  onAuditeeSelectionChange(event: Event, index: any) {
    const checkbox = event.target as HTMLInputElement;
    if (!this.selectedAuditees.includes(checkbox.value)) {
      if (checkbox.checked) {
        this.selectedAuditees.push(checkbox.value);
        this.auditees[index].checked = true;
      }
    }
    else {
      this.auditees[index].checked = false;
      this.selectedAuditees = this.selectedAuditees.filter(option => option !== checkbox.value);
    }
    this.selectedAuditeesOptions = this.selectedAuditees.length > 0 ? this.selectedAuditees.join(', ') : 'Select Auditees..';
  }

  onAuditorSelectionChange(event: Event, index: any) {
    const checkbox = event.target as HTMLInputElement;
    if (!this.selectedAuditor.includes(checkbox.value)) {
      if (checkbox.checked) {
        this.selectedAuditor.push(checkbox.value);
        this.auditors[index].checked = true;
      }
    }
    else {
      this.auditors[index].checked = false;
      this.selectedAuditor = this.selectedAuditor.filter(option => option !== checkbox.value);
    }
    this.selectedAuditorOptions = this.selectedAuditor.length > 0 ? this.selectedAuditor.join(', ') : 'Select Auditors..';
  }

  onSubmit() {
    if (this.auditPlanForm) {
      const plan: Audit = {
        link_audit: this.auditPlanForm.value?.parentAudit ? this.auditPlanForm.value?.parentAudit : null,
        audit_title: this.auditPlanForm.value?.auditTitle,
        functions: this.auditPlanForm.value?.functions,
        template: this.selectedTemplate,
        function_template: this.auditPlanForm.value?.functionTemplateValue,
        start_date: this.auditPlanForm.value?.startDateTime,
        end_date: this.auditPlanForm.value?.endDateTime,
        leadAuditorValue: this.auditPlanForm?.value?.leadAuditorValue,
        auditors: this.selectedAuditor,
        auditees: this.selectedAuditees,
        city: this.auditPlanForm.value?.cityName,
        country: this.auditPlanForm.value?.countryName,
        audit_scope: this.auditPlanForm.value?.auditScopeValue,
        audit_type: "ISO 270015",
        eMail: localStorage.getItem('user')?.toString() || ''
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
          this.audirService.showError('Failed to create audit plan');
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
    return (this.isParentAudit ? checkPlanValues : (checkPlanValues && plan.leadAuditorValue));
  }

  onClearForm() {
    this.isClear = true;
    this.resetForm();
  }

  resetForm() {
    this.isParentAudit = false;
    this.auditPlanForm.reset({
      parentAudit: '',
      auditTitle: '',
      functions: '',
      templateValue: [],
      functionTemplateValue: [],
      startDateTime: '',
      endDateTime: '',
      leadAuditorValue: [],
      auditorValue: [],
      auditeesValue: [],
      cityName: '',
      countryName: '',
      auditScopeValue: ''
    });
    this.selectedTemplate = [];
    this.selectedAuditor = [];
    this.selectedAuditees = [];
    this.selectedTemplateOptions = 'Select templates..';
    this.selectedAuditorOptions = 'Select Auditors..';
    this.selectedAuditeesOptions = 'Select Auditees..';
  }

  openImportPlanDialog(): void {
    this.importVisibility();
    const dialogRef = this.dialog.open(ImportCreatePlanDialogComponent, {
      width: '654px',
      height: '464px',
      data: { id: 'GG196678' }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.router.navigate(['/auditPlan']);
      this.importVisibility();
      this.getPlanItems();
      this.changeDetectorRef.detectChanges();
      console.log(`Dialog result: ${result}`);
    });
  }

  openEditPlanDialog(planDetails: any): void {
    const dialogRef = this.dialog.open(EditPlanDialogComponent, {
      width: '654px',
      height: '472px',
      data: {
        'planDetails': planDetails,
        'auditees': this.auditees,
        'auditors': this.auditors
      }
    });

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result === 'success') {
        await this.getAllAuditPlan();
        this.router.navigate(['/auditPlan']);
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
      width: '500px',
      height: '480px',
      data: { id: audit_title }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.router.navigate(['/auditPlan']);
      this.getPlanItems();
      console.log(`Dialog result: ${result}`);
    });
  }

  templateToggleDropdown(event: any) {
    this.isAuditorOptionsOpen = false;
    this.isAuditeesOptionsOpen = false;
    event.stopPropagation();
    this.isTemplateOptionsOpen = !this.isTemplateOptionsOpen;
    if (!this.isTemplateDropdownOpened) {
      this.isTemplateDropdownOpened = true;
      this.templates = this.setCheckedOption(this.templates);
    }
  }

  auditorToggleDropdown(event: any) {
    this.isTemplateOptionsOpen = false;
    this.isAuditeesOptionsOpen = false;
    event.stopPropagation();
    this.isAuditorOptionsOpen = !this.isAuditorOptionsOpen;
    if (!this.isAuditorDropdownOpened) {
      this.isAuditorDropdownOpened = true;
      this.auditors = this.setCheckedOption(this.auditors);
    }
  }

  auditeesToggleDropdown(event: any) {
    this.isTemplateOptionsOpen = false;
    this.isAuditorOptionsOpen = false;
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
      await this.getAllAuditPlan();
    }
  }

  public navigateToAuditPerform() {
    localStorage.setItem('header', 'Audit Perform');
    this.router.navigate(['/auditPerform']);
  }

  async getAllAuditPlan() {
    const formattedDate: any = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd')!;
    const email: any = localStorage.getItem('user')?.toString() || '';
    try {
      const response: any = await firstValueFrom(this.audirService.getAllPlans(email, formattedDate));
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

  onFunctionTemplateDropdownClick(): void {
    this.isFunctionTemplateDropdownOpen = !this.isFunctionTemplateDropdownOpen;
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
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

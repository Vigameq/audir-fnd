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
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-audit-plan',
  templateUrl: './audit-plan.component.html',
  styleUrls: ['./audit-plan.component.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuditPlanComponent {
  @ViewChild('templateDropdown', { static: false }) templateDropdown!: ElementRef;

  auditPlanForm: FormGroup = new FormGroup({
    linkAudit: new FormControl(''),
    auditTitle: new FormControl(''),
    functions: new FormControl(''),
    templateValue: new FormControl(''),
    functionTemplateValue: new FormControl(''),
    startDateTime: new FormControl(''),
    endDateTime: new FormControl(''),
    auditorValue: new FormControl([]),
    auditeesValue: new FormControl([]),
    cityName: new FormControl(''),
    countryName: new FormControl(''),
    auditScopeValue: new FormControl('')
  });
  isAuditorDropdownOpen = false;
  cities = ["Amaravati", "Bengaluru", "Bhopal", "Bhubaneswar", "Chandigarh", "Chennai", "Dehradun", "Gandhinagar", "Gangtok", "Hyderabad", "Jaipur", "Kolkata", "Lucknow", "Mumbai", "Panaji", "Patna", "Raipur", "Ranchi", "Shillong", "Shimla", "Thiruvananthapuram"];
  countries = ["India"];
  selectedTemplate: string[] = [];
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

  constructor(private datePipe: DatePipe, private formBuilder: FormBuilder, private audirService: AudirService, private dialog: MatDialog, private router: Router, private changeDetectorRef: ChangeDetectorRef) {
  }

  async ngOnInit(): Promise<void> {
    this.isImportVisible = true;
    // this.showAllPlans = (this.auditPlans.length <= 4) ? true : false;
    this.auditPlanForm = this.formBuilder.group(
      {
        linkAudit: [''],
        auditTitle: ['', Validators.required],
        functions: [''],
        templateValue: ['', Validators.required],
        functionTemplateValue: ['', Validators.required],
        startDateTime: ['', Validators.required],
        endDateTime: ['', Validators.required],
        auditorValue: [[], Validators.required],
        auditeesValue: [[], Validators.required],
        cityName: ['', Validators.required],
        countryName: ['', Validators.required],
        auditScopeValue: ['', Validators.required]
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

  onTemplateSelectionChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    // const currentValue = this.auditPlanForm.get('auditorValue')?.value;
    if (!this.selectedTemplate.includes(checkbox.value)) {
      if (checkbox.checked) {
        this.selectedTemplate.push(checkbox.value);
      } else {
        this.selectedTemplate = this.selectedTemplate.filter(option => option !== checkbox.value);
      }
      this.auditPlanForm.get('auditorValue')?.setValue(this.selectedTemplate);
    }
  }

  onSubmit() {
    if (this.auditPlanForm) {
      const plan: Audit = {
        link_audit: this.auditPlanForm.value?.linkAudit ? this.auditPlanForm.value?.linkAudit : null,
        audit_title: this.auditPlanForm.value?.auditTitle,
        functions: this.auditPlanForm.value?.functions,
        template: this.selectedTemplate,
        function_template: this.auditPlanForm.value?.functionTemplateValue,
        start_date: this.auditPlanForm.value?.startDateTime,
        end_date: this.auditPlanForm.value?.endDateTime,
        auditors: [this.auditPlanForm.value?.auditorValue],
        auditees: [this.auditPlanForm.value?.auditeesValue],
        city: this.auditPlanForm.value?.cityName,
        country: this.auditPlanForm.value?.countryName,
        audit_scope: this.auditPlanForm.value?.auditScopeValue,
        audit_type: "ISO 270015",
        eMail: localStorage.getItem('user')?.toString() || ''
      }
      if (plan.audit_title && plan.functions && plan.start_date && plan.end_date && plan.audit_scope) {
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

  onClearForm() {
    this.isClear = true;
    this.resetForm();
  }

  resetForm() {
    this.auditPlanForm.reset({
      linkAudit: [''],
      auditTitle: [''],
      functions: [''],
      templateValue: [''],
      functionTemplateValue: [''],
      startDateTime: [''],
      endDateTime: [''],
      auditorValue: [[]],
      auditeesValue: [[]],
      cityName: [''],
      countryName: [''],
      auditScopeValue: ['']
    });
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

  toggleDropdown(event: any) {
    event.stopPropagation();
    this.isAuditorDropdownOpen = !this.isAuditorDropdownOpen;
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


  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const dropdownMenuElement = this.templateDropdown?.nativeElement;
    if (dropdownMenuElement && !dropdownMenuElement.contains(event.target as Node)) {
      this.isAuditorDropdownOpen = false;
    }
  }
}

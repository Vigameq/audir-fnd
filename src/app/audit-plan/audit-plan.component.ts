import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { IgxCalendarComponent, IgxDialogComponent, IgxCalendarView, IViewDateChangeEventArgs } from 'igniteui-angular';
import { Audit } from 'src/model/audit.model';
import { AudirService } from 'src/services/audir-services.service';
import { AuditPlanSuccessPopupComponent } from './audit-plan-success-popup/audit-plan-success-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ImportCreatePlanDialogComponent } from './import-create-plan-dialog/import-create-plan-dialog.component';
import { EditPlanDialogComponent } from './edit-plan-dialog/edit-plan-dialog.component';

@Component({
  selector: 'app-audit-plan',
  templateUrl: './audit-plan.component.html',
  styleUrls: ['./audit-plan.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuditPlanComponent {
  startDate: Date = new Date(2025, 2, 6);
  endDate: Date = new Date(2025, 2, 10);
  @ViewChild('calendar', { static: true }) public calendar?: IgxCalendarComponent;
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
  selectedOptions: string[] = [];
  parent_audits: any[] = [];
  templates: any[] = [];
  auditees: any[] = [];
  auditors: any[] = [];
  isImportVisible: boolean = true;
  showAllPlans: boolean = false;
  auditPlans: any = [{
    date: '06 May',
    audit_title: 'gadi1',
    id: 'gg00891',
    auditors: 'gowtham'
  },
  {
    date: '06 May',
    audit_title: 'gadi1',
    id: 'gg00891',
    auditors: 'gowtham'
  },
  {
    date: '06 May',
    audit_title: 'gadi1',
    id: 'gg00891',
    auditors: 'gowtham'
  },
  {
    date: '06 May',
    audit_title: 'gadi1',
    id: 'gg00891',
    auditors: 'gowtham'
  },
  {
    date: '06 May',
    audit_title: 'gadi1',
    id: 'gg00891',
    auditors: 'gowtham'
  },
  {
    date: '06 May',
    audit_title: 'gadi1',
    id: 'gg00891',
    auditors: 'gowtham'
  },
  {
    date: '06 May',
    audit_title: 'gadi1',
    id: 'gg00891',
    auditors: 'gowtham'
  },
  {
    date: '06 May',
    audit_title: 'gadi1',
    id: 'gg00891',
    auditors: 'gowtham'
  },
  {
    date: '06 May',
    audit_title: 'gadi1',
    id: 'gg00891',
    auditors: 'gowtham'
  },
  {
    date: '06 May',
    audit_title: 'gadi1',
    id: 'gg00891',
    auditors: 'gowtham'
  },
  {
    date: '06 May',
    audit_title: 'gadi1-dfghj',
    id: 'gg00891',
    auditors: 'gowtham and more'
  }];
  selectedDate: Date | undefined;
  isClear: boolean = false;

  constructor(private formBuilder: FormBuilder, private audirService: AudirService, private dialog: MatDialog, private router: Router, private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.isImportVisible = true;
    this.showAllPlans = (this.auditPlans.length <= 4) ? true : false;
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
    })
  }

  onAuditorSelectionChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    // const currentValue = this.auditPlanForm.get('auditorValue')?.value;
    if (checkbox.checked) {
      this.selectedOptions.push(checkbox.value);
    } else {
      this.selectedOptions = this.selectedOptions.filter(option => option !== checkbox.value);
    }
    this.auditPlanForm.get('auditorValue')?.setValue(this.selectedOptions);
  }

  onSubmit() {
    if (this.auditPlanForm) {
      const plan: Audit = {
        link_audit: this.auditPlanForm.value?.linkAudit ? this.auditPlanForm.value?.linkAudit : null,
        audit_title: this.auditPlanForm.value?.auditTitle,
        functions: this.auditPlanForm.value?.functions,
        template: this.auditPlanForm.value?.templateValue,
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
      if (plan.audit_title && plan.functions  && plan.start_date && plan.end_date && plan.audit_scope) {
        this.audirService.createAuditPlan(plan).subscribe(response => {
          if (response) {
            this.resetForm();
            this.openSuccessDialog(plan.audit_title);
            this.selectedDate = undefined;
          } else {
            this.audirService.showError('Failed to create audit plan');

          }
        }, (error: any) => {
          this.audirService.showError('Failed to create audit plan');
          console.error('Error for creation of audit plan:', error);
        }
        )
      } else {
        if(!this.isClear)this.audirService.showError('Please enter mandatory (*) fields');
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

  onDateChange(){
    this.selectedDate = new Date(this.auditPlanForm.value.startDateTime);
    
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

  openEditPlanDialog(): void {
    const dialogRef = this.dialog.open(EditPlanDialogComponent, {
      width: '654px',
      height: '576px',
      data: { id: 'GG196678' }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.router.navigate(['/auditPlan']);
      this.getPlanItems();
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

  toggleDropdown() {
    this.isAuditorDropdownOpen = !this.isAuditorDropdownOpen;
  }

  public onSelection(dates: Date | Date[]) {
    const logger: HTMLElement = document.querySelector('.logger')!;
    dates = dates as Date[];
    logger.innerHTML = `<span> => 'onSelectionChanged': ${dates.length} dates selected.<br>${logger.innerHTML}`;
  }

  public viewDateChanged(event: IViewDateChangeEventArgs) {
    const logger: HTMLElement = document.querySelector('.logger')!;
    const eventArgs = `event.previousValue: ${this.parseDate(event.previousValue)} | event.currentValue: ${this.parseDate(event.currentValue)}`;
    logger.innerHTML = `<span> => 'viewDateChanged': ${eventArgs}</span><br>${logger.innerHTML}`;
  }

  private parseDate(date: Date) {
    const monthFormatter = new Intl.DateTimeFormat('en', { month: 'long' });
    return `${monthFormatter.format(date)} ${date.getFullYear()}`;
  }

  public navigateToAuditPerform() {
    localStorage.setItem('header', 'Audit Perform');
    this.router.navigate(['/auditPerform']);
  }
}

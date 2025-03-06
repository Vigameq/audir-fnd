import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { IgxCalendarComponent, IgxDialogComponent, IgxCalendarView, IViewDateChangeEventArgs } from 'igniteui-angular';

@Component({
  selector: 'app-audit-plan',
  templateUrl: './audit-plan.component.html',
  styleUrls: ['./audit-plan.component.scss']
})
export class AuditPlanComponent {
  @ViewChild('calendar', { static: true }) public calendar?: IgxCalendarComponent;
  @ViewChild('alert', { static: true }) public dialog?: IgxDialogComponent;
  public loggerHeader = `Interact with the calendar to see the events logged here in sequence:`;

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
  availableOptions = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 2', 'Option 3', 'Option 4'];
  availableOptions1 = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 2', 'Option 3', 'Option 4'];

  selectedOptions: string[] = [];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.auditPlanForm = this.formBuilder.group(
      {
        linkAudit: ['', Validators.required],
        auditTitle: ['', Validators.required],
        functions: ['', Validators.required],
        templateValue: ['', Validators.required],
        functionTemplateValue: ['', Validators.required],
        startDateTime: ['', Validators.required],
        endDateTime: ['', Validators.required],
        auditorValue: [[], Validators.required],
        auditeesValue: [[], Validators.required],
        cityName: ['', Validators.required],
        countryName: ['', Validators.required],
        auditScopeValue: ['', Validators.required]
      }

    );

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
}

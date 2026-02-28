import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostListener, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AudirService } from '../../services/audir-services.service';

@Component({
  selector: 'app-findings-management',
  templateUrl: './findings-management.component.html',
  providers: [DatePipe],
  styleUrls: ['./findings-management.component.scss']
})
export class FindingsManagementComponent {
  @ViewChild('auditeesDropdown', { static: false }) auditeesDropdown!: ElementRef;
  searchQuery: string = '';
  updateAuditee = 'Update Auditee';
  downloadEvidence = 'Download Evidence';
  auditees: any;
  auditeesList: any;
  @ViewChildren('detailsContent') detailsContentElements!: QueryList<ElementRef>;
  @ViewChild('auditeeDropdown') auditeeDropdown: ElementRef | undefined;
  auditList!: any;
  CompleteAuditList!: any;
  auditeeSelectedValue: any;
  fromDate: any;
  toDate: any;
  utcToday: any;
  utcTomorrow: any;
  selectedAuditeesOptions: any;
  isAuditeesOptionsOpen!: boolean[];
  isAuditeesDropdownOpened!: boolean[];
  selectedAuditees: any = [];
  selectedAuditeesEmail: any;
  isSvgDisabled = true;

  constructor(private renderer: Renderer2, private audirService: AudirService, private datePipe: DatePipe) {
    this.resetDateFilter();
  }

  ngOnInit() {
    this.getPlanItems();

  }

  getNCAuditLists(fromDate: string, toDate: string) {
    const email = localStorage.getItem('user')?.toString() || '';
    var payload = {
      eMail: email,
      start_date_filter: {
        from: fromDate,
        to: toDate
      },
      status_filter: ["inprogress", "nc_inprogress", "completed","submitted"]
    };

    this.audirService.getNCAuditLists(payload).subscribe((response: any) => {
      if (response) {
        this.CompleteAuditList = response.audit_data;
        this.auditList = this.CompleteAuditList;
        this.auditeesList = Array.from({ length: this.auditList.length }, (_) => ({
          auditees: this.auditees
        }));
        this.setAuditeeValues();
      }
    }, (error: any) => {
      console.error('Error for getting audits:', error);
    });
  }

  setAuditeeValues() {
    if (this.auditList && this.auditList.length > 0) {
      this.selectedAuditees = Array.from({ length: this.auditList.length }, () => []);
      this.selectedAuditeesOptions = Array.from({ length: this.auditList.length }, () => '');
      this.selectedAuditeesEmail = Array.from({ length: this.auditList.length }, () => '');
      this.isAuditeesOptionsOpen = Array.from({ length: this.auditList.length }, () => false);
      this.isAuditeesDropdownOpened = Array.from({ length: this.auditList.length }, () => false);
      this.auditList.forEach((audit: any, auditIndex: number) => {
        this.auditeesList[auditIndex].auditees = this.setCheckedOption(this.auditeesList[auditIndex].auditees);
        this.selectedOptionValuesChecked(audit.auditees, auditIndex);
        this.selectedAuditees[auditIndex] = this.selectedOptionNames(audit.auditees);
        this.selectedAuditeesOptions[auditIndex] = this.selectedAuditees[auditIndex].length > 0 ? this.selectedAuditees[auditIndex].join(', ') : 'Select Auditee..';
        this.selectedAuditeesEmail[auditIndex] = this.selectedOptionEmails(audit.auditees);
      });
    }
  }

  selectedOptionNames(options: any) {
    if (options)
      return (options.map((options: any) => options.name));
    else {
      return [];
    }
  }

  selectedOptionValuesChecked(selectedValues: any, auditIndex: any) {
    this.auditeesList[auditIndex].auditees.forEach((user: any, index: any) => {
      if (selectedValues.find((selectedUser: any) => selectedUser.email === user.email)) {
        this.auditeesList[auditIndex].auditees[index] = {
          ...this.auditeesList[auditIndex].auditees[index],
          checked: true
        };
      }
    });
  }

  selectedOptionEmails(options: any) {
    if (options)
      return (options.map((options: any) => options.email));
    else {
      return [];
    }
  }

  setCheckedOption(optionsList: any) {
    if (!Array.isArray(optionsList)) {
      return [];
    }
    return optionsList.map((objectValue: any) => ({
      ...objectValue,
      checked: false
    }));
  }

  onSearch() {
    if (this.searchQuery !== '') {
      this.auditList = this.CompleteAuditList.filter((audit: any) =>
        audit.audit_title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.auditList = this.CompleteAuditList;
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.auditList = this.CompleteAuditList;
  }

  updatePlanWithNewAssignee(auditPerformItem:any,audit: any, index: number) {
    const updatedAuditPlan: any = {
      'audit_id': audit.audit_id,
      'start_date': audit.start_date,
      'end_date': audit.end_date,
      'auditors': audit.auditors.map((auditor: any) => auditor.email),
      'auditees': this.selectedAuditeesEmail[index],
      'city': audit.city,
      'country': audit.country,
      "lead_auditor": auditPerformItem.lead_auditor,
      "link_audit": audit.link_audit,
      "template": audit.template,
      "function_template": audit.function_template,
      'audit_type': audit.audit_type
    };
    this.audirService.updateAuditPlan(updatedAuditPlan).subscribe((response: any) => {
      if (response) {
        this.isSvgDisabled = true;
        this.audirService.showSuccess(response.message);
        this.getNCAuditLists(this.fromDate, this.toDate);
      } else {
        this.audirService.showError('Failed to update audit plan');
      }
    }, (error: any) => {
      this.audirService.showError('Failed to update audit plan');
      console.error('Error for updating audit plan:', error);
    });
  }

  getPlanItems() {
    const email = localStorage.getItem('user')?.toString() || '';
    this.audirService.getPlanItems(email).subscribe((items: any) => {
      if (items) {
        this.auditees = items.users.auditees;
        this.getNCAuditLists(this.fromDate, this.toDate);
      }
    }, (error: any) => {
      console.error('Error for getting plans:', error);
    });
  }

  onDateChange() {
    this.fromDate = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd');
    if (this.fromDate >= this.toDate) {
      this.toDate = new Date(this.fromDate);
      this.toDate.setDate(this.toDate.getDate() + 1);
    }
    this.toDate = this.datePipe.transform(this.toDate, 'yyyy-MM-dd');
    localStorage.setItem('findingsFromDate', this.fromDate);
    localStorage.setItem('findingsToDate', this.toDate);
    this.getNCAuditLists(this.fromDate, this.toDate);
  }

  resetDateFilter(resetValue?: boolean) {
    this.fromDate = localStorage.getItem('findingsFromDate');
    this.toDate = localStorage.getItem('findingsToDate');
    if (resetValue || this.fromDate === null || this.toDate === null || this.fromDate === undefined || this.toDate === undefined) {
      const now = new Date();
      this.utcToday = new Date(Date.UTC(now.getUTCFullYear() - 10, now.getUTCMonth(), now.getUTCDate()));
      this.utcTomorrow = new Date(Date.UTC(now.getUTCFullYear() + 10, now.getUTCMonth(), now.getUTCDate()));
      this.fromDate = this.utcToday.toISOString().substring(0, 10);
      this.toDate = this.utcTomorrow.toISOString().substring(0, 10);
      localStorage.setItem('findingsFromDate', this.fromDate);
      localStorage.setItem('findingsToDate', this.toDate);
    }
    this.getNCAuditLists(this.fromDate, this.toDate);
  }

  showAuditors(auditorOptions: any) {
    const names = this.extractAuditorNames(auditorOptions);
    return names.join(', ');
  }

  private extractAuditorNames(auditorOptions: any): string[] {
    if (!auditorOptions) {
      return [];
    }
    if (Array.isArray(auditorOptions)) {
      return auditorOptions
        .map((auditor: any) => {
          if (typeof auditor === 'string') return auditor.trim();
          if (auditor && typeof auditor === 'object') return (auditor.name || auditor.Name || auditor.email || '').toString().trim();
          return '';
        })
        .filter((name: string) => name.length > 0);
    }
    if (typeof auditorOptions === 'string') {
      return auditorOptions
        .split(',')
        .map((name: string) => name.trim())
        .filter((name: string) => name.length > 0);
    }
    return [];
  }

  auditeesToggleDropdown(event: any, index: any) {
    event.stopPropagation();
    this.isAuditeesOptionsOpen = this.isAuditeesOptionsOpen.map((open: any, i: any) => i === index ? !open : false);
    if (!this.isAuditeesDropdownOpened[index]) {
      this.isAuditeesDropdownOpened[index] = true;
    }
    else {
      this.isAuditeesDropdownOpened[index] = false;
    }

  }

  onCheckboxClick(event: Event) {
    event.stopPropagation();
  }

  onAuditeeSelectionChange(event: Event, auditIndex: any, auditeesIndex: any, auditee: any) {
    const checkbox = event.target as HTMLInputElement;
    this.isSvgDisabled = false;
    if (!this.selectedAuditees[auditIndex].includes(checkbox.value)) {
      if (checkbox.checked) {
        this.selectedAuditees[auditIndex].push(checkbox.value);
        this.selectedAuditeesEmail[auditIndex].push(auditee.email);
        this.auditeesList[auditIndex].auditees[auditeesIndex] = {
          ...this.auditeesList[auditIndex].auditees[auditeesIndex],
          checked: true
        };
      }
    }
    else {
      this.selectedAuditees[auditIndex] = this.selectedAuditees[auditIndex].filter((option: any) => option !== checkbox.value);
      this.selectedAuditeesEmail[auditIndex] = this.selectedAuditeesEmail[auditIndex].filter((option: any) => option !== auditee.email);
      this.auditeesList[auditIndex].auditees[auditeesIndex] = {
        ...this.auditeesList[auditIndex].auditees[auditeesIndex],
        checked: false
      };
    }
    this.selectedAuditeesOptions[auditIndex] = this.selectedAuditees[auditIndex].length > 0 ? this.selectedAuditees[auditIndex].join(', ') : 'Select Auditee..';
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    this.isAuditeesDropdownOpened = this.isAuditeesDropdownOpened?.map(() => false);
    this.isAuditeesOptionsOpen = this.isAuditeesOptionsOpen?.map(() => false);
  }

}

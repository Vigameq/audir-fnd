import { DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { AudirService } from 'src/services/audir-services.service';
import { EditPlanDialogComponent } from '../audit-plan/edit-plan-dialog/edit-plan-dialog.component';

@Component({
  selector: 'app-audit-manage',
  templateUrl: './audit-manage.component.html',
  styleUrls: ['./audit-manage.component.scss']
})
export class AuditManageComponent {
  @ViewChild('auditeesDropdown', { static: false }) auditeesDropdown!: ElementRef;
  searchQuery: string = '';
  updateAuditee = 'Update Auditee';
  auditees: any;
  auditors: any;
  parent_audits: any;
  subAuditAuditees: any;
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
  functionTemplates: any[] = [];
  isAuditor = false;

  constructor(private audirService: AudirService, private datePipe: DatePipe, private dialog: MatDialog) {
    this.isAuditor = ((JSON.parse(localStorage.getItem('userDetails') as any))?.role === 'Auditor');
    this.resetDateFilter();
  }

  ngOnInit() {
    this.getPlanItems();
  }

  getAuditLists(fromDate: string, toDate: string) {
    const email = localStorage.getItem('user')?.toString() || '';
    var payload = {
      eMail: email,
      start_date_filter: {
        from: fromDate,
        to: toDate
      },
      status_filter: ["created", "inprogress", "submitted"]
    };

    this.audirService.getAuditLists(payload).subscribe((response: any) => {
      if (response) {
        this.CompleteAuditList = response.audit_data;
        this.auditList = this.filterAuditList(this.CompleteAuditList);
      }
    }, (error: any) => {
      console.error('Error for getting audits:', error);
    });

    this.auditList = this.auditList?.map((obj: any) => {
      obj.isSubAuditsOpened = false;
      return obj;
    });
  }

  filterAuditList(list: any[]) {
    const email = localStorage.getItem('user')?.toString().toLowerCase() || '';
    const query = (this.searchQuery || '').trim().toLowerCase();
    const from = this.fromDate;
    const to = this.toDate;

    const withinDate = (dateVal: any) => {
      if (!from || !to) {
        return true;
      }
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) {
        return true;
      }
      const fromDate = new Date(from);
      const toDate = new Date(to);
      return d >= fromDate && d <= toDate;
    };

    return (list || []).filter((audit: any) => {
      const status = (audit.audit_status || '').toString().toLowerCase();
      if (!['created', 'inprogress', 'submitted'].includes(status)) {
        return false;
      }
      const createdBy = (audit.email || '').toString().toLowerCase();
      const auditors = (audit.auditors || '').toString().toLowerCase();
      const auditees = (audit.auditees || '').toString().toLowerCase();
      const isMine = createdBy === email || auditors.includes(email) || auditees.includes(email);
      if (!isMine) {
        return false;
      }
      if (!withinDate(audit.start_date)) {
        return false;
      }
      if (!query) {
        return true;
      }
      const title = (audit.audit_title || '').toString().toLowerCase();
      return title.includes(query);
    });
  }

  getAllAudits() {
    this.getAuditLists(this.fromDate, this.toDate);
  }

  openSubAudits(subAudits: any, index: any) {
    this.auditList[index].isSubAuditsOpened = !this.auditList[index].isSubAuditsOpened;
    if (this.auditList[index].isSubAuditsOpened) {
      this.subAuditAuditees = Array.from({ length: this.auditList[index].sub_audits.length }, (_) => ({
        auditees: this.auditees
      }));
      const auditIds = subAudits.map((item: { audit_id: any; }) => ({ audit_id: item.audit_id }));
      const requests = auditIds.map((id: any) =>
        this.audirService.getAuditCompletionPercentage(id)
      );
      forkJoin(requests).subscribe({
        next: (responses: any) => {
          this.auditList[index].sub_audits.forEach((audit: any) => {
            responses.forEach((res: any) => {
              if (audit.audit_id === res.audit_id) {
                audit["completion_percent"] = res.completion_percent;
              }
            })
          })
        },
        error: (err) => {
          console.error('Error fetching audit data', err);
        }
      });
      this.auditList[index].sub_audits = this.auditList[index].sub_audits.map((obj: any) => {
        obj.lineHeight = 0;
        return obj;
      });
      this.updateLineHeights(index);
      this.setAuditeeValues(index);
    }
  }

  setAuditeeValues(auditIndex: any) {
    if (this.auditList[auditIndex] && this.auditList[auditIndex].sub_audits.length > 0) {
      this.selectedAuditees = Array.from({ length: this.auditList[auditIndex].sub_audits.length }, () => []);
      this.selectedAuditeesOptions = Array.from({ length: this.auditList[auditIndex].sub_audits.length }, () => '');
      this.selectedAuditeesEmail = Array.from({ length: this.auditList[auditIndex].sub_audits.length }, () => '');
      this.isAuditeesOptionsOpen = Array.from({ length: this.auditList[auditIndex].sub_audits.length }, () => false);
      this.isAuditeesDropdownOpened = Array.from({ length: this.auditList[auditIndex].sub_audits.length }, () => false);
      this.auditList[auditIndex].sub_audits.forEach((subAudit: any, subAuditIndex: number) => {
        this.subAuditAuditees[subAuditIndex].auditees = this.setCheckedOption(this.subAuditAuditees[subAuditIndex].auditees);
        this.selectedOptionValuesChecked(subAudit.auditees, subAuditIndex);
        this.selectedAuditees[subAuditIndex] = this.selectedOptionNames(subAudit.auditees);
        this.selectedAuditeesOptions[subAuditIndex] = this.selectedAuditees[subAuditIndex].length > 0 ? this.selectedAuditees[subAuditIndex].join(', ') : 'Select Auditee..';
        this.selectedAuditeesEmail[subAuditIndex] = this.selectedOptionEmails(subAudit.auditees);
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

  selectedOptionValuesChecked(selectedValues: any, subAuditIndex: any) {
    this.subAuditAuditees[subAuditIndex].auditees.forEach((user: any, index: any) => {
      if (selectedValues.find((selectedUser: any) => selectedUser.email === user.email)) {
        this.subAuditAuditees[subAuditIndex].auditees[index] = {
          ...this.subAuditAuditees[subAuditIndex].auditees[index],
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
    return optionsList.map((objectValue: any) => {
      objectValue.checked = false;
      return objectValue;
    });
  }

  updateLineHeights(auditIndex: any) {
    setTimeout(() => {
      this.detailsContentElements.forEach((element, index) => {
        this.updateLineHeight(auditIndex, index, element.nativeElement);
      });
    }, 100);
  }

  updateLineHeight(auditIndex: any, index: number, statusContent: HTMLElement) {
    const subAudit: any = this.auditList[auditIndex].sub_audits;
    let newLineHeight: any;
    if (index <= subAudit.length) {
      if (this.auditList[auditIndex].sub_audits[index].city === '' || this.auditList[auditIndex].sub_audits[index].functions === '') {
        newLineHeight = index === 0 ? statusContent.offsetHeight - 46 : statusContent.offsetHeight + 16;
        if (this.auditList[auditIndex].sub_audits[index].functions === '') {
          newLineHeight = index === 0 ? statusContent.offsetHeight - 26 : statusContent.offsetHeight + 36;
        }
      }
      else {
        newLineHeight = index === 0 ? statusContent.offsetHeight - 66 : statusContent.offsetHeight - 4;
      }
      if (subAudit.lineHeight !== newLineHeight) {
        this.auditList[auditIndex].sub_audits[index].lineHeight = newLineHeight;
      }
    }
  }

  onSearch() {
    if (this.searchQuery !== '') {
      this.auditList = this.CompleteAuditList.filter((audit: any) =>
        audit.audit_title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.auditList = this.filterAuditList(this.CompleteAuditList);
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.auditList = this.filterAuditList(this.CompleteAuditList);
  }

  updatePlanWithNewAssignee(sub_audit: any, index: number) {
    const updatedAuditPlan: any = {
      'audit_id': sub_audit.audit_id,
      'start_date': sub_audit.start_date,
      'end_date': sub_audit.end_date,
      'auditors': sub_audit.auditors.map((auditor: any) => auditor.email),
      'auditees': this.selectedAuditeesEmail[index],
      'city': sub_audit.city,
      'country': sub_audit.country,
      'audit_type': sub_audit.audit_type
    };
    this.audirService.updateAuditPlan(updatedAuditPlan).subscribe((response: any) => {
      if (response) {
        this.isSvgDisabled = true;
        this.audirService.showSuccess(response.message);
        this.getAllAudits();
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
        this.parent_audits = items.parent_audits;
        this.auditees = items.users.auditees;
        this.auditors = items.users.auditors;
        this.functionTemplates = items.templates.map((template: any) => ({ ...template }));
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
    localStorage.setItem('performFromDate', this.fromDate);
    localStorage.setItem('performToDate', this.toDate);
    this.getAllAudits();
  }

  resetDateFilter(resetValue?: boolean) {
    this.fromDate = localStorage.getItem('performFromDate');
    this.toDate = localStorage.getItem('performToDate');
    if (resetValue || this.fromDate === null || this.toDate === null || this.fromDate === undefined || this.toDate === undefined) {
      const now = new Date();
      this.utcToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      this.utcTomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
      this.fromDate = this.utcToday.toISOString().substring(0, 10);
      this.toDate = this.utcTomorrow.toISOString().substring(0, 10);
      localStorage.setItem('performFromDate', this.fromDate);
      localStorage.setItem('performToDate', this.toDate);
    }
    this.getAllAudits();
  }

  showAuditors(auditorOptions: any) {
    if (auditorOptions) {
      return ((auditorOptions.map((auditor: any) => auditor.name)).join(', '));
    }
    return
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

  openEditPlanDialog(planDetails: any): void {
    const dialogRef = this.dialog.open(EditPlanDialogComponent, {
      autoFocus: false,
      disableClose: true,
      width: '654px',
      height: '658px',
      data: {
        'planDetails': planDetails,
        'auditees': this.auditees,
        'auditors': this.auditors,
        'functionTemplates': this.functionTemplates,
        'parent_audits': this.parent_audits
      }
    });
  }

  onAuditeeSelectionChange(event: Event, subAuditIndex: any, auditeesIndex: any, auditee: any) {
    const checkbox = event.target as HTMLInputElement;
    this.isSvgDisabled = false;
    if (!this.selectedAuditees[subAuditIndex].includes(checkbox.value)) {
      if (checkbox.checked) {
        this.selectedAuditees[subAuditIndex].push(checkbox.value);
        this.selectedAuditeesEmail[subAuditIndex].push(auditee.email);
        this.subAuditAuditees[subAuditIndex].auditees[auditeesIndex] = {
          ...this.subAuditAuditees[subAuditIndex].auditees[auditeesIndex],
          checked: true
        };
      }
    }
    else {
      this.selectedAuditees[subAuditIndex] = this.selectedAuditees[subAuditIndex].filter((option: any) => option !== checkbox.value);
      this.selectedAuditeesEmail[subAuditIndex] = this.selectedAuditeesEmail[subAuditIndex].filter((option: any) => option !== auditee.email);
      this.subAuditAuditees[subAuditIndex].auditees[auditeesIndex] = {
        ...this.subAuditAuditees[subAuditIndex].auditees[auditeesIndex],
        checked: false
      };
    }
    this.selectedAuditeesOptions[subAuditIndex] = this.selectedAuditees[subAuditIndex].length > 0 ? this.selectedAuditees[subAuditIndex].join(', ') : 'Select Auditee..';
  }

  @HostListener('document:click', ['$event'])
  getParentAuditStatus(audit: any) {
    const subAudits = Array.isArray(audit?.sub_audits) ? audit.sub_audits : [];
    if (!subAudits.length) {
      return audit?.audit_status || '';
    }
    if (subAudits.some((item: any) => item.audit_status === 'inprogress')) {
      return 'inprogress';
    }
    if (subAudits.some((item: any) => item.audit_status === 'submitted')) {
      return 'submitted';
    }
    if (subAudits.some((item: any) => item.audit_status === 'created')) {
      return 'created';
    }
    return audit?.audit_status || '';
  }

  onClickOutside(event: MouseEvent) {
    this.isAuditeesDropdownOpened = this.isAuditeesDropdownOpened?.map(() => false);
    this.isAuditeesOptionsOpen = this.isAuditeesOptionsOpen?.map(() => false);
  }

}

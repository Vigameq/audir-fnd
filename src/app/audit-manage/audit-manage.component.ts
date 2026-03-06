import { DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, forkJoin, of } from 'rxjs';
import { AudirService } from 'src/services/audir-services.service';
import { EditPlanDialogComponent } from '../audit-plan/edit-plan-dialog/edit-plan-dialog.component';
import { AuthService } from '../auth.service';

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
  isManager = false;
  isAuditee = false;
  private readonly manageFromDateKey = 'manageFromDate';
  private readonly manageToDateKey = 'manageToDate';

  constructor(private audirService: AudirService, private datePipe: DatePipe, private dialog: MatDialog, private authService: AuthService) {
    const role = this.authService.getCurrentRole();
    this.isAuditor = role === 'Auditor';
    this.isManager = role === 'Manager';
    this.isAuditee = role === 'Auditee';
    this.resetDateFilter();
  }

  ngOnInit() {
    this.getPlanItems();
  }

  private normalizeStatus(status: any): string {
    return (status || '').toString().trim().toLowerCase().replace(/\s+/g, '_');
  }

  getAuditLists(fromDate: string, toDate: string) {
    const email = localStorage.getItem('user')?.toString() || '';
    var payload = {
      eMail: email,
      start_date_filter: {
        from: fromDate,
        to: toDate
      },
      status_filter: ["created", "initiated", "inprogress", "in_progress", "submitted", "completed", "closed"]
    };

    const relativeAudits$ = this.audirService.getAuditLists(payload).pipe(catchError(() => of({ audit_data: [] })));
    const managerCreatedAudits$ = this.isManager
      ? this.audirService.listAllAudits({ eMail: email }).pipe(catchError(() => of({ audit_data: [] })))
      : of({ audit_data: [] });
    const managerPlanItems$ = this.isManager
      ? this.audirService.getPlanItems(email).pipe(catchError(() => of({ parent_audits: [] })))
      : of({ parent_audits: [] });

    forkJoin([relativeAudits$, managerCreatedAudits$, managerPlanItems$]).subscribe(([relativeResponse, allResponse, planItemsResponse]: any[]) => {
      const relativeList = this.extractAuditData(relativeResponse);
      const allList = this.extractAuditData(allResponse);
      const planItemsList = Array.isArray(planItemsResponse?.parent_audits) ? planItemsResponse.parent_audits : [];
      const currentEmail = (localStorage.getItem('user') || '').toString().toLowerCase();
      const managerOwned = allList.filter((audit: any) =>
        this.getAuditOwnerEmail(audit) === currentEmail
      );
      const managerOwnedFromPlanItems = planItemsList.map((audit: any) => this.normalizePlanItemAudit(audit));
      this.CompleteAuditList = this.mergeAuditsById([...relativeList, ...managerOwned, ...managerOwnedFromPlanItems]);
      this.auditList = this.filterAuditList(this.CompleteAuditList);
    }, (error: any) => {
      console.error('Error for getting audits:', error);
    });

    this.auditList = this.auditList?.map((obj: any) => {
      obj.isSubAuditsOpened = false;
      return obj;
    });
  }

  filterAuditList(list: any[]) {
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
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);
      return d >= fromDate && d <= toDate;
    };

    return (list || []).filter((audit: any) => {
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
    localStorage.setItem(this.manageFromDateKey, this.fromDate);
    localStorage.setItem(this.manageToDateKey, this.toDate);
    this.getAllAudits();
  }

  resetDateFilter(resetValue?: boolean) {
    this.fromDate = localStorage.getItem(this.manageFromDateKey);
    this.toDate = localStorage.getItem(this.manageToDateKey);
    if (resetValue || this.fromDate === null || this.toDate === null || this.fromDate === undefined || this.toDate === undefined) {
      const now = new Date();
      // Keep a wider default range in Manage so audits are visible on first load.
      const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 90));
      const to = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 90));
      this.fromDate = from.toISOString().substring(0, 10);
      this.toDate = to.toISOString().substring(0, 10);
      localStorage.setItem(this.manageFromDateKey, this.fromDate);
      localStorage.setItem(this.manageToDateKey, this.toDate);
    }
    this.getAllAudits();
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

  private extractUserEmails(userOptions: any): string[] {
    if (!userOptions) {
      return [];
    }
    if (Array.isArray(userOptions)) {
      return userOptions
        .map((user: any) => {
          if (typeof user === 'string') {
            return user.trim().toLowerCase();
          }
          if (user && typeof user === 'object') {
            return (user.email || user.eMail || '').toString().trim().toLowerCase();
          }
          return '';
        })
        .filter((email: string) => !!email);
    }
    if (typeof userOptions === 'string') {
      return userOptions
        .split(',')
        .map((email: string) => email.trim().toLowerCase())
        .filter((email: string) => !!email);
    }
    return [];
  }

  private mergeAuditsById(audits: any[]): any[] {
    const byId = new Map<string, any>();
    (audits || []).forEach((audit: any) => {
      const key = (audit?.audit_id ?? audit?.id ?? '').toString();
      if (!key) {
        return;
      }
      if (!byId.has(key)) {
        byId.set(key, audit);
      }
    });
    return Array.from(byId.values());
  }

  private extractAuditData(response: any): any[] {
    if (Array.isArray(response?.audit_data)) {
      return response.audit_data;
    }
    if (Array.isArray(response?.audits)) {
      return response.audits;
    }
    if (Array.isArray(response?.data)) {
      return response.data;
    }
    return [];
  }

  private getAuditOwnerEmail(audit: any): string {
    return (
      audit?.email
      || audit?.eMail
      || audit?.created_by
      || audit?.createdBy
      || ''
    ).toString().trim().toLowerCase();
  }

  private normalizePlanItemAudit(audit: any): any {
    return {
      ...audit,
      audit_id: audit?.audit_id ?? audit?.id,
      audit_title: audit?.audit_title || audit?.title || '',
      template: Array.isArray(audit?.template) ? audit.template : [],
      function_template: Array.isArray(audit?.function_template) ? audit.function_template : [],
      auditors: Array.isArray(audit?.auditors) ? audit.auditors : [],
      auditees: Array.isArray(audit?.auditees) ? audit.auditees : [],
      sub_audits: Array.isArray(audit?.sub_audits) ? audit.sub_audits : [],
      audit_status: audit?.audit_status || 'created',
      email: audit?.email || audit?.eMail || audit?.created_by || audit?.createdBy || ''
    };
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
    if (subAudits.some((item: any) => {
      const status = this.normalizeStatus(item.audit_status);
      return status === 'inprogress' || status === 'in_progress';
    })) {
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

  canEditAuditInManage(subAudit: any): boolean {
    return !!subAudit;
  }

  canDeleteAuditInManage(audit: any): boolean {
    return !this.isAuditee && !!audit;
  }

  onDeleteAudit(audit: any, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (!this.canDeleteAuditInManage(audit)) {
      return;
    }
    const auditTitle = (audit?.audit_title || 'this audit').toString();
    const confirmed = window.confirm(`Delete ${auditTitle}?`);
    if (!confirmed) {
      return;
    }
    const payload = {
      audit_id: audit?.audit_id,
      email: localStorage.getItem('user')?.toString() || ''
    };
    this.audirService.deleteAudit(payload).subscribe((response: any) => {
      if (response) {
        this.audirService.showSuccess(response.message || 'Audit deleted successfully');
        this.getAllAudits();
      } else {
        this.audirService.showError('Failed to delete audit');
      }
    }, (error: any) => {
      this.audirService.showError('Failed to delete audit');
      console.error('Error deleting audit:', error);
    });
  }

  onClickOutside(event: MouseEvent) {
    this.isAuditeesDropdownOpened = this.isAuditeesDropdownOpened?.map(() => false);
    this.isAuditeesOptionsOpen = this.isAuditeesOptionsOpen?.map(() => false);
  }

}

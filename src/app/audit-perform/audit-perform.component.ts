import { DatePipe } from '@angular/common';
import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { AudirService } from 'src/services/audir-services.service';

@Component({
  selector: 'app-audit-perform',
  templateUrl: './audit-perform.component.html',
  providers: [DatePipe],
  styleUrls: ['./audit-perform.component.scss']
})
export class AuditPerformComponent {
  searchQuery: string = '';
  // isStandardDropdownOpen: boolean = false;
  isAuditeeDropdownOpen: boolean = false;
  // standardDropdownOptions = ['options1', 'option2', 'option3'];
  auditeeDropdownOptions: any;
  // standardSelectedOption: string = '';
  @ViewChildren('detailsContent') detailsContentElements!: QueryList<ElementRef>;
  // @ViewChild('standardDropdown') standardDropdown: ElementRef | undefined;
  @ViewChild('auditeeDropdown') auditeeDropdown: ElementRef | undefined;
  auditList: any;
  auditeeSelectedValue: any = [];
  fromDate: any;
  toDate: any;
  utcToday: any;
  utcTomorrow: any;

  constructor(private renderer: Renderer2, private audirService: AudirService, private datePipe: DatePipe) {
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
      status_filter: ["completed", "created", "inprogress", "submitted"]
    };

    this.audirService.getAuditLists(payload).subscribe((response: any) => {
      if (response) {
        this.auditList = response.audit_data;
      }
    }, (error: any) => {
      console.error('Error for getting audits:', error);
    });

    this.auditList = this.auditList?.map((obj: any) => {
      obj.isSubAuditsOpened = false;
      return obj;
    });
  }

  openSubAudits(index: any) {
    this.auditList[index].isSubAuditsOpened = !this.auditList[index].isSubAuditsOpened;
    if (this.auditList[index].isSubAuditsOpened) {
      this.auditList[index].sub_audits = this.auditList[index].sub_audits.map((obj: any) => {
        obj.lineHeight = 0;
        return obj;
      });
      this.auditeeSelectedValue = Array.from({ length: this.auditList[index].sub_audits.length }, (_) => ({
        selectedValue: ''
      }));
      this.updateLineHeights(index);
    }
  }
  showQuestions() {

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
    if (index <= subAudit.length) {
      const newLineHeight = index === 0 ? statusContent.offsetHeight - 66 : statusContent.offsetHeight - 4;
      if (subAudit.lineHeight !== newLineHeight) {
        this.auditList[auditIndex].sub_audits[index].lineHeight = newLineHeight;
      }
    }
  }

  onSearch() {
    console.log('Search query:', this.searchQuery);
  }

  clearSearch() {
    this.searchQuery = '';
  }

  // onStandardOptionChange(event: Event) {
  //   const target = event.target as HTMLSelectElement;
  //   this.standardSelectedOption = target.value;
  // }

  // onStandardDropdownClick(): void {
  //   this.isStandardDropdownOpen = !this.isStandardDropdownOpen;
  // }

  onAuditeeDropdownClick() {
    this.isAuditeeDropdownOpen = !this.isAuditeeDropdownOpen;
  }

  onAuditeeOptionChange(sub_audit: any, index: number) {
    this.updatePlanWithNewAssignee(sub_audit, index);
  }

  updatePlanWithNewAssignee(sub_audit: any, index: number) {
    const updatedAuditPlan: any = {
      'audit_id': sub_audit.audit_id,
      'start_date': sub_audit.start_date,
      'end_date': sub_audit.end_date,
      'auditors': sub_audit.auditors,
      'auditees': [this.auditeeSelectedValue[index].selectedValue.email],
      'city': sub_audit.city,
      'country': sub_audit.country,
      'audit_type': sub_audit.audit_type
    };
    this.audirService.updateAuditPlan(updatedAuditPlan).subscribe((response: any) => {
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

  ngAfterViewInit() {
    this.renderer.listen('document', 'click', (event: Event) => {
      // if (this.standardDropdown && !this.standardDropdown.nativeElement.contains(event.target)) {
      //   this.isStandardDropdownOpen = false;
      // }
      if (this.auditeeDropdown && !this.auditeeDropdown.nativeElement.contains(event.target)) {
        this.isAuditeeDropdownOpen = false;
      }
    });
  }

  getPlanItems() {
    const email = localStorage.getItem('user')?.toString() || '';
    this.audirService.getPlanItems(email).subscribe((items: any) => {
      if (items) {
        this.auditeeDropdownOptions = items.users.auditees;
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
    this.getAuditLists(this.fromDate, this.toDate);
  }

  resetDateFilter() {
    const now = new Date();
    this.utcToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    this.utcTomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
    this.fromDate = this.utcToday.toISOString().substring(0, 10);
    this.toDate = this.utcTomorrow.toISOString().substring(0, 10);
    this.getAuditLists(this.fromDate, this.toDate);
  }
}

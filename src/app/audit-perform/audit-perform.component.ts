import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { AudirService } from 'src/services/audir-services.service';

@Component({
  selector: 'app-audit-perform',
  templateUrl: './audit-perform.component.html',
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
  auditeeSelectedValue: any = '';
  fromDate!: string;
  toDate!: string;

  constructor(private renderer: Renderer2, private audirService: AudirService) {
    this.resetDateFilter();
  }

  ngOnInit() {
    this.getPlanItems();
    this.getAuditLists();
  }

  getAuditLists() {
    const email = localStorage.getItem('user')?.toString() || '';
    var payload = {
      eMail: email,
      start_date_filter: {
        from: "2024-06-09",
        to: "2025-12-30"
      },
      "status_filter": ["completed", "created", "inprogress", "submitted"]
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

  onAuditeeOptionChange(event: any) {
    const target = event.target as HTMLSelectElement;
    this.auditeeSelectedValue = target.value;
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
  }

  resetDateFilter() {
    const now = new Date();
    const utcToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const utcTomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
    this.fromDate = utcToday.toISOString().substring(0, 10);
    this.toDate = utcTomorrow.toISOString().substring(0, 10);
  }
}

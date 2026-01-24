import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { catchError, forkJoin, of } from 'rxjs';
import { AudirService } from 'src/services/audir-services.service';

@Component({
  selector: 'app-audit-perform',
  templateUrl: './audit-perform.component.html',
  providers: [DatePipe],
  styleUrls: ['./audit-perform.component.scss']
})
export class AuditPerformComponent {
  @ViewChild('auditeesDropdown', { static: false }) auditeesDropdown!: ElementRef;
  searchQuery: string = '';
  updateAuditee = 'Update Auditee';
  auditees: any;
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
  isAuditor = false;

  constructor(private audirService: AudirService, private datePipe: DatePipe) {
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
      status_filter: ["created", "inprogress"]
    };

    this.audirService.getAuditLists(payload).subscribe((response: any) => {
      if (response) {
        this.CompleteAuditList = response.audit_data || [];
        this.auditList = this.CompleteAuditList.filter((parent: any) => {
          const subs = Array.isArray(parent.sub_audits) ? parent.sub_audits : [];
          if (subs.length === 0) {
            return true;
          }
          return !subs.every((sub: any) => this.isClosedStatus(sub.audit_status));
        });
      }
    }, (error: any) => {
      console.error('Error for getting audits:', error);
    });

    this.auditList = this.auditList?.map((obj: any) => {
      obj.isSubAuditsOpened = false;
      return obj;
    });
  }

  openSubAudits(subAudits: any, index: any) {
    this.auditList[index].isSubAuditsOpened = !this.auditList[index].isSubAuditsOpened;
    if (this.auditList[index].isSubAuditsOpened) {
      this.subAuditAuditees = Array.from({ length: this.auditList[index].sub_audits.length }, (_) => ({
        auditees: this.auditees
      }));
      this.auditList[index].sub_audits = this.auditList[index].sub_audits.map((obj: any) => {
        obj.lineHeight = 0;
        obj.parentAuditID = this.auditList[index].audit_id;
        return obj;
      });
      this.auditList[index].sub_audits.forEach((audit: any) => {
        this.computeSubAuditCompletionPercent(audit);
      });
      this.updateLineHeights(index);
      this.setAuditeeValues(index);
    }
  }


  private isClosedStatus(status: any): boolean {
    const value = (status || '').toString().toLowerCase();
    return value === 'submitted' || value === 'completed' || value === 'closed';
  }

  buildQuestionList(questionTemplates: any, templateTypeByKey: Record<string, string>) {
    const templates = new Set();
    const questions: { text: string; template: string; templateType: string }[] = [];
    for (const key of Object.keys(questionTemplates || {})) {
      const normalizedKey = key.replace(/[\s_]/g, '').toLowerCase();
      if (!templates.has(normalizedKey)) {
        templates.add(normalizedKey);
        const templateType = templateTypeByKey[key] || 'function_template';
        const questionList = Array.isArray(questionTemplates[key]) ? questionTemplates[key] : [];
        questionList.forEach((question: any) => {
          questions.push({
            text: question,
            template: key,
            templateType: templateType
          });
        });
      }
    }
    return questions;
  }

  computeSubAuditCompletionPercent(subAudit: any) {
    const questionTemplates: any = {};
    const templateTypeByKey: Record<string, string> = {};
    const addTemplates = (templates: any, templateType: string) => {
      if (!templates) {
        return;
      }
      Object.keys(templates).forEach((key) => {
        questionTemplates[key] = templates[key];
        templateTypeByKey[key] = templateType;
      });
    };

    const parentPayload = { audit_id: subAudit.parentAuditID };
    const childPayload = { audit_id: subAudit.audit_id };
    this.audirService.getAuditQuestions(parentPayload).subscribe((parentQuestions: any) => {
      if (parentQuestions) {
        addTemplates(parentQuestions.questions?.function_template, 'function_template');
        addTemplates(parentQuestions.questions?.template, 'template');
      }
      this.audirService.getAuditQuestions(childPayload).subscribe((childQuestions: any) => {
        if (childQuestions) {
          addTemplates(childQuestions.questions?.function_template, 'function_template');
        }

        const questions = this.buildQuestionList(questionTemplates, templateTypeByKey);
        if (!questions.length) {
          subAudit.completion_percent = 0;
          return;
        }

        const email = localStorage.getItem('user')?.toString() || '';
        const requests = questions.map((question) => {
          const payload = {
            audit_id: subAudit.audit_id,
            template: question.template,
            template_type: question.templateType,
            question: question.text,
            email: email
          };
          return this.audirService.getQuestionData(payload).pipe(
            catchError(() => of(null))
          );
        });

        forkJoin(requests).subscribe((responses: any[]) => {
          const answeredCount = responses.filter((response) => {
            const value = this.isAuditor
              ? response?.auditor_notes?.[0]?.auditor_notes
              : response?.auditee_response?.[0]?.auditee_response;
            return value != null && value.toString().trim() !== '';
          }).length;
          const percent = (answeredCount / questions.length) * 100;
          subAudit.completion_percent = parseFloat(percent.toFixed(2));
        }, (error: any) => {
          console.error('Error fetching audit question data:', error);
        });
      }, (error: any) => {
        console.error('Error for getting child questions:', error);
      });
    }, (error: any) => {
      console.error('Error for getting parent questions:', error);
    });
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
    newLineHeight = statusContent.offsetHeight;
    if (index < subAudit.length && this.auditList[auditIndex].sub_audits[index]) {
      const subAuditItem = this.auditList[auditIndex].sub_audits[index];
      if (subAuditItem.city === '' || subAuditItem.functions === '') {
        if (subAuditItem.functions === '') {
          newLineHeight = index === 0 ? newLineHeight - 26 : newLineHeight + 36;
        }
        if (subAuditItem.city === '') {
          newLineHeight = index === 0 ? newLineHeight - 26 : newLineHeight + 16;
        }
      } else {
        newLineHeight = index === 0 ? newLineHeight - 64 : newLineHeight + 6;
      }
      if (subAuditItem.lineHeight !== newLineHeight) {
        subAuditItem.lineHeight = newLineHeight;
      }
    }
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

  updatePlanWithNewAssignee(auditPerformItem: any, sub_audit: any, index: number) {
    const updatedAuditPlan: any = {
      'audit_id': sub_audit.audit_id,
      'start_date': sub_audit.start_date,
      'end_date': sub_audit.end_date,
      'auditors': sub_audit.auditors.map((auditor: any) => auditor.email),
      'auditees': this.selectedAuditeesEmail[index],
      'city': sub_audit.city,
      'country': sub_audit.country,
      "lead_auditor": auditPerformItem.lead_auditor,
      "link_audit": sub_audit.link_audit,
      "template": sub_audit.template,
      "function_template": sub_audit.function_template,
      'audit_type': sub_audit.audit_type
    };
    this.audirService.updateAuditPlan(updatedAuditPlan).subscribe((response: any) => {
      if (response) {
        this.isSvgDisabled = true;
        this.audirService.showSuccess(response.message);
        this.getAuditLists(this.fromDate, this.toDate);
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
    this.getAuditLists(this.fromDate, this.toDate);
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
    this.getAuditLists(this.fromDate, this.toDate);
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

  isTemplatePresent() {
    this.audirService.showWarning('Functional templates are not assigned for this Audit.');
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    this.isAuditeesDropdownOpened = this.isAuditeesDropdownOpened?.map(() => false);
    this.isAuditeesOptionsOpen = this.isAuditeesOptionsOpen?.map(() => false);
  }

}

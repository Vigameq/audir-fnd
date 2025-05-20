import { Component, ElementRef, Inject, Renderer2, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuditFunctionalQuestionProgressDialogComponent } from '../audit-functional-question-progress-dialog/audit-functional-question-progress-dialog.component';
import { AudirService } from 'src/services/audir-services.service';

@Component({
  selector: 'app-customise-audit-question-dialog',
  templateUrl: './customise-audit-question-dialog.component.html',
  styleUrls: ['./customise-audit-question-dialog.component.scss']
})
export class CustomiseAuditQuestionDialogComponent {
  @ViewChild('findingsCategoryDropdown') findingsCategoryDropdown: ElementRef | undefined;
  findingCategorySelectedOption: string = '';
  findingsCount: number = 1;
  totalFindings!: any;
  isAuditor = true;
  functionalAuditForQuestions: any =
    {
      questionNumber: '',
      questionText: '',
      auditorNote: '',
      auditeeResponse: {
        response: '',
        evidence: '',
        link: ''
      },
      auditFinding: {
        findingsResponse: '',
        findingCategory: '',
        clause: ''
      }
    };
  auditNoteValue: string = '';
  auditeeResponseValue: string = '';
  auditFindingsValue: string = '';
  linkInput: string = '';
  clauseInput: string = '';
  isfindingCategoryDropdownOpen: boolean = false;
  auditInfo!: any;
  findingCategoryOptions = [{
    name: 'option1'
  },
  {
    name: 'option2'
  },
  {
    name: 'option3'
  }];

  progressData = [
    {
      label: 'Auditor Note',
      auditorName: 'Krishna Achar',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      date: '21/05/2024',
      lineHeight: 0,
      color: ''
    },
    {
      label: 'Auditee Response',
      auditorName: 'Rajesh Rao',
      type: 'Purchase',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      date: '27/05/2024',
      lineHeight: 0,
      color: ''
    },
    {
      label: 'NC Closed',
      auditorName: 'Krishna Achar',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      date: '28/05/2024',
      lineHeight: 0,
      color: ''
    }
  ];

  constructor(private dialog: MatDialog, private renderer: Renderer2,
    public dialogRef: MatDialogRef<CustomiseAuditQuestionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private audirService: AudirService,) {
    this.isAuditor === true ? (this.totalFindings = new Array(this.findingsCount)) : (this.totalFindings = new Array(0));
  }

  ngOnInit(): void {
    this.functionalAuditForQuestions.questionNumber = 'Question' + this.data.index;
    this.functionalAuditForQuestions.questionText = this.data.questionText;
    this.getPlanAudit(this.data.auditId);
  }

  getPlanAudit(auditId: any) {
    this.audirService.getAuditPlan(auditId).subscribe((audit: any) => {
      if (audit) {
        this.auditInfo = audit.audit_data;
      }
    }, (error: any) => {
      console.error('Error for getting audit plan:', error);
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  onAuditNoteChange() {
    this.functionalAuditForQuestions.auditorNote = this.auditNoteValue;
  }
  onAuditeeResponseChange() {
    this.functionalAuditForQuestions.auditorNote = this.auditNoteValue;
  }
  onAuditFindingsChange() {
    this.functionalAuditForQuestions.auditorNote = this.auditNoteValue;
  }

  onFindingsOptionChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    console.log("Selected Option: ", this.findingCategorySelectedOption, target);
    this.findingCategorySelectedOption = target.value;
  }

  onLinkInputChange() {

  }


  onClauseInputChange() {

  }

  ngAfterViewInit() {
    this.renderer.listen('document', 'click', (event: Event) => {
      if (this.findingsCategoryDropdown && !this.findingsCategoryDropdown.nativeElement.contains(event.target)) {
        this.isfindingCategoryDropdownOpen = false;
      }
    });
  }

  onFindingCategoryDropdownClick(): void {
    this.isfindingCategoryDropdownOpen = !this.isfindingCategoryDropdownOpen;
  }

  addFindings() {
    this.totalFindings = new Array(++this.findingsCount);
  }

  openResponseHistory() {
    const dialogReference = this.dialog.open(AuditFunctionalQuestionProgressDialogComponent, {
      width: 'auto',
      position: { right: '0', top: '0' },
      panelClass: 'question-progress-dialog-container',
      data: { auditorInfo: this.auditInfo, progressData: this.progressData }
    });

    dialogReference.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

import { Component, ElementRef, Inject, Renderer2, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-customise-audit-question-dialog',
  templateUrl: './customise-audit-question-dialog.component.html',
  styleUrls: ['./customise-audit-question-dialog.component.scss']
})
export class CustomiseAuditQuestionDialogComponent {
  @ViewChild('findingsCategoryDropdown') findingsCategoryDropdown: ElementRef | undefined;
  findingCategorySelectedOption: string = '';
  findingsCount: number = 1;
  totalFindings: any = new Array(this.findingsCount);
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
  findingCategoryOptions = [{
    name: 'option1'
  },
  {
    name: 'option2'
  },
  {
    name: 'option3'
  }];

  constructor(private renderer: Renderer2, public dialogRef: MatDialogRef<CustomiseAuditQuestionDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.functionalAuditForQuestions.questionNumber = 'Question' + this.data.index;
    this.functionalAuditForQuestions.questionText = this.data.questionText;
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
}

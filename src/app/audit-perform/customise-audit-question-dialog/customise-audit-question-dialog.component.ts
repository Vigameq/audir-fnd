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
  findingCategorySelectedOption: any = [''];
  findingsCount: number = 1;
  totalFindings!: any;
  isAuditor!: boolean;
  isSaved = false;
  evidenceFile: File | undefined;
  noErrors!: boolean;
  questionData: any;
  deleteText = 'Delete';
  isAuditFindingsPresent = false;
  isAuditeeResponseChanged = false;
  isAuditNoteChanged = false;
  auditeeResponseEvidenceFileName = 'No file choosen..';
  auditQuestionData: any =
    {
      audit_id: '',
      questionNumber: '',
      question: '',
      template: '',
      template_type: '',
      auditor_notes: '',
      auditeeInfo: {
        auditee_response: '',
        attach_evidence: {},
        link: ''
      },
      auditFindingsInfo: [{
        audit_finding: '',
        finding_category: '',
        closure_reference: ''
      }],
      email: ''
    };
  auditNoteValue: string = '';
  auditeeResponseValue: string = '';
  auditFindingsValue: any = [''];
  linkInput: string = '';
  clauseInput: any = [''];
  isFindingCategoryDropdownOpen: boolean = false;
  auditInfo!: any;
  findingCategoryOptions = [{
    name: 'Noteworthy Effort'
  },
  {
    name: 'Major Non-Conformance'
  },
  {
    name: 'Minor Non-Conformance'
  },
  {
    name: 'Observation'
  },
  {
    name: 'Opportunity for Improvement'
  },
  {
    name: 'Conformance'
  }];

  constructor(private dialog: MatDialog, private renderer: Renderer2, private audirService: AudirService,
    public dialogRef: MatDialogRef<CustomiseAuditQuestionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.isAuditor = ((JSON.parse(localStorage.getItem('userDetails') as any)).role === 'Auditor');
    this.isAuditor === true ? (this.totalFindings = new Array(this.findingsCount)) : (this.totalFindings = new Array(0));
    this.auditQuestionData.questionNumber = 'Question' + this.data.index;
    this.auditQuestionData.question = this.data.questionText;
    this.auditInfo = this.data.auditInfo;
    this.setQuestionData();
  }

  ngOnInit(): void {
    const payload = {
      audit_id: this.auditQuestionData.audit_id,
      template: this.auditQuestionData.template,
      template_type: this.auditQuestionData.template_type,
      question: this.data.questionText,
      email: this.auditQuestionData.email
    };
    this.getQuestionData(payload);
  }

  setQuestionData() {
    this.auditQuestionData.audit_id = this.auditInfo.audit_id;
    this.auditQuestionData.template = this.auditInfo.function_template[0];
    this.auditQuestionData.template_type = 'function_template';
    this.auditQuestionData.email = localStorage.getItem('user')?.toString() || '';
  }

  getQuestionData(payload: any) {
    this.audirService.getQuestionData(payload).subscribe((response: any) => {
      if (response) {
        this.questionData = response;
        this.bindResponses();
      }
    }, (error: any) => {
      this.noErrors = false;
      console.error('Error saving audit findings:', error);
    });
  }

  bindResponses() {
    this.auditNoteValue = this.questionData.auditor_notes[0] ? this.questionData.auditor_notes[0].auditor_notes : '';
    this.auditeeResponseValue = this.questionData.auditee_response[0] ? this.questionData.auditee_response[0].auditee_response : '';
    this.linkInput = this.questionData.auditee_response[0] ? this.questionData.auditee_response[0].link : '';
    this.auditeeResponseEvidenceFileName = this.questionData.auditee_response[0] ? this.questionData.auditee_response[0].attach_evidence : '';
    this.onAuditNoteChange();
    this.onAuditeeResponseChange();
    this.onLinkInputChange();
    this.bindExistingEvidence();
  }

  bindExistingEvidence() {
    this.downloadFileEvidence(this.auditeeResponseEvidenceFileName);
    this.isAuditeeResponseChanged = false;
    this.isAuditNoteChanged = false;
  }

  downloadFileEvidence(attach_evidence_file_Name: any) {
    if (attach_evidence_file_Name !== '') {
      this.audirService.getEvidence(this.auditQuestionData.audit_id, attach_evidence_file_Name).subscribe((response: any) => {
        if (response) {
          const lastModifiedDate = new Date();
          const file = new File([response], attach_evidence_file_Name, {
            type: "application/pdf",
            lastModified: lastModifiedDate.getTime()
          });
          this.evidenceFile = file;
          this.auditQuestionData.auditeeInfo.attach_evidence = this.evidenceFile;
        }
      }, (error: any) => {
        console.error('Error downloading evidence file:', error);
      });
    }
  }

  close(): void {
    this.dialogRef.close(false);
  }

  onAuditNoteChange() {
    this.isAuditNoteChanged = true;
    this.auditQuestionData.auditor_notes = this.auditNoteValue;
  }

  onAuditeeResponseChange() {
    this.isAuditeeResponseChanged = true;
    this.auditQuestionData.auditeeInfo.auditee_response = this.auditeeResponseValue;
  }

  onLinkInputChange() {
    this.isAuditeeResponseChanged = true;
    this.auditQuestionData.auditeeInfo.link = this.linkInput;
  }

  onAuditFindingsChange(index: number) {
    this.auditQuestionData.auditFindingsInfo[index].audit_finding = this.auditFindingsValue[index];
  }

  onFindingsOptionChange(event: Event, index: number) {
    this.auditQuestionData.auditFindingsInfo[index].finding_category = this.findingCategorySelectedOption[index];
  }

  onClauseInputChange(index: number) {
    this.auditQuestionData.auditFindingsInfo[index].closure_reference = this.clauseInput[index];
  }

  ngAfterViewInit() {
    this.renderer.listen('document', 'click', (event: Event) => {
      if (this.findingsCategoryDropdown && !this.findingsCategoryDropdown.nativeElement.contains(event.target)) {
        this.isFindingCategoryDropdownOpen = false;
      }
    });
  }

  onFindingCategoryDropdownClick(): void {
    this.isFindingCategoryDropdownOpen = !this.isFindingCategoryDropdownOpen;
  }

  addFindings() {
    this.totalFindings = new Array(++this.findingsCount);
    this.auditQuestionData.auditFindingsInfo.push({
      audit_finding: '',
      finding_category: '',
      closure_reference: ''
    });
    this.auditFindingsValue.push('');
    this.findingCategorySelectedOption.push('');
    this.clauseInput.push('');
  }

  openResponseHistory() {
    const auditResponseHistory: any = this.questionData?.history;
    auditResponseHistory.forEach((response: any) => {
      response.color = '';
      response.lineHeight = 0;
    });
    const dialogReference = this.dialog.open(AuditFunctionalQuestionProgressDialogComponent, {
      disableClose: true,
      width: 'auto',
      position: { right: '0', top: '0' },
      panelClass: 'question-progress-dialog-container',
      data: { auditQuestionData: this.auditQuestionData, auditResponseHistory: auditResponseHistory, auditInfo: this.auditInfo }
    });

    dialogReference.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  deleteFindings(index: number) {
    this.totalFindings.splice(index, 1);
    this.auditQuestionData.auditFindingsInfo.splice(index, 1);
    this.auditFindingsValue.splice(index, 1);
    this.findingCategorySelectedOption.splice(index, 1);
    this.clauseInput.splice(index, 1);
    --this.findingsCount;
  }

  onSave() {
    this.isSaved = true;
    this.noErrors = true;
    if (this.isAuditor) {
      if (this.auditNoteValue && this.isAuditNoteChanged) {
        this.saveAuditorNotes();
      }
      if (this.checkIfAuditFindingPresent(this.auditFindingsValue, this.findingCategorySelectedOption, this.clauseInput)) {
        this.saveAuditFindings();
      }
    }
    if (this.evidenceFile && this.isAuditeeResponseChanged) {
      this.saveAuditeeResponse();
    }
    if (this.noErrors) {
      this.audirService.showSuccess('Response saved successfully');
      this.dialogRef.close('saved');
    }
    this.isSaved = false;
  }

  checkResponseAvailability() {
    return (this.checkIfAuditFindingPresent(this.auditFindingsValue, this.findingCategorySelectedOption, this.clauseInput)
      || this.auditNoteValue !== '' && this.isAuditNoteChanged || (this.evidenceFile && (this.auditeeResponseValue !== '' || this.linkInput !== '')) && this.isAuditeeResponseChanged);
  }

  checkIfAuditFindingPresent(auditFindingsValue: any, findingCategorySelectedOption: any, clauseInput: any) {
    return (this.checkStringArray(auditFindingsValue) || this.checkStringArray(findingCategorySelectedOption) || this.checkStringArray(clauseInput));
  }

  checkStringArray(list: any) {
    if (list) {
      return list?.some((item: any) => item.trim() !== '');
    }
    return false;
  }

  saveAuditorNotes() {
    const saveAuditorNotesPayload: any = {
      audit_id: this.auditQuestionData.audit_id,
      template: this.auditQuestionData.template,
      template_type: this.auditQuestionData.template_type,
      question: this.auditQuestionData.question,
      auditor_notes: this.auditQuestionData.auditor_notes,
      email: this.auditQuestionData.email
    };
    this.audirService.saveAuditorNotes(saveAuditorNotesPayload).subscribe((response: any) => {
      if (response) {
        console.log(response.msg);
      }
    }, (error: any) => {
      this.noErrors = false;
      console.error('Error saving auditor note response:', error);
    });
  }

  saveAuditFindings() {
    for (let index = 0; index < this.findingsCount; index++) {
      const saveAuditFinding: any = {
        audit_id: this.auditQuestionData.audit_id,
        template: this.auditQuestionData.template,
        template_type: this.auditQuestionData.template_type,
        question: this.auditQuestionData.question,
        audit_finding: this.auditQuestionData.auditFindingsInfo[index].audit_finding,
        finding_category: this.auditQuestionData.auditFindingsInfo[index].finding_category,
        closure_reference: this.auditQuestionData.auditFindingsInfo[index].closure_reference,
        email: this.auditQuestionData.email
      };
      this.audirService.saveAuditFinding(saveAuditFinding).subscribe((response: any) => {
        if (response) {
          console.log(response.msg);
        }
      }, (error: any) => {
        this.noErrors = false;
        console.error('Error saving audit findings:', error);
      });
      if (!this.noErrors) {
        break;
      }
    };
  }

  saveAuditeeResponse() {
    const saveAuditeeResponsePayload = new FormData();
    saveAuditeeResponsePayload.append('audit_id', this.auditQuestionData.audit_id);
    saveAuditeeResponsePayload.append('template', this.auditQuestionData.template);
    saveAuditeeResponsePayload.append('template_type', this.auditQuestionData.template_type);
    saveAuditeeResponsePayload.append('question', this.auditQuestionData.question);
    saveAuditeeResponsePayload.append('email', this.auditQuestionData.email);
    saveAuditeeResponsePayload.append('auditee_response', this.auditQuestionData.auditeeInfo.auditee_response);
    saveAuditeeResponsePayload.append('link', this.auditQuestionData.auditeeInfo.link);
    saveAuditeeResponsePayload.append('attach_evidence', this.auditQuestionData.auditeeInfo.attach_evidence);
    this.audirService.saveAuditeeResponse(saveAuditeeResponsePayload as any).subscribe((response: any) => {
      if (response) {
        console.log(response.msg);
      }
    }, (error: any) => {
      this.noErrors = false;
      console.error('Error saving auditee response:', error);
    });
  }

  uploadEvidence(event: any) {
    this.evidenceFile = event.target.files[0];
    if (!this.evidenceFile) {
      this.audirService.showError('Uploading PDF failed');
      return;
    }
    if (this.evidenceFile.type !== 'application/pdf') {
      this.audirService.showError('Only PDF file is allowed');
      console.log('Upload only PDF file');
      return;
    }
    this.isAuditeeResponseChanged = true;
    this.auditeeResponseEvidenceFileName = this.evidenceFile.name;
    this.auditQuestionData.auditeeInfo.attach_evidence = this.evidenceFile;
    this.audirService.showSuccess('Upload Evidence Successful');
    console.log('PDF file uploaded successfully.');
  }

  checkFindingsLengthInRange() {
    return this.totalFindings.length >= 10
  }
}

import { Component, ElementRef, Inject, Renderer2, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
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
  fileSize = 1048 * 1048;
  isAuditFindingsPresent = false;
  isAuditorSubmitted = false;
  isReviewInProgress = false;
  isQuestionSubmitted = false;
  isAuditeeResponded = false;
  isAuditeeResponseChanged = false;
  isAuditNoteChanged = false;
  isAuditFindingsChanged = false;
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
    this.getQuestionData();
  }

  setQuestionData() {
    this.auditQuestionData.audit_id = this.auditInfo.audit_id;
    this.auditQuestionData.template = this.data.template || this.auditInfo.function_template?.[0] || this.auditInfo.template?.[0];
    this.auditQuestionData.template_type = this.data.templateType
      || (this.auditInfo.function_template?.[0] ? 'function_template' : 'template');
    this.auditQuestionData.email = localStorage.getItem('user')?.toString() || '';
  }

  getQuestionData() {
    const payload = {
      audit_id: this.auditQuestionData.audit_id,
      template: this.auditQuestionData.template,
      template_type: this.auditQuestionData.template_type,
      question: this.data.questionText,
      email: this.auditQuestionData.email
    };
    this.audirService.getQuestionData(payload).subscribe((response: any) => {
      if (response) {
        this.questionData = response;
        const auditeeResponse = this.questionData?.auditee_response?.[0] || {};
        const serverAuditeeSubmitted = this.hasAuditeeResponse(auditeeResponse.auditee_response || '')
          || (auditeeResponse.link || '').trim() !== ''
          || (auditeeResponse.attach_evidence && auditeeResponse.attach_evidence !== 'None');
        const localAuditeeSubmitted = this.isAuditor ? false : this.getAuditeeSubmittedFlag();
        this.isQuestionSubmitted = this.isSubmittedFlag(this.questionData?.is_submitted)
          || serverAuditeeSubmitted
          || localAuditeeSubmitted;
        this.isAuditorSubmitted = this.getAuditorSubmittedFlag();
        const historyReview = this.calculateReviewInProgress();
        this.isReviewInProgress = historyReview || this.getReviewInProgressFlag();
        this.bindResponses();
      }
    }, (error: any) => {
      this.noErrors = false;
      console.error('Error getting question data:', error);
    });
  }

  bindResponses() {
    this.auditNoteValue = this.questionData.auditor_notes[0] ? this.questionData.auditor_notes[0].auditor_notes : '';
    this.auditeeResponseValue = this.questionData.auditee_response[0] ? this.questionData.auditee_response[0].auditee_response : '';
    this.isAuditeeResponded = this.getVisibleAuditeeResponded(this.auditeeResponseValue);
    if (!this.isAuditor && !this.isQuestionSubmitted) {
      const serverLink = this.questionData.auditee_response[0] ? this.questionData.auditee_response[0].link : '';
      if (!this.auditeeResponseValue && !serverLink) {
        this.loadAuditeeDraft();
      }
    }
    this.isAuditeeResponded = this.hasAuditeeResponse(this.auditeeResponseValue);
    this.linkInput = this.questionData.auditee_response[0] ? this.questionData.auditee_response[0].link : '';
    this.auditeeResponseEvidenceFileName = this.questionData.auditee_response[0] ? this.questionData.auditee_response[0].attach_evidence : 'No file choosen..';
    this.auditFindingsValue[0] = this.questionData.audit_findings[0] ? this.questionData.audit_findings[0].audit_finding : '';
    this.findingCategorySelectedOption[0] = this.questionData.audit_findings[0] ? this.questionData.audit_findings[0].finding_category : '';
    this.clauseInput[0] = this.questionData.audit_findings[0] ? this.questionData.audit_findings[0].closure_reference : '';
    if (this.isAuditor && !this.auditNoteValue) {
      const hasServerFindings = Array.isArray(this.questionData.audit_findings)
        && this.questionData.audit_findings.some((finding: any) => {
          const findingText = (finding?.audit_finding || '').trim();
          const category = (finding?.finding_category || '').trim();
          const clause = (finding?.closure_reference || '').trim();
          return findingText || category || clause;
        });
      if (!hasServerFindings) {
        this.loadAuditorDraft();
      }
    }
    this.onAuditNoteChange();
    this.onAuditeeResponseChange();
    this.onLinkInputChange();
    this.onAuditFindingsChange(0);
    this.onFindingsOptionChange(0);
    this.onClauseInputChange(0);
    this.bindExistingEvidence();
  }

  hasAuditeeResponse(value: string) {
    return value != null && value.trim() !== '';
  }

  isSubmittedFlag(value: any) {
    if (typeof value === 'string') {
      const normalized = value.toLowerCase();
      return normalized === 'true' || normalized === '1' || normalized === 'submitted';
    }
    return value === true || value === 1;
  }

  getVisibleAuditeeResponded(value: string) {
    const hasResponse = this.hasAuditeeResponse(value);
    if (!hasResponse) {
      return false;
    }
    if (this.isAuditor && !this.isQuestionSubmitted) {
      return false;
    }
    return true;
  }

  getDraftKey() {
    const questionKey = encodeURIComponent(this.data.questionText || '');
    return `auditeeDraft:${this.auditQuestionData.audit_id}:${this.auditQuestionData.template_type}:${this.auditQuestionData.template}:${questionKey}`;
  }

  getSubmittedKey() {
    const questionKey = encodeURIComponent(this.data.questionText || '');
    return `auditeeSubmitted:${this.auditQuestionData.audit_id}:${this.auditQuestionData.template_type}:${this.auditQuestionData.template}:${questionKey}`;
  }

  loadAuditeeDraft() {
    const draftRaw = localStorage.getItem(this.getDraftKey());
    if (!draftRaw) {
      return false;
    }
    try {
      const draft = JSON.parse(draftRaw);
      this.auditeeResponseValue = draft.auditee_response || '';
      this.linkInput = draft.link || '';
      this.isAuditeeResponded = this.getVisibleAuditeeResponded(this.auditeeResponseValue);
      return true;
    } catch (error) {
      return false;
    }
  }

  saveAuditeeDraft() {
    const draft = {
      auditee_response: this.auditeeResponseValue || '',
      link: this.linkInput || ''
    };
    localStorage.setItem(this.getDraftKey(), JSON.stringify(draft));
  }

  clearAuditeeDraft() {
    localStorage.removeItem(this.getDraftKey());
  }

  setAuditeeSubmittedFlag() {
    localStorage.setItem(this.getSubmittedKey(), 'true');
  }

  getAuditeeSubmittedFlag() {
    return localStorage.getItem(this.getSubmittedKey()) === 'true';
  }

  getAuditorDraftKey() {
    const questionKey = encodeURIComponent(this.data.questionText || '');
    return `auditorDraft:${this.auditQuestionData.audit_id}:${this.auditQuestionData.template_type}:${this.auditQuestionData.template}:${questionKey}`;
  }

  getAuditorSubmittedKey() {
    const questionKey = encodeURIComponent(this.data.questionText || '');
    return `auditorSubmitted:${this.auditQuestionData.audit_id}:${this.auditQuestionData.template_type}:${this.auditQuestionData.template}:${questionKey}`;
  }

  saveAuditorDraft() {
    const draft = {
      auditNoteValue: this.auditNoteValue || '',
      auditFindingsValue: [...this.auditFindingsValue],
      findingCategorySelectedOption: [...this.findingCategorySelectedOption],
      clauseInput: [...this.clauseInput],
      findingsCount: this.findingsCount
    };
    localStorage.setItem(this.getAuditorDraftKey(), JSON.stringify(draft));
  }

  loadAuditorDraft() {
    const draftRaw = localStorage.getItem(this.getAuditorDraftKey());
    if (!draftRaw) {
      return false;
    }
    try {
      const draft = JSON.parse(draftRaw);
      this.auditNoteValue = draft.auditNoteValue || '';
      this.auditFindingsValue = draft.auditFindingsValue || [''];
      this.findingCategorySelectedOption = draft.findingCategorySelectedOption || [''];
      this.clauseInput = draft.clauseInput || [''];
      this.findingsCount = draft.findingsCount || 1;
      this.totalFindings = new Array(this.findingsCount);
      this.auditQuestionData.auditFindingsInfo = this.auditFindingsValue.map((value: any, index: number) => ({
        audit_finding: value,
        finding_category: this.findingCategorySelectedOption[index] || '',
        closure_reference: this.clauseInput[index] || ''
      }));
      return true;
    } catch (error) {
      return false;
    }
  }

  clearAuditorDraft() {
    localStorage.removeItem(this.getAuditorDraftKey());
  }

  setAuditorSubmittedFlag() {
    localStorage.setItem(this.getAuditorSubmittedKey(), 'true');
  }

  getAuditorSubmittedFlag() {
    return localStorage.getItem(this.getAuditorSubmittedKey()) === 'true';
  }

  getReviewInProgressKey() {
    const questionKey = encodeURIComponent(this.data.questionText || '');
    return `reviewInProgress:${this.auditQuestionData.audit_id}:${questionKey}`;
  }

  setReviewInProgressFlag() {
    localStorage.setItem(this.getReviewInProgressKey(), 'true');
  }

  getReviewInProgressFlag() {
    return localStorage.getItem(this.getReviewInProgressKey()) === 'true';
  }

  clearReviewInProgressFlag() {
    localStorage.removeItem(this.getReviewInProgressKey());
  }

  hasAuditorNote() {
    return (this.auditNoteValue || '').trim() !== '';
  }

  isAuditClosed() {
    return this.isAuditorSubmitted;
  }

  shouldDisableAuditeeEdits() {
    return this.isAuditClosed() || (this.isQuestionSubmitted && !this.isReviewInProgress);
  }

  calculateReviewInProgress() {
    const history = Array.isArray(this.questionData?.history) ? this.questionData.history : [];
    if (history.length) {
      const types = history.map((item: any) => item.type);
      const lastAuditorIndex = types.lastIndexOf('auditor_notes');
      const lastAuditeeIndex = types.lastIndexOf('auditee_response');
      if (lastAuditorIndex !== -1 && lastAuditeeIndex !== -1) {
        const latestAuditorNote = history[lastAuditorIndex];
        const latestAuditeeResponse = history[lastAuditeeIndex];
        const auditorTime = new Date(latestAuditorNote.updated_at || latestAuditorNote.updatedAt || latestAuditorNote.timestamp || 0).getTime();
        const auditeeTime = new Date(latestAuditeeResponse.updated_at || latestAuditeeResponse.updatedAt || latestAuditeeResponse.timestamp || 0).getTime();
        if (auditorTime && auditeeTime) {
          return auditorTime > auditeeTime;
        }
        return lastAuditorIndex > lastAuditeeIndex;
      }
    }

    const auditeeEntry = this.questionData?.auditee_response?.[0] || {};
    const auditorEntry = this.questionData?.auditor_notes?.[0] || {};
    const auditeeTime = new Date(auditeeEntry.updated_at || auditeeEntry.updatedAt || auditeeEntry.timestamp || 0).getTime();
    const auditorTime = new Date(auditorEntry.updated_at || auditorEntry.updatedAt || auditorEntry.timestamp || 0).getTime();
    if (auditorTime && auditeeTime) {
      return auditorTime > auditeeTime;
    }

    // Fallback: if both exist but timestamps are missing, assume review in progress
    const hasAuditor = (auditorEntry.auditor_notes || '').trim() !== '';
    const hasAuditee = (auditeeEntry.auditee_response || '').trim() !== ''
      || (auditeeEntry.link || '').trim() !== ''
      || (auditeeEntry.attach_evidence && auditeeEntry.attach_evidence !== 'None');
    return hasAuditor && hasAuditee;
  }

  hasAuditorDraftContent() {
    const hasNote = (this.auditNoteValue || '').trim() !== '';
    const hasFindings = this.checkIfAuditFindingPresent(this.auditFindingsValue, this.findingCategorySelectedOption, this.clauseInput);
    return hasNote || hasFindings;
  }

  hasAuditeeDraftContent() {
    const hasText = (this.auditeeResponseValue || '').trim() !== '';
    const hasLink = (this.linkInput || '').trim() !== '';
    const hasEvidence = !!this.evidenceFile && this.auditeeResponseEvidenceFileName !== 'No file choosen..';
    return hasText || hasLink || hasEvidence;
  }

  bindExistingEvidence() {
    this.auditeeResponseEvidenceFileName = this.auditeeResponseEvidenceFileName === 'None' ? 'No file choosen..' : this.auditeeResponseEvidenceFileName;
    if (this.questionData.auditee_response.length > 0 && this.questionData.auditee_response[0].attach_evidence !== 'None') {
      this.downloadFileEvidence(this.auditeeResponseEvidenceFileName);
    }
    this.isAuditeeResponseChanged = false;
    this.isAuditNoteChanged = false;
    this.isAuditFindingsChanged = false;
  }

  downloadFileEvidence(attach_evidence_file_Name: any) {
    if (attach_evidence_file_Name !== '') {
      this.audirService.getEvidence(this.auditQuestionData.audit_id, attach_evidence_file_Name).subscribe((response: any) => {
        if (response) {
          const lastModifiedDate = new Date();
          const file = new File([response], attach_evidence_file_Name, {
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
    this.auditQuestionData.auditeeInfo.auditee_response = this.auditeeResponseValue;
    if (this.auditeeResponseValue !== this.questionData.auditee_response[0]?.auditee_response) {
      this.isAuditeeResponseChanged = true;
    }
    else {
      this.isAuditeeResponseChanged = false;
    }
  }

  onLinkInputChange() {
    this.auditQuestionData.auditeeInfo.link = this.linkInput;
    if (this.linkInput !== this.questionData.auditee_response[0]?.link) {
      this.isAuditeeResponseChanged = true;
    }
    else {
      this.isAuditeeResponseChanged = false;
    }
  }

  onAuditFindingsChange(index: number) {
    this.isAuditFindingsChanged = true;
    this.auditQuestionData.auditFindingsInfo[index].audit_finding = this.auditFindingsValue[index];
  }

  onFindingsOptionChange(index: number) {
    this.isAuditFindingsChanged = true;
    this.auditQuestionData.auditFindingsInfo[index].finding_category = this.findingCategorySelectedOption[index];
  }

  onClauseInputChange(index: number) {
    this.isAuditFindingsChanged = true;
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

  openResponseHistory(includeAuditorNote = false) {
    const auditResponseHistory: any = this.questionData?.history ? [...this.questionData.history] : [];
    const existingAuditorNote = auditResponseHistory.find((item: any) => item.type === 'auditor_notes');
    const storedAuditorNote = this.questionData?.auditor_notes?.[0];
    if (!existingAuditorNote && storedAuditorNote?.auditor_notes) {
      auditResponseHistory.push({
        type: 'auditor_notes',
        content: storedAuditorNote.auditor_notes,
        updated_at: storedAuditorNote.updated_at || new Date(),
        updated_by: storedAuditorNote.updated_by || { name: 'Auditor' }
      });
    }
    if (includeAuditorNote && (this.auditNoteValue || '').trim() !== '') {
      const userDetails = JSON.parse(localStorage.getItem('userDetails') as any) || {};
      auditResponseHistory.push({
        type: 'auditor_notes',
        content: this.auditNoteValue,
        updated_at: new Date(),
        updated_by: { name: userDetails.name || 'Auditor' }
      });
    }
    auditResponseHistory.forEach((response: any) => {
      response.color = '';
      response.lineHeight = 0;
    });
    const dialogReference = this.dialog.open(AuditFunctionalQuestionProgressDialogComponent, {
      disableClose: true,
      width: 'auto',
      position: { right: '0', top: '0' },
      panelClass: 'question-progress-dialog-container',
      data: {
        auditQuestionData: this.auditQuestionData,
        auditResponseHistory: auditResponseHistory,
        auditInfo: this.auditInfo,
        isQuestionSubmitted: this.isQuestionSubmitted,
        isAuditor: this.isAuditor
      }
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
      if (this.noErrors) {
        this.audirService.showSuccess('Response saved successfully');
        this.dialogRef.close('saved');
      }
    }
    this.isSaved = false;
  }

  checkResponseAvailability() {
    return ((this.checkIfAuditFindingPresent(this.auditFindingsValue, this.findingCategorySelectedOption, this.clauseInput) && this.isAuditFindingsChanged)
      || (this.auditNoteValue !== '' && this.isAuditNoteChanged)
      || (this.isAuditeeResponseChanged));
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
        this.isAuditeeResponded = this.getVisibleAuditeeResponded(this.auditQuestionData.auditeeInfo.auditee_response as string);
        this.isQuestionSubmitted = true;
        this.setAuditeeSubmittedFlag();
        this.clearReviewInProgressFlag();
        this.isReviewInProgress = false;
        this.clearAuditeeDraft();
        this.isReviewInProgress = true;
        this.setReviewInProgressFlag();
        this.audirService.showSuccess('Response submitted successfully');
        this.dialogRef.close('saved');
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
      this.audirService.showError('Uploading evidence file failed');
      return;
    }
    // if (this.evidenceFile.type !== 'application/pdf') {
    //   this.audirService.showError('Only PDF file is allowed');
    //   console.log('Upload only PDF file');
    //   return;
    // }
    if (this.evidenceFile.size >= this.fileSize) {
      this.audirService.showError('Only below 1 MB file size is allowed');
      console.log('Upload file size below 1 MB');
      return;
    }
    this.isAuditeeResponseChanged = true;
    this.auditeeResponseEvidenceFileName = this.evidenceFile.name;
    this.auditQuestionData.auditeeInfo.attach_evidence = this.evidenceFile;
    this.audirService.showSuccess('Uploaded Evidence Successful');
    console.log('Evidence file uploaded successfully.');
  }


  onSaveDraft() {
    if (this.shouldDisableAuditeeEdits()) {
      this.audirService.showError('This response is locked for editing');
      return;
    }
    this.saveAuditeeDraft();
    this.isAuditeeResponded = this.getVisibleAuditeeResponded(this.auditeeResponseValue);
    this.audirService.showSuccess('Draft saved');
    this.dialogRef.close('saved');
  }

  onSubmitResponse() {
    if (this.shouldDisableAuditeeEdits()) {
      this.audirService.showError('This response is locked for editing');
      return;
    }
    const confirmed = window.confirm('Submit your response? You will not be able to edit after submitting.');
    if (!confirmed) {
      return;
    }
    this.isAuditeeResponseChanged = true;
    this.saveAuditeeResponse();
  }
  onSaveAuditorDraft() {
    if (this.isAuditorSubmitted) {
      return;
    }
    this.saveAuditorDraft();
    this.audirService.showSuccess('Draft saved');
    this.dialogRef.close('saved');
  }

  onSubmitAuditorResponse() {
    if (this.isAuditorSubmitted) {
      return;
    }
    const confirmed = window.confirm('Submit your response? You will not be able to edit after submitting.');
    if (!confirmed) {
      return;
    }
    this.isAuditorSubmitted = true;
    this.setAuditorSubmittedFlag();
    const requests: any[] = [];
    const email = this.auditQuestionData.email;

    if ((this.auditNoteValue || '').trim() !== '') {
      const saveAuditorNotesPayload: any = {
        audit_id: this.auditQuestionData.audit_id,
        template: this.auditQuestionData.template,
        template_type: this.auditQuestionData.template_type,
        question: this.auditQuestionData.question,
        auditor_notes: this.auditNoteValue,
        email: email
      };
      requests.push(this.audirService.saveAuditorNotes(saveAuditorNotesPayload));
    }

    if (this.checkIfAuditFindingPresent(this.auditFindingsValue, this.findingCategorySelectedOption, this.clauseInput)) {
      for (let index = 0; index < this.findingsCount; index++) {
        const saveAuditFinding: any = {
          audit_id: this.auditQuestionData.audit_id,
          template: this.auditQuestionData.template,
          template_type: this.auditQuestionData.template_type,
          question: this.auditQuestionData.question,
          audit_finding: this.auditFindingsValue[index],
          finding_category: this.findingCategorySelectedOption[index],
          closure_reference: this.clauseInput[index],
          email: email
        };
        requests.push(this.audirService.saveAuditFinding(saveAuditFinding));
      }
    }

    if (!requests.length) {
      return;
    }

    this.noErrors = true;
    this.isSaved = true;
    forkJoin(requests).subscribe({
      next: () => {
        this.clearAuditorDraft();
        this.clearReviewInProgressFlag();
        this.isReviewInProgress = false;
        this.audirService.showSuccess('Response submitted successfully');
        this.dialogRef.close('saved');
      },
      error: (error: any) => {
        this.noErrors = false;
        this.isSaved = false;
        this.isAuditorSubmitted = false;
        localStorage.removeItem(this.getAuditorSubmittedKey());
        console.error('Error submitting auditor response:', error);
      }
    });
  }

  onSubmitMoreInfo() {
    const confirmed = window.confirm('Requesting for more information from auditee will be submitted');
    if (!confirmed) {
      return;
    }
    if (!this.hasAuditorNote()) {
      this.audirService.showError('Please enter an auditor note');
      return;
    }
    const payload: any = {
      audit_id: this.auditQuestionData.audit_id,
      template: this.auditQuestionData.template,
      template_type: this.auditQuestionData.template_type,
      question: this.auditQuestionData.question,
      auditor_notes: this.auditNoteValue,
      email: this.auditQuestionData.email
    };
    this.audirService.saveAuditorNotes(payload).subscribe((response: any) => {
      if (response) {
        const userDetails = JSON.parse(localStorage.getItem('userDetails') as any) || {};
        this.questionData.history = this.questionData.history || [];
        this.questionData.history.push({
          type: 'auditor_notes',
          content: this.auditNoteValue,
          updated_at: new Date(),
          updated_by: { name: userDetails.name || 'Auditor' }
        });
        this.isReviewInProgress = true;
        this.setReviewInProgressFlag();
        this.audirService.showSuccess('Response submitted successfully');
      }
    }, (error: any) => {
      console.error('Error submitting auditor note:', error);
    });
  }

  checkFindingsLengthInRange() {
    return this.totalFindings.length >= 10
  }
}

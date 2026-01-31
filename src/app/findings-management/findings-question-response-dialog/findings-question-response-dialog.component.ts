import { Component, ElementRef, Inject, Renderer2, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AudirService } from 'src/services/audir-services.service';
import { FindingsAuditProgressDialogComponent } from '../findings-audit-progress-dialog/findings-audit-progress-dialog.component';
import { DatePipe } from '@angular/common';
import { FindingsResponseDialogComponent } from '../findings-response-dialog/findings-response-dialog.component';
import { ApprovalRemarksDialogComponent } from '../approval-remarks-dialog/approval-remarks-dialog.component';

@Component({
  selector: 'app-findings-question-response-dialog',
  templateUrl: './findings-question-response-dialog.component.html',
  styleUrls: ['./findings-question-response-dialog.component.scss'],
  providers: [DatePipe]
})
export class FindingsQuestionResponseDialogComponent {
  @ViewChild('correctiveActionStatusDropdown') correctiveActionStatusDropdown: ElementRef | undefined;
  isAuditor!: boolean;
  correctionsEvidenceFile: File | undefined;
  rootCauseEvidenceFile: File | undefined;
  correctiveStatusEvidenceFile: File | undefined;
  uploadCorrectionsEvidenceText = 'No file choosen...';
  uploadRootCauseResponseFileText = 'No file choosen...';
  uploadCorrectiveActionStatusFileName = 'No file choosen...';
  isCorrectionsChanged: boolean = false;
  isRootCauseChanged: boolean = false;
  isCorrectivePlanChanged: boolean = false;
  noErrors: boolean = true;
  fileSize = 1048 * 1048;
  questionData: any;
  auditQuestionData: any =
    {
      audit_id: '',
      questionNumber: '',
      question: '',
      template: '',
      template_type: '',
      nc_correction: {
        correctionsNote: '',
        attach_evidence: {},
        link: '',
        plannedCompletionDate: '',
        actualCompletionDate: ''
      },
      nc_corrective_action_plan: {
        correctivePlanNote: '',
        owner_name_id: '',
        attach_evidence: {},
        link: '',
        planned_completion_date: '',
        actual_completion_date: '',
        corrective_action_status: ''
      },
      nc_root_cause: {
        rootCauseNote: '',
        attach_evidence: {},
        link: ''
      },
      email: ''
    };
  correctionsNoteValue: string = '';
  correctionsLinkInput: string = '';
  rootCauseNoteValue: string = '';
  rootCauseLinkInput: string = '';
  correctivePlanNoteValue: string = '';
  ownerIDValue: string = '';
  correctionPlannedCompletionDateValue: string = '';
  correctionActualCompletionDateValue: string = '';
  correctivePlannedDateValue: string = '';
  correctiveActualDateValue: string = '';
  correctivePlanLinkInput: string = '';
  isActionStatusCategoryDropdownOpen: boolean = false;
  actionStatusSelectedOption: string = '';
  auditInfo!: any;
  actionStatusCategoryOptions = [{
    name: 'Planned'
  },
  {
    name: 'In progress'
  },
  {
    name: 'Complete'
  }];
  minDateTime!: any;
  maxDateTime!: any;
  findingsResponsesData: any = [];

  constructor(private datePipe: DatePipe, private dialog: MatDialog, private renderer: Renderer2, private audirService: AudirService,
    public dialogRef: MatDialogRef<FindingsAuditProgressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.isAuditor = ((JSON.parse(localStorage.getItem('userDetails') as any)).role === 'Auditor');
    this.auditQuestionData.questionNumber = 'Question' + this.data.index;
    this.auditQuestionData.question = this.data.questionText;
    this.auditInfo = this.data.auditInfo;
    this.setQuestionData();
  }

  ngOnInit(): void {
    if (this.auditInfo?.end_date) {
      this.maxDateTime = this.datePipe.transform(this.auditInfo.end_date, 'yyyy-MM-dd\'T\'HH:mm:ss', 'UTC');
    }
    if (this.auditInfo?.start_date) {
      this.minDateTime = this.datePipe.transform(this.auditInfo.start_date, 'yyyy-MM-dd\'T\'HH:mm:ss', 'UTC');
    }
    this.getQuestionData();
    this.getNCQuestionData();
  }

  fillExistingResponses() {
    this.uploadCorrectionsEvidenceText = this.questionData.nc_correction[0] ? this.questionData.nc_correction[0].attach_evidence : 'No file choosen...';
    this.uploadRootCauseResponseFileText = this.questionData.nc_root_cause[0] ? this.questionData.nc_root_cause[0].attach_evidence : 'No file choosen...';
    this.uploadCorrectiveActionStatusFileName = this.questionData.nc_corrective_action_plan[0] ? this.questionData.nc_corrective_action_plan[0].attach_evidence : 'No file choosen...';
    this.correctionsNoteValue = this.questionData.nc_correction[0] ? this.questionData.nc_correction[0].notes : '';
    this.correctionsLinkInput = this.questionData.nc_correction[0] ? this.questionData.nc_correction[0].link : '';
    this.correctionPlannedCompletionDateValue = this.questionData.nc_correction[0] ? this.questionData.nc_correction[0].planned_completion_date : '';
    this.correctionActualCompletionDateValue = this.questionData.nc_correction[0] ? this.questionData.nc_correction[0].actual_completion_date : '';
    this.rootCauseNoteValue = this.questionData.nc_root_cause[0] ? this.questionData.nc_root_cause[0].notes : '';
    this.rootCauseLinkInput = this.questionData.nc_root_cause[0] ? this.questionData.nc_root_cause[0].link : '';
    this.correctivePlanNoteValue = this.questionData.nc_corrective_action_plan[0] ? this.questionData.nc_corrective_action_plan[0].notes : '';
    this.ownerIDValue = this.questionData.nc_corrective_action_plan[0] ? this.questionData.nc_corrective_action_plan[0].owner_name_id : '';
    this.correctivePlannedDateValue = this.questionData.nc_corrective_action_plan[0] ? this.questionData.nc_corrective_action_plan[0].planned_completion_date : '';
    this.correctiveActualDateValue = this.questionData.nc_corrective_action_plan[0] ? this.questionData.nc_corrective_action_plan[0].actual_completion_date : '';
    this.correctivePlanLinkInput = this.questionData.nc_corrective_action_plan[0] ? this.questionData.nc_corrective_action_plan[0].link : '';
    this.actionStatusSelectedOption = this.questionData.nc_corrective_action_plan[0] ? this.questionData.nc_corrective_action_plan[0].corrective_action_status : '';
    this.onCorrectionNoteChange();
    this.onCorrectivePlanNoteChange();
    this.onCorrectivePlanOwnerIDChange();
    this.onCorrectivePlannedDateChange();
    this.onCorrectiveActualDateChange();
    this.onCorrectivePlanLinkInputChange();
    this.onCorrectivePlanActiveStatusOptionChange();
    this.onRootCauseResponseChange();
    this.onCorrectionsLinkInputChange();
    this.onRootCauseLinkInputChange();
    this.onCorrectionPlannedCompletionDateChange();
    this.onCorrectionActualCompletionDateChange();
    this.attachExistingEvidence();
  }

  attachExistingEvidence() {
    this.uploadRootCauseResponseFileText = this.uploadRootCauseResponseFileText === 'None' ? 'No file choosen..' : this.uploadRootCauseResponseFileText;
    this.uploadCorrectionsEvidenceText = this.uploadCorrectionsEvidenceText === 'None' ? 'No file choosen..' : this.uploadCorrectionsEvidenceText;
    this.uploadCorrectiveActionStatusFileName = this.uploadCorrectiveActionStatusFileName === 'None' ? 'No file choosen..' : this.uploadCorrectiveActionStatusFileName;
    this.isCorrectionsChanged = false;
    this.isRootCauseChanged = false;
    this.isCorrectivePlanChanged = false;
  }

  downloadFileEvidence(attach_evidence_file_Name: any, responseType: any) {
    if (attach_evidence_file_Name) {
      const safeFileName = encodeURIComponent(attach_evidence_file_Name || '');
      const url = `${this.audirService.apiBaseUrl()}/api/questionNCDataFile/${this.auditQuestionData.audit_id}/${responseType}/${safeFileName}`;
      window.open(url, '_blank');
    }
  }

  setQuestionData() {
    this.auditQuestionData.audit_id = this.auditInfo?.audit_id;
    const functionTemplate = this.auditInfo?.function_template?.[0];
    const template = this.auditInfo?.template?.[0];
    this.auditQuestionData.template = functionTemplate || template || '';
    this.auditQuestionData.template_type = functionTemplate ? 'function_template' : 'template';
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
        this.findingsResponsesData = response.audit_findings;
      }
    }, (error: any) => {
      this.noErrors = false;
      console.error('Error getting question data:', error);
    });
  }

  getNCQuestionData() {
    const payload = {
      audit_id: this.auditQuestionData.audit_id,
      template: this.auditQuestionData.template,
      template_type: this.auditQuestionData.template_type,
      question: this.data.questionText,
      email: this.auditQuestionData.email,
      audit_finding_id:this.data.audit_finding_id
    };
    this.audirService.getNCQuestionData(payload).subscribe((response: any) => {
      if (response) {
        this.questionData = response;
        this.fillExistingResponses();
        this.applyDraftFromStorage();
      }
    }, (error: any) => {
      this.noErrors = false;
      console.error('Error getting question data:', error);
    });
  }

  getDraftKey() {
    const questionKey = encodeURIComponent(this.data.questionText || '');
    const findingId = this.data.audit_finding_id || this.questionData?.audit_finding_id || '';
    return `findingsDraft:${this.auditQuestionData.audit_id}:${this.auditQuestionData.template_type}:${this.auditQuestionData.template}:${questionKey}:${findingId}`;
  }

  saveDraft() {
    const draft = {
      correctionsNoteValue: this.correctionsNoteValue || '',
      correctionsLinkInput: this.correctionsLinkInput || '',
      correctionPlannedCompletionDateValue: this.correctionPlannedCompletionDateValue || '',
      correctionActualCompletionDateValue: this.correctionActualCompletionDateValue || '',
      rootCauseNoteValue: this.rootCauseNoteValue || '',
      rootCauseLinkInput: this.rootCauseLinkInput || '',
      correctivePlanNoteValue: this.correctivePlanNoteValue || '',
      ownerIDValue: this.ownerIDValue || '',
      correctivePlannedDateValue: this.correctivePlannedDateValue || '',
      correctiveActualDateValue: this.correctiveActualDateValue || '',
      correctivePlanLinkInput: this.correctivePlanLinkInput || '',
      actionStatusSelectedOption: this.actionStatusSelectedOption || ''
    };
    localStorage.setItem(this.getDraftKey(), JSON.stringify(draft));
  }

  loadDraft() {
    const raw = localStorage.getItem(this.getDraftKey());
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  }

  clearDraft() {
    localStorage.removeItem(this.getDraftKey());
  }

  hasDraftContent() {
    const values = [
      this.correctionsNoteValue,
      this.correctionsLinkInput,
      this.correctionPlannedCompletionDateValue,
      this.correctionActualCompletionDateValue,
      this.rootCauseNoteValue,
      this.rootCauseLinkInput,
      this.correctivePlanNoteValue,
      this.ownerIDValue,
      this.correctivePlannedDateValue,
      this.correctiveActualDateValue,
      this.correctivePlanLinkInput,
      this.actionStatusSelectedOption
    ];
    const hasValue = values.some((value) => String(value || '').trim() !== '');
    return hasValue || !!this.correctionsEvidenceFile || !!this.rootCauseEvidenceFile || !!this.correctiveStatusEvidenceFile;
  }

  hasCorrectionsServerData() {
    const corrections = this.questionData?.nc_correction?.[0] || {};
    return ((corrections.notes || '').trim() !== ''
      || (corrections.link || '').trim() !== ''
      || (corrections.planned_completion_date || '') !== ''
      || (corrections.actual_completion_date || '') !== ''
      || (corrections.attach_evidence && corrections.attach_evidence !== 'None'));
  }

  hasRootCauseServerData() {
    const rootCause = this.questionData?.nc_root_cause?.[0] || {};
    return ((rootCause.notes || '').trim() !== ''
      || (rootCause.link || '').trim() !== ''
      || (rootCause.attach_evidence && rootCause.attach_evidence !== 'None'));
  }

  hasCorrectivePlanServerData() {
    const plan = this.questionData?.nc_corrective_action_plan?.[0] || {};
    return ((plan.notes || '').trim() !== ''
      || (plan.link || '').trim() !== ''
      || (plan.owner_name_id || '').trim() !== ''
      || (plan.corrective_action_status || '').trim() !== ''
      || (plan.planned_completion_date || '') !== ''
      || (plan.actual_completion_date || '') !== ''
      || (plan.attach_evidence && plan.attach_evidence !== 'None'));
  }

  applyDraftFromStorage() {
    const draft = this.loadDraft();
    if (!draft) {
      return;
    }
    if (!this.hasCorrectionsServerData()) {
      this.correctionsNoteValue = draft.correctionsNoteValue || '';
      this.correctionsLinkInput = draft.correctionsLinkInput || '';
      this.correctionPlannedCompletionDateValue = draft.correctionPlannedCompletionDateValue || '';
      this.correctionActualCompletionDateValue = draft.correctionActualCompletionDateValue || '';
      this.onCorrectionNoteChange();
      this.onCorrectionsLinkInputChange();
      this.onCorrectionPlannedCompletionDateChange();
      this.onCorrectionActualCompletionDateChange();
    }
    if (!this.hasRootCauseServerData()) {
      this.rootCauseNoteValue = draft.rootCauseNoteValue || '';
      this.rootCauseLinkInput = draft.rootCauseLinkInput || '';
      this.onRootCauseResponseChange();
      this.onRootCauseLinkInputChange();
    }
    if (!this.hasCorrectivePlanServerData()) {
      this.correctivePlanNoteValue = draft.correctivePlanNoteValue || '';
      this.ownerIDValue = draft.ownerIDValue || '';
      this.correctivePlannedDateValue = draft.correctivePlannedDateValue || '';
      this.correctiveActualDateValue = draft.correctiveActualDateValue || '';
      this.correctivePlanLinkInput = draft.correctivePlanLinkInput || '';
      this.actionStatusSelectedOption = draft.actionStatusSelectedOption || '';
      this.onCorrectivePlanNoteChange();
      this.onCorrectivePlanOwnerIDChange();
      this.onCorrectivePlannedDateChange();
      this.onCorrectiveActualDateChange();
      this.onCorrectivePlanLinkInputChange();
      this.onCorrectivePlanActiveStatusOptionChange();
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  onCorrectionNoteChange() {
    this.isCorrectionsChanged = true;
    this.auditQuestionData.nc_correction.correctionsNote = this.correctionsNoteValue;
  }

  onCorrectionPlannedCompletionDateChange() {
    this.isCorrectionsChanged = true;
    this.auditQuestionData.nc_correction.plannedCompletionDate = this.datePipe.transform(this.correctionPlannedCompletionDateValue, 'yyyy-MM-dd\'T\'HH:mm:ss', 'UTC');
  }

  onCorrectionActualCompletionDateChange() {
    this.isCorrectionsChanged = true;
    this.auditQuestionData.nc_correction.actualCompletionDate = this.datePipe.transform(this.correctionActualCompletionDateValue, 'yyyy-MM-dd\'T\'HH:mm:ss', 'UTC');
  }

  onCorrectionsLinkInputChange() {
    this.isCorrectionsChanged = true;
    this.auditQuestionData.nc_correction.link = this.correctionsLinkInput;
  }


  onCorrectivePlanNoteChange() {
    this.isCorrectivePlanChanged = true;
    this.auditQuestionData.nc_corrective_action_plan.correctivePlanNote = this.correctivePlanNoteValue;
  }

  onCorrectivePlanOwnerIDChange() {
    this.isCorrectivePlanChanged = true;
    this.auditQuestionData.nc_corrective_action_plan.owner_name_id = this.ownerIDValue;
  }

  onCorrectivePlannedDateChange() {
    this.isCorrectivePlanChanged = true;
    this.auditQuestionData.nc_corrective_action_plan.planned_completion_date = this.correctivePlannedDateValue;
  }

  onCorrectiveActualDateChange() {
    this.isCorrectivePlanChanged = true;
    this.auditQuestionData.nc_corrective_action_plan.actual_completion_date = this.correctiveActualDateValue;
  }

  onCorrectivePlanLinkInputChange() {
    this.isCorrectivePlanChanged = true;
    this.auditQuestionData.nc_corrective_action_plan.link = this.correctivePlanLinkInput;
  }

  onCorrectivePlanActiveStatusOptionChange() {
    this.isCorrectivePlanChanged = true;
    this.auditQuestionData.nc_corrective_action_plan.corrective_action_status = this.actionStatusSelectedOption;
  }

  onRootCauseResponseChange() {
    this.isRootCauseChanged = true;
    this.auditQuestionData.nc_root_cause.rootCauseNote = this.rootCauseNoteValue;
  }

  onRootCauseLinkInputChange() {
    this.isRootCauseChanged = true;
    this.auditQuestionData.nc_root_cause.link = this.rootCauseLinkInput;
  }


  ngAfterViewInit() {
    this.renderer.listen('document', 'click', (event: Event) => {
      if (this.correctiveActionStatusDropdown && !this.correctiveActionStatusDropdown.nativeElement.contains(event.target)) {
        this.isActionStatusCategoryDropdownOpen = false;
      }
    });
  }

  onActionStatusDropdownClick(): void {
    this.isActionStatusCategoryDropdownOpen = !this.isActionStatusCategoryDropdownOpen;
  }

  openResponseHistory() {
    const auditResponseHistory: any[] = Array.isArray(this.questionData?.history) ? this.questionData.history : [];
    auditResponseHistory.forEach((response: any) => {
      response.color = '';
      response.lineHeight = 0;
    });
    const dialogReference = this.dialog.open(FindingsAuditProgressDialogComponent, {
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

  openFindingsResponse(): void {
    const dialogReference = this.dialog.open(FindingsResponseDialogComponent, {
      disableClose: true,
      width: '654px',
      height: '408px',
      panelClass: 'findings-response-dialog-container',
      data: { findingsResponsesData: this.findingsResponsesData }
    });
    dialogReference.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  onSave() {
    if (!this.hasDraftContent()) {
      return;
    }
    this.saveDraft();
    this.audirService.showSuccess('Draft saved');
    this.dialogRef.close('saved');
  }

  onSubmitResponseHistory() {
    if (!this.checkResponseAvailability()) {
      return;
    }
    const confirmed = window.confirm('Submit response to history?');
    if (!confirmed) {
      return;
    }
    this.saveCorrectionsResponse();
    this.saveRootCauseResponse();
    this.saveCorrectivePlanResponse();
    this.clearDraft();
    this.audirService.showSuccess('Response submitted to history');
    // refresh history data
    const payload = {
      audit_id: this.auditQuestionData.audit_id,
      template: this.auditQuestionData.template,
      template_type: this.auditQuestionData.template_type,
      question: this.data.questionText,
      email: this.auditQuestionData.email
    };
    this.audirService.getNCQuestionData(payload).subscribe((response: any) => {
      if (response) {
        this.questionData = response;
      }
    });
  }

  onSubmitConfirmation(){
    const dialogRef = this.dialog.open(ApprovalRemarksDialogComponent, {
          disableClose: true,
          data : {isQuestionSubmit : true}
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.onSubmit(result);
          }
        });
    
  }
  onSubmit(result: any){
    const submitResponse = {
      audit_id : this.auditQuestionData.audit_id,
      email : this.auditQuestionData.email,
      approval_status : result.approval_status,
      auditor_remarks : result.auditor_remarks,
      audit_finding_id : this.questionData?.audit_finding_id
    }
    this.audirService.submitNCQuestion(submitResponse).subscribe((response: any) => {
      if (response) {
        console.log(response.msg);
        this.clearDraft();
        this.audirService.showSuccess('Question submitted successfully');
      }
    }, (error: any) => {
      this.noErrors = false;
      this.audirService.showError('Error while submitting !');
      console.error('Error saving correction responses:', error);
    });
  }

  saveCorrectionsResponse() {
    const saveCorrectionsResponsePayload = new FormData();
    saveCorrectionsResponsePayload.append('audit_id', this.auditQuestionData.audit_id);
    saveCorrectionsResponsePayload.append('template', this.auditQuestionData.template);
    saveCorrectionsResponsePayload.append('template_type', this.auditQuestionData.template_type);
    saveCorrectionsResponsePayload.append('question', this.auditQuestionData.question);
    saveCorrectionsResponsePayload.append('email', this.auditQuestionData.email);
    saveCorrectionsResponsePayload.append('notes', this.auditQuestionData.nc_correction.correctionsNote);
    saveCorrectionsResponsePayload.append('link', this.auditQuestionData.nc_correction.link);
    saveCorrectionsResponsePayload.append('attach_evidence', this.auditQuestionData.nc_correction.attach_evidence);
    saveCorrectionsResponsePayload.append('planned_completion_date', this.auditQuestionData.nc_correction.plannedCompletionDate);
    saveCorrectionsResponsePayload.append('actual_completion_date', this.auditQuestionData.nc_correction.actualCompletionDate);
    saveCorrectionsResponsePayload.append('audit_finding_id', this.questionData?.audit_finding_id);
    this.audirService.saveCorrectionsResponse(saveCorrectionsResponsePayload).subscribe((response: any) => {
      if (response) {
        console.log(response.msg);
      }
    }, (error: any) => {
      this.noErrors = false;
      console.error('Error saving correction responses:', error);
    });
  }

  saveRootCauseResponse() {
    const saveRootCausePayload = new FormData();
    saveRootCausePayload.append('audit_id', this.auditQuestionData.audit_id);
    saveRootCausePayload.append('template', this.auditQuestionData.template);
    saveRootCausePayload.append('template_type', this.auditQuestionData.template_type);
    saveRootCausePayload.append('question', this.auditQuestionData.question);
    saveRootCausePayload.append('email', this.auditQuestionData.email);
    saveRootCausePayload.append('notes', this.auditQuestionData.nc_root_cause.rootCauseNote);
    saveRootCausePayload.append('link', this.auditQuestionData.nc_root_cause.link);
    saveRootCausePayload.append('attach_evidence', this.auditQuestionData.nc_root_cause.attach_evidence);
    saveRootCausePayload.append('audit_finding_id', this.questionData?.audit_finding_id);
    this.audirService.saveRootCauseResponse(saveRootCausePayload as any).subscribe((response: any) => {
      if (response) {
        console.log(response.msg);
      }
    }, (error: any) => {
      this.noErrors = false;
      console.error('Error saving root cause response:', error);
    });
  }

  saveCorrectivePlanResponse() {
    const saveCorrectivePlanResponsePayload = new FormData();
    saveCorrectivePlanResponsePayload.append('audit_id', this.auditQuestionData.audit_id);
    saveCorrectivePlanResponsePayload.append('template', this.auditQuestionData.template);
    saveCorrectivePlanResponsePayload.append('template_type', this.auditQuestionData.template_type);
    saveCorrectivePlanResponsePayload.append('question', this.auditQuestionData.question);
    saveCorrectivePlanResponsePayload.append('email', this.auditQuestionData.email);
    saveCorrectivePlanResponsePayload.append('notes', this.auditQuestionData.nc_corrective_action_plan.correctivePlanNote);
    saveCorrectivePlanResponsePayload.append('link', this.auditQuestionData.nc_corrective_action_plan.link);
    saveCorrectivePlanResponsePayload.append('attach_evidence', this.auditQuestionData.nc_corrective_action_plan.attach_evidence);
    saveCorrectivePlanResponsePayload.append('owner_name_id', this.auditQuestionData.nc_corrective_action_plan.owner_name_id);
    saveCorrectivePlanResponsePayload.append('planned_completion_date', this.auditQuestionData.nc_corrective_action_plan.planned_completion_date);
    saveCorrectivePlanResponsePayload.append('actual_completion_date', this.auditQuestionData.nc_corrective_action_plan.actual_completion_date);
    saveCorrectivePlanResponsePayload.append('corrective_action_status', this.auditQuestionData.nc_corrective_action_plan.corrective_action_status);
    saveCorrectivePlanResponsePayload.append('audit_finding_id', this.questionData?.audit_finding_id);
    this.audirService.savesCorrectiveActionPlanResponse(saveCorrectivePlanResponsePayload).subscribe((response: any) => {
      if (response) {
        console.log(response.msg);
      }
    }, (error: any) => {
      this.noErrors = false;
      console.error('Error saving corrective action plan response:', error);
    });
  }

  uploadCorrectionsEvidence(event: any) {
    this.correctionsEvidenceFile = event.target.files[0];
    if (!this.correctionsEvidenceFile) {
      this.audirService.showError('Uploading evidence failed');
      return;
    }
    // if (this.correctionsEvidenceFile.type !== 'application/pdf') {
    //   this.audirService.showError('Only PDF file is allowed');
    //   console.log('Upload only PDF file');
    //   return;
    // }
    if (this.correctionsEvidenceFile.size >= this.fileSize) {
      this.audirService.showError('Only below 1 MB file size is allowed');
      console.log('Upload file size below 1 MB');
      return;
    }
    this.isCorrectionsChanged = true;
    this.uploadCorrectionsEvidenceText = this.correctionsEvidenceFile.name;
    this.auditQuestionData.nc_correction.attach_evidence = this.correctionsEvidenceFile;
    this.audirService.showSuccess('Uploaded Evidence Successful');
    console.log('Evidence file uploaded successfully.');
  }

  uploadRootCauseEvidence(event: any) {
    this.rootCauseEvidenceFile = event.target.files[0];
    if (!this.rootCauseEvidenceFile) {
      this.audirService.showError('Uploading evidence file failed');
      return;
    }
    // if (this.rootCauseEvidenceFile.type !== 'application/pdf') {
    //   this.audirService.showError('Only PDF file is allowed');
    //   console.log('Upload only PDF file');
    //   return;
    // }
    if (this.rootCauseEvidenceFile.size >= this.fileSize) {
      this.audirService.showError('Only below 1 MB file size is allowed');
      console.log('Upload file size below 1 MB');
      return;
    }
    this.isRootCauseChanged = true;
    this.uploadRootCauseResponseFileText = this.rootCauseEvidenceFile.name;
    this.auditQuestionData.nc_root_cause.attach_evidence = this.rootCauseEvidenceFile;
    this.audirService.showSuccess('Uploaded Evidence Successful');
    console.log('Evidence file uploaded successfully.');
  }

  uploadCorrectiveStatusEvidence(event: any) {
    this.correctiveStatusEvidenceFile = event.target.files[0];
    if (!this.correctiveStatusEvidenceFile) {
      this.audirService.showError('Uploading evidence file failed');
      return;
    }
    // if (this.correctiveStatusEvidenceFile.type !== 'application/pdf') {
    //   this.audirService.showError('Only PDF file is allowed');
    //   console.log('Upload only PDF file');
    //   return;
    // }
    if (this.correctiveStatusEvidenceFile.size >= this.fileSize) {
      this.audirService.showError('Only below 1 MB file size is allowed');
      console.log('Upload file size below 1 MB');
      return;
    }
    this.isCorrectivePlanChanged = true;
    this.uploadCorrectiveActionStatusFileName = this.correctiveStatusEvidenceFile.name;
    this.auditQuestionData.nc_corrective_action_plan.attach_evidence = this.correctiveStatusEvidenceFile;
    this.audirService.showSuccess('Uploaded Evidence Successful');
    console.log('Evidence file uploaded successfully.');
  }

  checkResponseAvailability() {
    return this.hasDraftContent();
  }

  checkCorrectionsResponse() {
    return ((this.correctionsEvidenceFile || (this.correctionsNoteValue !== '') || (this.correctionsLinkInput !== ''))
      && ((this.correctionPlannedCompletionDateValue !== '') && (this.correctionActualCompletionDateValue !== '')));
  }

  checkRootCauseResponse() {
    return (this.rootCauseEvidenceFile || (this.rootCauseLinkInput !== '') || (this.rootCauseNoteValue !== ''));
  }

  checkCorrectivePlanResponse() {
    return ((this.correctiveStatusEvidenceFile || (this.correctivePlanNoteValue !== '') || (this.ownerIDValue !== '') ||
      (this.correctivePlanLinkInput !== '') || (this.actionStatusSelectedOption !== '')) &&
      ((this.correctivePlannedDateValue !== '') && (this.correctiveActualDateValue !== '')));
  }
}

import { Component, ElementRef, Inject, Renderer2, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AudirService } from 'src/services/audir-services.service';
import { FindingsAuditProgressDialogComponent } from '../findings-audit-progress-dialog/findings-audit-progress-dialog.component';
import { DatePipe } from '@angular/common';

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
    this.maxDateTime = this.datePipe.transform(this.data.auditInfo.end_date, 'yyyy-MM-dd\'T\'HH:mm:ss', 'UTC');
    this.minDateTime = this.datePipe.transform(this.data.auditInfo.start_date, 'yyyy-MM-dd\'T\'HH:mm:ss', 'UTC');
    this.getQuestionData();
  }

  fillExistingResponses() {
    this.uploadCorrectionsEvidenceText = this.questionData.nc_correction[0] ? this.questionData.nc_correction[0].attach_evidence : '';
    this.uploadRootCauseResponseFileText = this.questionData.nc_root_cause[0] ? this.questionData.nc_root_cause[0].attach_evidence : '';
    this.uploadCorrectiveActionStatusFileName = this.questionData.nc_corrective_action_plan[0] ? this.questionData.nc_corrective_action_plan[0].attach_evidence : '';
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
    this.downloadFileEvidence(this.uploadRootCauseResponseFileText, 'nc_root_cause');
    this.downloadFileEvidence(this.uploadCorrectionsEvidenceText, 'nc_correction');
    this.downloadFileEvidence(this.uploadCorrectiveActionStatusFileName, 'nc_corrective_action_plan');
    this.isCorrectionsChanged = false;
    this.isRootCauseChanged = false;
    this.isCorrectivePlanChanged = false;
  }

  downloadFileEvidence(attach_evidence_file_Name: any, responseType: any) {
    if (attach_evidence_file_Name !== '') {
      this.audirService.getNCEvidence(this.auditQuestionData.audit_id, attach_evidence_file_Name, responseType).subscribe((response: any) => {
        if (response) {
          const lastModifiedDate = new Date();
          const file = new File([response], attach_evidence_file_Name, {
            lastModified: lastModifiedDate.getTime()
          });
          if (responseType === 'nc_root_cause') {
            this.rootCauseEvidenceFile = file;
            this.auditQuestionData.nc_root_cause.attach_evidence = this.rootCauseEvidenceFile;
          }
          else if (responseType === 'nc_correction') {
            this.correctionsEvidenceFile = file;
            this.auditQuestionData.nc_correction.attach_evidence = this.correctionsEvidenceFile;
          }
          else if (responseType === 'nc_corrective_action_plan') {
            this.correctiveStatusEvidenceFile = file;
            this.auditQuestionData.nc_corrective_action_plan.attach_evidence = this.correctiveStatusEvidenceFile;
          }
        }
      }, (error: any) => {
        console.error('Error downloading evidence file:', error);
      });
    }
  }

  setQuestionData() {
    this.auditQuestionData.audit_id = this.auditInfo.audit_id;
    this.auditQuestionData.template = this.auditInfo.function_template[0];
    this.auditQuestionData.template_type = 'function_template';
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
    this.audirService.getNCQuestionData(payload).subscribe((response: any) => {
      if (response) {
        this.questionData = response;
        this.fillExistingResponses();

      }
    }, (error: any) => {
      this.noErrors = false;
      console.error('Error saving audit findings:', error);
    });
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
    const auditResponseHistory: any = this.questionData?.history;
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

  onSave() {
    this.noErrors = true;
    if (this.checkCorrectionsResponse() && this.isCorrectionsChanged) {
      this.saveCorrectionsResponse();
    }
    if (this.checkCorrectivePlanResponse() && this.isCorrectivePlanChanged) {
      this.saveCorrectivePlanResponse();
    }
    if (this.checkRootCauseResponse() && this.isRootCauseChanged) {
      this.saveRootCauseResponse();
    }
    if (this.noErrors) {
      this.audirService.showSuccess('Response saved successfully');
      this.dialogRef.close('saved');
    }
    else {
      console.log('Responses not saved successfully, please save again')
    }
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
    this.isCorrectivePlanChanged = true;
    this.uploadCorrectiveActionStatusFileName = this.correctiveStatusEvidenceFile.name;
    this.auditQuestionData.nc_corrective_action_plan.attach_evidence = this.correctiveStatusEvidenceFile;
    this.audirService.showSuccess('Uploaded Evidence Successful');
    console.log('Evidence file uploaded successfully.');
  }

  checkResponseAvailability() {
    return ((this.checkCorrectionsResponse() && this.isCorrectionsChanged)
      || (this.checkRootCauseResponse() && this.isRootCauseChanged)
      || (this.checkCorrectivePlanResponse() && this.isCorrectivePlanChanged));
  }

  checkCorrectionsResponse() {
    return (this.correctionsEvidenceFile || (this.correctionsNoteValue !== '') || (this.correctionsLinkInput !== '') || (this.correctionPlannedCompletionDateValue !== '') || (this.correctionActualCompletionDateValue !== ''));
  }

  checkRootCauseResponse() {
    return (this.rootCauseEvidenceFile || (this.rootCauseLinkInput !== '') || (this.rootCauseNoteValue !== ''));
  }

  checkCorrectivePlanResponse() {
    return (this.correctiveStatusEvidenceFile || (this.correctivePlanNoteValue !== '') || (this.ownerIDValue !== '') || (this.correctivePlannedDateValue !== '') ||
      (this.correctiveActualDateValue !== '') || (this.correctivePlanLinkInput !== '') || (this.actionStatusSelectedOption !== ''));
  }
}

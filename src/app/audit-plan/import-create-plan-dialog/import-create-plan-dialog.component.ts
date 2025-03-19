import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AudirService } from 'src/services/audir-services.service';

@Component({
  selector: 'app-import-create-plan-dialog',
  templateUrl: './import-create-plan-dialog.component.html',
  styleUrls: ['./import-create-plan-dialog.component.scss']
})
export class ImportCreatePlanDialogComponent {
  email: any;
  isDownloaded: boolean | undefined;
  isUploaded: boolean | undefined;
  file: File | null = null;
  isValidated: boolean | undefined;
  isCreated: boolean | undefined;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router, private audirService: AudirService,) {
    this.email = localStorage.getItem('user')?.toString() || '';
  }

  closeDialog() {
    this.router.navigate(['/auditPlan']);
  }

  downloadPlanTemplate(): any {
    this.audirService.downloadAuditPlan().subscribe(
      (response: ArrayBuffer) => {
        const blobData = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const templateFileURL = URL.createObjectURL(blobData);
        const templateDownloadLink = document.createElement('a');
        templateDownloadLink.href = templateFileURL;
        templateDownloadLink.download = 'Audit_plan.xlsx';
        templateDownloadLink.click();
        URL.revokeObjectURL(templateFileURL);
        this.isDownloaded = true;
        this.audirService.showSuccess('Audit_plan.xlsx downloaded successfully');
      }, (error: any) => {
        this.isDownloaded = false;
        console.error('Error for downloading plan template file:', error);
        this.audirService.showError('Download failed');
      }
    );
  }

  uploadTemplate(event: any) {
    this.file = event.target.files[0];
    if (!this.file) {
      this.isUploaded = false;
      this.audirService.showError('Upload failed');
      return;
    }
    this.isUploaded = true;
    this.audirService.showSuccess('Upload Successful');
    console.log('Excel file uploaded successfully.');
  }

  validateTemplate() {
    if (!this.file) {
      this.isValidated = false;
      this.audirService.showError('Audit plan validation failed, please upload correct file');
      return;
    }
    if (this.isUploaded) {
      const validateFormData = new FormData();
      validateFormData.append('uploadAuditPlan', this.file);
      validateFormData.append('eMail', this.email);
      this.audirService.validatePlan(validateFormData).subscribe((result: any) => {
        this.isValidated = true;
        console.log(result);
        this.audirService.showSuccess('Audit plan validation successful');
      }, (error: any) => {
        this.isValidated = false;
        this.audirService.showError('Audit plan validation failed');
        console.error('Error for validating plan template file:', error);
      })
    } else {
      this.isValidated = false;
    }
  }

  createPlan() {
    if (!this.file) {
      this.audirService.showError('Upload failed, please upload correct file');
      this.isCreated = false;
      return;
    }
    if (this.isValidated) {
      const createFormData = new FormData();
      createFormData.append('uploadAuditPlan', this.file);
      createFormData.append('eMail', this.email);
      this.audirService.createPlans(createFormData).subscribe((result: any) => {
        this.isCreated = true;
        this.audirService.showSuccess('Audit plan created successfully');
        console.log(result);
      }, (error: any) => {
        this.isCreated = false;
        this.audirService.showError('Failed to create audit plan');
        console.error('Error for creation of audit plan:', error);
      })
    } else {
      this.isCreated = false;
    }
  }
}

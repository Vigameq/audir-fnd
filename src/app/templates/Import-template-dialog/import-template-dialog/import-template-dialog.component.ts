import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AudirService } from 'src/services/audir-services.service';

@Component({
  selector: 'app-import-template-dialog',
  templateUrl: './import-template-dialog.component.html',
  styleUrls: ['./import-template-dialog.component.scss']
})
export class ImportTemplateDialogComponent {
  email: any;
  isDownloaded: boolean | undefined;
  isUploaded: boolean | undefined;
  file: File | null = null;
  isTemplateName: boolean | undefined;
  isCreated: boolean | undefined;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router, private audirService: AudirService,) {
    this.email = localStorage.getItem('user')?.toString() || '';
  }

  closeDialog() {
    this.router.navigate(['/templates']);
  }

  downloadTemplate(): any {
    this.audirService.downloadTemplate().subscribe(
      (response: ArrayBuffer) => {
        const blobData = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const templateFileURL = URL.createObjectURL(blobData);
        const templateDownloadLink = document.createElement('a');
        templateDownloadLink.href = templateFileURL;
        templateDownloadLink.download = 'Audit_Template.xlsx';
        templateDownloadLink.click();
        URL.revokeObjectURL(templateFileURL);
        this.isDownloaded = true;
        this.audirService.showSuccess('Audit_template.xlsx downloaded successfully');
      }, (error: any) => {
        this.isDownloaded = false;
        console.error('Error for downloading plan template file:', error);
        this.audirService.showError('Download failed');
      }
    );
  }

  uploadAuditTemplate(event: any) {
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

  templateName() {
    if (!this.file) {
      this.isTemplateName = false;
      this.audirService.showError('Audit plan validation failed, please upload correct file');
      return;
    }
    if (this.isUploaded) {
      const validateFormData = new FormData();
      validateFormData.append('uploadAuditPlan', this.file);
      validateFormData.append('eMail', this.email);
      this.audirService.validatePlan(validateFormData).subscribe((result: any) => {
        this.isTemplateName = true;
        console.log(result);
        this.audirService.showSuccess('Audit plan validation successful');
      }, (error: any) => {
        this.isTemplateName = false;
        this.audirService.showError('Audit plan validation failed');
        console.error('Error for validating plan template file:', error);
      })
    } else {
      this.isTemplateName = false;
    }
  }
}

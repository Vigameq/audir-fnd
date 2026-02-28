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
  templateFile!: File;
  isTemplateName: boolean | undefined;
  isCreated: boolean | undefined;
  templateNameValue = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router, private audirService: AudirService,) {
    this.email = localStorage.getItem('user')?.toString() || '';
  }

  closeDialog() {
    this.router.navigate(['/templates']);
  }

  downloadTemplate(): any {
    try {
      const filename = 'audir_template.xlsx';
      const templateDownloadLink = document.createElement('a');
      templateDownloadLink.href = 'assets/templates/audir_template.xlsx';
      templateDownloadLink.download = filename;
      templateDownloadLink.click();
      this.isDownloaded = true;
      this.audirService.showSuccess(`${filename} downloaded successfully`);
    } catch (error: any) {
      this.isDownloaded = false;
      console.error('Error for downloading template file:', error);
      this.audirService.showError('Download failed');
    }
  }

  uploadAuditTemplate(event: any) {
    this.templateFile = event.target.files[0];
    if (!this.templateFile) {
      this.isUploaded = false;
      this.audirService.showError('Upload failed');
      return;
    }
    this.isUploaded = true;
    this.audirService.showSuccess('Upload Successful');
    console.log('Excel file uploaded successfully.');
  }

  createTemplateName() {
    this.isTemplateName = true;
  }

  importTemplate() {
    if (this.isTemplateName && this.isUploaded) {
      const templateData = new FormData();
      templateData.append('uploadTemplate', this.templateFile);
      templateData.append('eMail', this.email);
      templateData.append('type', this.templateNameValue);
      this.audirService.uploadTemplate(templateData).subscribe((result: any) => {
        this.isCreated = true;
        this.audirService.showSuccess('Audit plan created successfully');
      }, (error: any) => {
        this.isCreated = false;
        this.audirService.showError('Failed to create audit Template');
        console.error('Error for creation of audit Template:', error);
      })
    } else {
      this.isCreated = false;
    }
  }
}

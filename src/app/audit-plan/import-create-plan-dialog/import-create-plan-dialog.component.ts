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
  isUploaded: boolean = false;
  file: File | null = null;
  isValidated: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router, private audirService: AudirService,) {
    this.email = localStorage.getItem('user')?.toString() || '';
  }

  closeDialog() {
    this.router.navigate(['/auditPlan']);
  }

  downloadTemplate(): any {
    this.audirService.downloadTemplate().subscribe(
      (response: ArrayBuffer) => {
        const blobData = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const templateFileURL = URL.createObjectURL(blobData);
        const templateDownloadLink = document.createElement('a');
        templateDownloadLink.href = templateFileURL;
        templateDownloadLink.download = 'planTemplate.xlsx';
        templateDownloadLink.click();
        URL.revokeObjectURL(templateFileURL);
      },
      (error: any) => {
        console.error('Error downloading plan template file:', error);
      }
    );
  }

  uploadTemplate(event: any) {
    this.file = event.target.files[0];
    if (!this.file) {
      return;
    }
    // const reader: FileReader = new FileReader();
    // reader.onload = () => {
      console.log('Excel file uploaded successfully.');
    // };
    this.isUploaded = true;
    //reader.readAsArrayBuffer(this.file); 
  }

  validateTemplate() {
    if (!this.file) {
      return;
    }
    if (this.isUploaded) {
      const validateFormData = new FormData();
      validateFormData.append('uploadAuditPlan', this.file);
      validateFormData.append('eMail', this.email);
      this.audirService.validatePlan(validateFormData).subscribe((result: any) => {
        this.isValidated = true;
        console.log(result);
      })
    }
  }

  createPlan() {
    if (!this.file) {
      return;
    }
    if(this.isValidated){
      const createFormData = new FormData();
      createFormData.append('uploadAuditPlan', this.file);
      createFormData.append('eMail', this.email);
      this.audirService.createPlans(createFormData).subscribe((result:any)=>{
        console.log(result);
      })
    }
  }
}

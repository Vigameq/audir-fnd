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

  uploadTemplate() {

  }

  validateTemplate() {

  }

  createPlan() {

  }
}

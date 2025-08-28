import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-findings-response-dialog',
  templateUrl: './findings-response-dialog.component.html',
  styleUrls: ['./findings-response-dialog.component.scss']
})
export class FindingsResponseDialogComponent {
  auditFindingsResponse: any[] | undefined;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }
  ngOnInit(): void {
    this.auditFindingsResponse = this.data.findingsResponsesData;
  }
}

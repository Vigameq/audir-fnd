import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auditor-remarks',
  templateUrl: './auditor-remarks.component.html',
  styleUrls: ['./auditor-remarks.component.scss']
})
export class AuditorRemarksComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router) {
  }
  closeDialog() {
    this.router.navigate(['/templates']);
  }
}

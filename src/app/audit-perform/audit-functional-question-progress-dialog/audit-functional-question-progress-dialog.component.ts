import { Component, AfterViewInit, QueryList, ViewChildren, ElementRef, ChangeDetectorRef, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AudirService } from 'src/services/audir-services.service';

@Component({
  selector: 'app-audit-functional-question-progress-dialog',
  templateUrl: './audit-functional-question-progress-dialog.component.html',
  styleUrls: ['./audit-functional-question-progress-dialog.component.scss']
})
export class AuditFunctionalQuestionProgressDialogComponent {
  @ViewChildren('statusContent') statusContentElements!: QueryList<ElementRef>;
  auditResponseHistory: any[] = [];

  constructor(private cdr: ChangeDetectorRef, public dialogRef: MatDialogRef<AuditFunctionalQuestionProgressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private audirService: AudirService) { }

  ngOnInit(): void {
    this.auditResponseHistory = this.data.auditResponseHistory;
    this.auditResponseHistory.forEach(auditStatusElement => {
      auditStatusElement.color = this.getRandomColorForDots();
    });
  }

  updateLineHeights() {
    this.statusContentElements.forEach((element, index) => {
      this.updateLineHeight(index, element.nativeElement);
    });
  }

  updateLineHeight(index: number, statusContent: HTMLElement) {
    if (index < this.auditResponseHistory.length - 1) {
      const newLineHeight = statusContent.offsetHeight - 40;
      if (this.auditResponseHistory[index].lineHeight !== newLineHeight) {
        this.auditResponseHistory[index].lineHeight = newLineHeight;
        this.cdr.detectChanges();
      }
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.updateLineHeights();
      this.statusContentElements.forEach((element, index) => {
        const observer = new ResizeObserver(() => {
          this.updateLineHeight(index, element.nativeElement);
        });
        observer.observe(element.nativeElement);
      });
      this.cdr.detectChanges();
    }, 0);
  }

  getRandomColorForDots(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  closeResponseDialog(): void {
    this.dialogRef.close();
  }

  downloadEvidence(responseData: any) {
    this.audirService.getEvidence(this.data.auditQuestionData.audit_id, responseData.attach_evidence).subscribe((response: any) => {
      if (response) {
        const blobData = new Blob([response], { type: 'application/pdf' });
        const evidenceFileURL = URL.createObjectURL(blobData);
        const templateDownloadLink = document.createElement('a');
        templateDownloadLink.href = evidenceFileURL;
        templateDownloadLink.download = responseData.attach_evidence;
        templateDownloadLink.click();
        URL.revokeObjectURL(evidenceFileURL);
        this.audirService.showSuccess(responseData.attach_evidence + ' file downloaded successfully');
        console.log('Successfully downloading' + responseData.attach_evidence + ' file');
      }
    }, (error: any) => {
      console.error('Error downloading evidence file:', error);
    });
  }
}

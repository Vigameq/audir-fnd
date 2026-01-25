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
  //colors : string[] = ["#dd0000", "#5500dd", "#00b4dd", "#00dd63", "#ddd600", "#dd9900", "#00bedd", "#dd00d6", "#00ddb4", "#9200dd"]

  constructor(private cdr: ChangeDetectorRef, public dialogRef: MatDialogRef<AuditFunctionalQuestionProgressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private audirService: AudirService) { }

  canShowHistoryDetails(elementStatus: any) {
    if (this.data?.isQuestionSubmitted) {
      return true;
    }
    if (this.data?.isAuditor) {
      return elementStatus.type !== 'auditee_response';
    }
    return elementStatus.type !== 'audit_findings' && elementStatus.type !== 'auditor_notes';
  }

  ngOnInit(): void {
    this.auditResponseHistory = this.data.auditResponseHistory;
    this.auditResponseHistory.forEach((auditStatusElement,i) => {
      if(auditStatusElement.type === "auditee_response"){
          auditStatusElement.color = "#3a93df"
      }else if(auditStatusElement.type === "audit_findings"){
          auditStatusElement.color = "#ff852e"
      }else{
          auditStatusElement.color = "#a6bf1e"
      }      
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
    this.dialogRef.close(false);
  }

  downloadEvidence(responseData: any) {
    const safeFileName = encodeURIComponent(responseData.attach_evidence || '');
    const url = `${this.audirService.apiBaseUrl()}/api/questionDataFile/${this.data.auditQuestionData.audit_id}/${safeFileName}`;
    window.open(url, '_blank');
  }
}

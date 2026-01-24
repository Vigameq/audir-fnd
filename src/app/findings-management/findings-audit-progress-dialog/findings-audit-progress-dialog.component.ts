import { Component, AfterViewInit, QueryList, ViewChildren, ElementRef, ChangeDetectorRef, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AudirService } from 'src/services/audir-services.service';

@Component({
  selector: 'app-findings-audit-progress-dialog',
  templateUrl: './findings-audit-progress-dialog.component.html',
  styleUrls: ['./findings-audit-progress-dialog.component.scss']
})
export class FindingsAuditProgressDialogComponent {
  @ViewChildren('statusContent') statusContentElements!: QueryList<ElementRef>;
  auditResponseHistory: any[] = [];
  //colors : string[] = ["#dd0000", "#5500dd", "#00b4dd", "#00dd63", "#ddd600", "#dd9900", "#00bedd", "#dd00d6", "#00ddb4", "#9200dd"]

  constructor(private cdr: ChangeDetectorRef, public dialogRef: MatDialogRef<FindingsAuditProgressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private audirService: AudirService) { }

  ngOnInit(): void {
    this.auditResponseHistory = this.data.auditResponseHistory;
    this.auditResponseHistory.forEach((auditStatusElement,i) => {
      if(auditStatusElement.type === "nc_correction"){
          auditStatusElement.color = "#3a93df"
      }else if(auditStatusElement.type === "nc_root_cause"){
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
    this.audirService.getNCEvidence(this.data.auditQuestionData.audit_id, responseData.attach_evidence, responseData.type).subscribe((response: any) => {
      if (response?.body) {
        const contentType = response.headers?.get('content-type') || this.detectContentType(response.body, responseData.attach_evidence);
        const blobData = new Blob([response.body], { type: contentType });
        const evidenceFileURL = URL.createObjectURL(blobData);
        window.open(evidenceFileURL, '_blank');
        setTimeout(() => URL.revokeObjectURL(evidenceFileURL), 1000);
        this.audirService.showSuccess(responseData.attach_evidence + ' opened successfully');
        console.log('Successfully opening ' + responseData.attach_evidence);
      }
    }, (error: any) => {
      console.error('Error downloading evidence file:', error);
    });
  }

  private getContentType(fileName: string): string {
    const lower = (fileName || '').toLowerCase();
    if (lower.endsWith('.png')) return 'image/png';
    if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
    if (lower.endsWith('.pdf')) return 'application/pdf';
    return 'application/octet-stream';
  }

  private detectContentType(payload: ArrayBuffer | Blob | string, fileName: string): string {
    try {
      const buffer = payload instanceof ArrayBuffer ? payload : undefined;
      if (buffer) {
        const bytes = new Uint8Array(buffer);
        if (bytes.length >= 4 && bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
          return 'application/pdf';
        }
        if (bytes.length >= 4 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
          return 'image/png';
        }
        if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
          return 'image/jpeg';
        }
      }
    } catch (error) {
      console.warn('Unable to detect content type from payload.', error);
    }
    return this.getContentType(fileName);
  }

}

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

  private getContentType(fileName: string): string {
    const lower = (fileName || '').toLowerCase();
    if (lower.endsWith('.png')) return 'image/png';
    if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
    if (lower.endsWith('.pdf')) return 'application/pdf';
    return 'application/octet-stream';
  }


  private detectContentType(payload: ArrayBuffer | Blob | string, fileName: string): string {
    try {
      if (typeof payload === 'string') {
        const trimmed = payload.trim();
        if (trimmed.startsWith('%PDF-') || trimmed.startsWith('JVBERi0')) {
          return 'application/pdf';
        }
      } else if (payload instanceof ArrayBuffer) {
        const bytes = new Uint8Array(payload);
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

  private isProbablyBase64(value: string): boolean {
    const trimmed = value.trim();
    if (!trimmed || trimmed.length % 4 != 0) return false;
    return /^[A-Za-z0-9+/=]+$/.test(trimmed);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const cleaned = base64.replace(/^data:.*;base64,/, '');
    const binary = atob(cleaned);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private normalizeEvidencePayload(payload: ArrayBuffer | Blob | string): ArrayBuffer | Blob {
    if (payload instanceof ArrayBuffer || payload instanceof Blob) return payload;
    if (typeof payload === 'string') {
      const trimmed = payload.trim();
      if (trimmed.startsWith('data:')) {
        return this.base64ToArrayBuffer(trimmed);
      }
      if (trimmed.startsWith('%PDF-')) {
        return new TextEncoder().encode(trimmed).buffer;
      }
      if (this.isProbablyBase64(trimmed)) {
        return this.base64ToArrayBuffer(trimmed);
      }
      return new TextEncoder().encode(trimmed).buffer;
    }
    return payload as any;
  }



  downloadEvidence(responseData: any) {
    this.audirService.getEvidence(this.data.auditQuestionData.audit_id, responseData.attach_evidence).subscribe((response: any) => {
      if (response?.body) {
        const contentType = response.headers?.get('content-type') || this.detectContentType(response.body, responseData.attach_evidence);
        const payload = this.normalizeEvidencePayload(response.body);
        const blobData = new Blob([payload], { type: contentType });
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
}

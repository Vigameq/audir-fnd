import { Component, AfterViewInit, QueryList, ViewChildren, ElementRef, ChangeDetectorRef, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-audit-functional-question-progress-dialog',
  templateUrl: './audit-functional-question-progress-dialog.component.html',
  styleUrls: ['./audit-functional-question-progress-dialog.component.scss']
})
export class AuditFunctionalQuestionProgressDialogComponent {
  @ViewChildren('statusContent') statusContentElements!: QueryList<ElementRef>;
  statusData: any[] = [];

  constructor(private cdr: ChangeDetectorRef, public dialogRef: MatDialogRef<AuditFunctionalQuestionProgressDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.statusData = this.data.progressData;
    this.statusData.forEach(auditStatusElement => {
      auditStatusElement.color = this.getRandomColorForDots();
    });
  }

  updateLineHeights() {
    this.statusContentElements.forEach((element, index) => {
      this.updateLineHeight(index, element.nativeElement);
    });
  }

  updateLineHeight(index: number, statusContent: HTMLElement) {
    if (index < this.statusData.length - 1) {
      const newLineHeight = statusContent.offsetHeight - 40;
      if (this.statusData[index].lineHeight !== newLineHeight) {
        this.statusData[index].lineHeight = newLineHeight;
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
}

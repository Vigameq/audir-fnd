import { ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ImportTemplateDialogComponent } from './Import-template-dialog/import-template-dialog/import-template-dialog.component';
import { AuditorRemarksComponent } from './Import-template-dialog/auditor-remarks/auditor-remarks.component';
import { AudirService } from 'src/services/audir-services.service';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent {
  templates: any[] = [];
  editedQuestionText: string | undefined = '';
  allQuestions: any[] = [
    {
      questionNumber: 'Question1',
      questionText: 'Does the organization continually improve the suitability, adequacy and effectiveness of the quality management system?',
      showEditIcon: true
    },
    {
      questionNumber: 'Question1',
      questionText: 'Does the organization continually improve the suitability, adequacy and effectiveness of the quality management system?',
      showEditIcon: true
    },
    {
      questionNumber: 'Question1',
      questionText: 'Does the organization continually improve the suitability, adequacy and effectiveness of the quality management system?',
      showEditIcon: true
    },
    {
      questionNumber: 'Question1',
      questionText: 'Does the organization continually improve the suitability, adequacy and effectiveness of the quality management system?',
      showEditIcon: true
    },
    {
      questionNumber: 'Question1',
      questionText: 'Does the organization continually improve the suitability, adequacy and effectiveness of the quality management system?',
      showEditIcon: true
    }, {
      questionNumber: 'Question1',
      questionText: 'Does the organization continually improve the suitability, adequacy and effectiveness of the quality management system?',
      showEditIcon: true
    }
  ];
  selectedFunctionId: any[] = [];
  standardSelectedOption: string = '';
  isImportVisible: boolean = true;

  @ViewChild('standardDropdown') standardDropdown: ElementRef | undefined;
  isStandardDropdownOpen: boolean = false;

  constructor(private renderer: Renderer2, private changeDetectorRef: ChangeDetectorRef, private dialog: MatDialog, private router: Router, private audirService: AudirService) { }

  ngOnInit(): void {
    this.getPlanItems();
  }

  onStandardOptionChange(event: Event) {
    this.selectedFunctionId = [];
    const target = event.target as HTMLSelectElement;
    console.log("Selected Option: ", this.standardSelectedOption, target);
    this.standardSelectedOption = target.value;
  }

  onStandardDropdownClick(): void {
    this.isStandardDropdownOpen = !this.isStandardDropdownOpen;
  }

  ngAfterViewInit() {
    this.renderer.listen('document', 'click', (event: Event) => {
      if (this.standardDropdown && !this.standardDropdown.nativeElement.contains(event.target)) {
        this.isStandardDropdownOpen = false;
      }
    });
  }

  openImportTemplateDialog(): void {
    this.importVisibility();
    const dialogRef = this.dialog.open(ImportTemplateDialogComponent, {
      width: '654px',
      height: '408px',
      data: { id: 'GG196678' }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.getPlanItems();
      this.router.navigate(['/templates']);
      this.importVisibility();
      this.changeDetectorRef.detectChanges();
      console.log(`Dialog result: ${result}`);
    });
  }

  importVisibility() {
    this.isImportVisible = !this.isImportVisible;
  }

  selectFunction(functionItem: any) {
    this.selectedFunctionId = [];
    this.standardSelectedOption = '';
    if (this.selectedFunctionId.includes(functionItem)) {
      this.selectedFunctionId = this.selectedFunctionId.filter(Option => Option.id !== functionItem.id);
    } else {
      this.selectedFunctionId.push(functionItem.id);
    }
  }

  editQuestion(index: number, type: string, questionText?: string) {
    if (type === 'edit' || type === 'cancel') {
      this.allQuestions[index].showEditIcon = type === 'edit' ? false : true;
      this.editedQuestionText = questionText;
      return;
    }
    this.allQuestions[index].showEditIcon = true;
    this.allQuestions[index].questionText = this.editedQuestionText;
    // const dialogRef = this.dialog.open(AuditorRemarksComponent, {
    //   width: '634px',
    //   height: '360px',
    //   data: { id: 'GG196678' }
    // });

    // dialogRef.afterClosed().subscribe((result: any) => {
    //   this.router.navigate(['/templates']);
    //   console.log(`Dialog result: ${result}`);
    // });
  }

  getPlanItems() {
    const email = localStorage.getItem('user')?.toString() || '';
    this.audirService.getPlanItems(email).subscribe((items: any) => {
      if (items) {
        this.templates = items.templates;
      }
    })
  }

  deleteQuestion(index: number) {
    this.allQuestions.splice(index, 1);
  }
}

import { ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AudirService } from 'src/services/audir-services.service';
import { ImportTemplateDialogComponent } from './Import-template-dialog/import-template-dialog.component';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent {
  templates: any[] = [];
  editedQuestionText: string | undefined = '';
  allQuestions: { text: string; draft: string; isEditing: boolean }[] = [];
  selectedFunctionId: any[] = [];
  standardSelectedOption: any = { name: 'Select Template' };
  templateName: string = '';
  isImportVisible: boolean = true;

  @ViewChild('standardDropdown') standardDropdown: ElementRef | undefined;
  isStandardDropdownOpen: boolean = false;

  constructor(private renderer: Renderer2, private changeDetectorRef: ChangeDetectorRef, private dialog: MatDialog, private router: Router, private audirService: AudirService) { }

  ngOnInit(): void {
    this.getTemplates();
  }

  onStandardOptionChange() {
    if (this.templateName !== this.standardSelectedOption.name || this.standardSelectedOption.id === this.selectedFunctionId[0]) {
      this.selectedFunctionId = [];
      this.templateName = this.standardSelectedOption.name;
      this.getTemplateQuestions(this.standardSelectedOption.id);
      localStorage.setItem("selectedTemplate", JSON.stringify(this.standardSelectedOption));
    }
  }

  getTemplateQuestions(template_id: number) {
    this.audirService.getTemplate(template_id).subscribe((templateDetails: any) => {
      if (templateDetails) {
        const questions = Array.isArray(templateDetails.questions) ? templateDetails.questions : [];
        this.allQuestions = questions.map((question: string) => ({
          text: question,
          draft: question,
          isEditing: false
        }));
      }
    }, (error: any) => {
      console.error('Error for getting template details:', error);
    })
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
      disableClose: true,
      width: '654px',
      height: '408px',
      data: { id: 'GG196678' }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.getTemplates();
      this.router.navigate(['/templates']);
      this.importVisibility();
      this.changeDetectorRef.detectChanges();
      console.log(`Dialog result: ${result}`);
    });
  }

  importVisibility() {
    this.isImportVisible = !this.isImportVisible;
  }

  selectTemplateFunction(functionItem: any) {
    if (this.templateName !== functionItem.name || this.standardSelectedOption.id === functionItem.id) {
      this.selectedFunctionId = [];
      this.standardSelectedOption = { name: 'Select Template' };
      // if (this.selectedFunctionId.includes(functionItem)) {
      //   this.selectedFunctionId = this.selectedFunctionId.filter(Option => Option.id !== functionItem.id);
      // } else {
      //   this.selectedFunctionId.push(functionItem.id);
      // }
      this.selectedFunctionId.push(functionItem.id);
      this.templateName = functionItem.name;
      this.getTemplateQuestions(this.selectedFunctionId[0]);
      localStorage.setItem("selectedTemplate", JSON.stringify({}));
    }
  }

  startEdit(index: number) {
    const question = this.allQuestions[index];
    if (!question) {
      return;
    }
    question.isEditing = true;
    question.draft = question.text;
  }

  saveEdit(index: number) {
    const question = this.allQuestions[index];
    if (!question) {
      return;
    }
    const updated = (question.draft || '').trim();
    if (!updated) {
      this.audirService.showError('Question text cannot be empty');
      return;
    }
    question.text = updated;
    question.isEditing = false;
    this.audirService.showSuccess('Question updated');
  }

  cancelEdit(index: number) {
    const question = this.allQuestions[index];
    if (!question) {
      return;
    }
    question.draft = question.text;
    question.isEditing = false;
  }

  getTemplates() {
    const email = localStorage.getItem('user')?.toString() || '';
    const selectedTemplate: any = JSON.parse(localStorage.getItem("selectedTemplate") as any);
    if (selectedTemplate && selectedTemplate?.name) {
      this.standardSelectedOption = selectedTemplate;
      this.templateName = this.standardSelectedOption.name;
      this.getTemplateQuestions(this.standardSelectedOption.id);
    }
    this.audirService.getPlanItems(email).subscribe((planDetails: any) => {
      if (planDetails) {
        this.templates = planDetails.templates;
      }
    }, (error: any) => {
      console.error('Error for getting plan details:', error);
    })
  }

}

import { ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ImportTemplateDialogComponent } from './Import-template-dialog/import-template-dialog/import-template-dialog.component';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent {
  standardDropdownOptions = ['options1', 'option2', 'option3'];
  functionList: any[] = ['Function1Function1Funct', 'Function2FunctFunction1', 'Function3Function1', 'Function1Function1', 'Function2Function1', 'Function3Function2', 'Function1Function4', 'Function2', 'Function3Function13'];
  allQuestions: any[] = [
    {
      questionNumber: 'Question1',
      questionText: 'Howewwwwwwwwwww was the random question, let play chess fastly or slowly and bowl fasttttttttttttttttttttttttttttttttttttttttttttttttt?'
    },
    {
      questionNumber: 'Question1',
      questionText: 'Howewwwwwwwwwww was the random question, let play chess fastly or slowly and bowl fasttttttttttttttttttttttttttttttttttttttttttttttttt?'
    },
    {
      questionNumber: 'Question1',
      questionText: 'Howewwwwwwwwwww was the random question, let play chess fastly or slowly and bowl fasttttttttttttttttttttttttttttttttttttttttttttttttt?'
    },
    {
      questionNumber: 'Question1',
      questionText: 'Howewwwwwwwwwww was the random question, let play chess fastly or slowly and bowl fasttttttttttttttttttttttttttttttttttttttttttttttttt?'
    },
    {
      questionNumber: 'Question1',
      questionText: 'Howewwwwwwwwwww was the random question, let play chess fastly or slowly and bowl fasttttttttttttttttttttttttttttttttttttttttttttttttt?'
    }, {
      questionNumber: 'Question1',
      questionText: 'Howewwwwwwwwwww was the random question, let play chess fastly or slowly and bowl fasttttttttttttttttttttttttttttttttttttttttttttttttt?'
    }
  ]
  selectedFunction: string[] = [];
  standardSelectedOption: string = '';
  isImportVisible: boolean = true;

  @ViewChild('standardDropdown') standardDropdown: ElementRef | undefined;
  isStandardDropdownOpen: boolean = false;

  constructor(private renderer: Renderer2, private changeDetectorRef: ChangeDetectorRef, private dialog: MatDialog, private router: Router) { }

  onStandardOptionChange(event: Event) {
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
      this.router.navigate(['/templates']);
      this.importVisibility();
      this.changeDetectorRef.detectChanges();
      console.log(`Dialog result: ${result}`);
    });
  }

  importVisibility() {
    this.isImportVisible = !this.isImportVisible;
  }

  selectFunction(functionItem: string) {
    if (this.selectedFunction.includes(functionItem)) {
      this.selectedFunction = this.selectedFunction.filter(Option => Option !== functionItem);
    } else {
      this.selectedFunction.push(functionItem);
    }
  }
}

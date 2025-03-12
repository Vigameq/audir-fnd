import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  searchQuery: string = '';
  isFunctionsDropdownOpen: boolean = false;
  isStandardDropdownOpen: boolean = false;
  standardDropdownOptions = ['options1', 'option2', 'option3'];
  standardSelectedOption: string = '';
  functionsDropdownOptions = ['options2', 'option2', 'option3'];
  functionsSelectedOption: string = '';
  reportsData = [
    { name: 'Item 1', standardType: 'This1', functionType: 'function1', city: 'bangalore', country: 'india' },
    { name: 'Item 2', standardType: 'This2', functionType: 'function2', city: 'hyderabad', country: 'india' },
    { name: 'Item 3', standardType: 'This3', functionType: 'function3', city: 'kerala', country: 'india' },
    { name: 'Item 4', standardType: 'This4', functionType: 'function4', city: 'Amaravathi', country: 'india' },
    { name: 'Item 1', standardType: 'This1', functionType: 'function1', city: 'bangalore', country: 'india' },
    { name: 'Item 2', standardType: 'This2', functionType: 'function2', city: 'hyderabad', country: 'india' },
    { name: 'Item 3', standardType: 'This3', functionType: 'function3', city: 'kerala', country: 'india' },
    { name: 'Item 4', standardType: 'This4', functionType: 'function4', city: 'Amaravathi', country: 'india' },
    { name: 'Item 1', standardType: 'This1', functionType: 'function1', city: 'bangalore', country: 'india' },
    { name: 'Item 2', standardType: 'This2', functionType: 'function2', city: 'hyderabad', country: 'india' },
    { name: 'Item 3', standardType: 'This3', functionType: 'function3', city: 'kerala', country: 'india' },
    { name: 'Item 4', standardType: 'This4', functionType: 'function4', city: 'Amaravathi', country: 'india' }
  ];

  @ViewChild('standardDropdown') standardDropdown: ElementRef | undefined;
  @ViewChild('functionsDropdown') functionsDropdown: ElementRef | undefined;

  constructor(private renderer: Renderer2) { }

  onSearch() {
    console.log('Search query:', this.searchQuery);
  }

  clearSearch() {
    this.searchQuery = '';
  }

  onStandardOptionChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    console.log("Selected Option: ", this.standardSelectedOption, target);
    this.standardSelectedOption = target.value;
  }

  onStandardDropdownClick(): void {
    this.isStandardDropdownOpen = !this.isStandardDropdownOpen;
  }
  onFunctionsOptionChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.functionsSelectedOption = target.value;
    console.log("Selected Option: ", this.functionsSelectedOption);
  }

  onFunctionsDropdownClick(): void {
    this.isFunctionsDropdownOpen = !this.isFunctionsDropdownOpen;
  }
  ngAfterViewInit() {
    this.renderer.listen('document', 'click', (event: Event) => {
      if (this.standardDropdown && !this.standardDropdown.nativeElement.contains(event.target)) {
        this.isStandardDropdownOpen = false;
      }
      if (this.functionsDropdown && !this.functionsDropdown.nativeElement.contains(event.target)) {
        this.isFunctionsDropdownOpen = false;
      }

    });
  }
}

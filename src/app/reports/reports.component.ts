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
  standardSelectedOption: string = ''; // The value of the standard selected option
  functionsDropdownOptions = ['options2', 'option2', 'option3'];
  functionsSelectedOption: string = ''; // The value of the function selected option
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
    // You can add logic to filter items or perform search functionality here
  }

  clearSearch() {
    this.searchQuery = ''; // Clear the search input
  }

  // Method to handle dropdown selection change
  onStandardOptionChange(event: Event) {
    const target = event.target as HTMLSelectElement; // Typecast to HTMLSelectElement
    console.log("Selected Option: ", this.standardSelectedOption, target);
    this.standardSelectedOption = target.value; // Get the value of the selected option
  }

  onStandardDropdownClick(): void {
    this.isStandardDropdownOpen = !this.isStandardDropdownOpen;
  }
  // Method to handle dropdown selection change
  onFunctionsOptionChange(event: Event) {
    const target = event.target as HTMLSelectElement; // Typecast to HTMLSelectElement
    this.functionsSelectedOption = target.value; // Get the value of the selected option
    console.log("Selected Option: ", this.functionsSelectedOption);
  }

  onFunctionsDropdownClick(): void {
    this.isFunctionsDropdownOpen = !this.isFunctionsDropdownOpen;
  }
  ngAfterViewInit() {
    // Add a global click event listener
    this.renderer.listen('document', 'click', (event: Event) => {
      // Check if the clicked element is outside the dropdown
      if (this.standardDropdown && !this.standardDropdown.nativeElement.contains(event.target)) {
        this.isStandardDropdownOpen = false; // Close the dropdown if clicked outside
      }
      if (this.functionsDropdown && !this.functionsDropdown.nativeElement.contains(event.target)) {
        this.isFunctionsDropdownOpen = false; // Close the dropdown if clicked outside
      }

    });
  }
}

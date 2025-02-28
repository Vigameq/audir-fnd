import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() displayHeaderName: string = 'Dashboard'; // Receive data from the app component
  @ViewChild('dropdown') dropdown: ElementRef | undefined;
  profileDropdownOptions = ['Gowtham Gadipudi', 'Edit Profile', 'logout'];
  selectedOption: string = this.profileDropdownOptions[0]; // The value of the selected option
  isOpen: boolean = false;

  constructor(private renderer: Renderer2) {}

  // Method to handle dropdown selection change
  onOptionChange(event: Event) {
    const target = event.target as HTMLSelectElement; // Typecast to HTMLSelectElement
    this.selectedOption = target.value; // Get the value of the selected option
    console.log("Selected Option: ", this.selectedOption);
  }

  onDropdownClick(): void {
    this.isOpen = !this.isOpen;
  }

  ngAfterViewInit() {
    // Add a global click event listener
    this.renderer.listen('document', 'click', (event: Event) => {
      // Check if the clicked element is outside the dropdown
      if (this.dropdown && !this.dropdown.nativeElement.contains(event.target)) {
        this.isOpen = false; // Close the dropdown if clicked outside
      }
    });
  }
}

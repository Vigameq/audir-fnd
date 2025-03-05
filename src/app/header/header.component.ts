import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() displayHeaderName: string = 'Dashboard';
  @ViewChild('dropdown') dropdown: ElementRef | undefined;
  profileDropdownOptions = ['Gowtham Gadipudi', 'Edit Profile', 'logout'];
  selectedOption: string = this.profileDropdownOptions[0];
  isOpen: boolean = false;

  constructor(private renderer: Renderer2) {}

  onOptionChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedOption = target.value;
    console.log("Selected Option: ", this.selectedOption);
  }

  onDropdownClick(): void {
    this.isOpen = !this.isOpen;
  }

  ngAfterViewInit() {
    this.renderer.listen('document', 'click', (event: Event) => {
      if (this.dropdown && !this.dropdown.nativeElement.contains(event.target)) {
        this.isOpen = false;
      }
    });
  }
}

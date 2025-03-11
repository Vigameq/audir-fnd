import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() displayHeaderName: any;
  @ViewChild('dropdown') dropdown: ElementRef | undefined;
  profileDropdownOptions = ['Gowtham Gadipudi', 'logout'];
  selectedOption: string = this.profileDropdownOptions[0];
  isOpen: boolean = false;

  constructor(private renderer: Renderer2, private router: Router) {
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.displayHeaderName = localStorage.getItem('header') ? localStorage.getItem('header') : '';
    });
  }

  onOptionChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedOption = target.value;
    console.log("Selected Option: ", this.selectedOption);
    if (this.selectedOption === 'logout') {
      localStorage.setItem('login_success', '');
      localStorage.setItem('header', '');
      this.router.navigate(['/login']);
    }
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

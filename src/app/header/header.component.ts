import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AudirService } from 'src/services/audir-services.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() displayHeaderName: any;
  @ViewChild('dropdown') dropdown: ElementRef | undefined;
  profileDropdownOptions = ['Gowtham Gadipudi', 'Logout'];
  selectedOption: string = this.profileDropdownOptions[0];
  isOpen: boolean = false;

  constructor(private renderer: Renderer2, private router: Router, private audirService: AudirService) {
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
    if (this.selectedOption === 'Logout') {
      localStorage.setItem('login_success', '');
      localStorage.setItem('header', '');
      this.router.navigate(['/login']);
      this.audirService.showSuccess('Logout Successfull');
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

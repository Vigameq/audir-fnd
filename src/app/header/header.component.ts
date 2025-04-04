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
  profileDropdownOptions : any[] = [];
  selectedOption!: string ;
  isOpen: boolean = false;
  userName: any = "";
  userDetails: any;

  constructor(private renderer: Renderer2, private router: Router, private audirService: AudirService) {
    this.userName = localStorage.getItem('user')?localStorage.getItem('user'):""; 
  }

  ngOnInit(): void {
    this.userDetails = localStorage.getItem('userDetails');
    this.profileDropdownOptions = [`${JSON.parse(this.userDetails)?.firstname.charAt(0).toUpperCase() + JSON.parse(this.userDetails)?.firstname.slice(1).toLowerCase()}
       ${JSON.parse(this.userDetails)?.lastName.charAt(0).toUpperCase() + JSON.parse(this.userDetails)?.lastName.slice(1).toLowerCase()}`, 'Logout'];
    this.selectedOption = this.profileDropdownOptions[0];
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
      this.audirService.showSuccess('Logout successful');
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

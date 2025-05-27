import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dropdown-arrow-icons',
  templateUrl: './dropdown-arrow-icons.component.html',
  styleUrls: ['./dropdown-arrow-icons.component.scss']
})
export class DropdownArrowIconsComponent {
  @Input() isOpen: boolean = false;

}

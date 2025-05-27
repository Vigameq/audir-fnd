import { Component, EventEmitter, Output } from '@angular/core';
import { AudirService } from 'src/services/audir-services.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  header: string = '';
  navItems: any[] = [];
  @Output() headerName = new EventEmitter<string>();
  constructor(private audirService: AudirService) {
  }
  ngOnInit(): void {
    this.audirService.getData().subscribe((data: any) => {
      this.navItems = data.navigationItems;
    });
  }

  sendDataToAppComponent(header: string) {
    this.header = header;
    localStorage.setItem('header', this.header);
    this.headerName.emit(this.header);
  }
}

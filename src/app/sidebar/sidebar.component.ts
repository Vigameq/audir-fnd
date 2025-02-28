import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  header: string = '';  // The data to send to app component
  @Output() headerName = new EventEmitter<string>(); // Event emitter to send data

  sendDataToAppComponent(header:string) {
    this.header= header;
    this.headerName.emit(this.header); // Emit the data when the button is clicked
  }

  navItems = [
    { label: 'DASHBOARD', path: 'dashboard',header:'Dashboard', src: 'assets/images/dashboard.png' },
    { label: 'AUDIT PLAN', path: 'auditPlan',header:'Audit Plan', src: 'assets/images/auditPlan.png' },
    { label: 'AUDIT PERFORM', path: 'auditPerform',header:'Audit Perform', src: 'assets/images/auditPerform.png' },
    { label: 'FINDINGS  MANAGEMENT', path: 'findingsManagement',header:'Findings Management', src: 'assets/images/findingsManagement.png' },
    { label: 'TEMPLATES', path: 'templates',header:'Templates', src: 'assets/images/templates.png' },
    { label: 'REPORTS', path: 'reports',header:'Reports', src: 'assets/images/reports.png' },
    { label: 'USER MANAGEMENT', path: 'userManagement',header:'User Management', src: 'assets/images/userManagement.png' }
  ];
}

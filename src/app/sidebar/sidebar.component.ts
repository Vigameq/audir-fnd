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

  private getCurrentRole(): string {
    const details = localStorage.getItem('userDetails');
    if (!details) {
      return '';
    }
    try {
      const parsed = JSON.parse(details);
      return parsed?.role || '';
    } catch {
      return '';
    }
  }

  private getAllowedNavPaths(role: string): string[] | null {
    const roleAccess: Record<string, string[]> = {
      'Lead Auditor': ['dashboard', 'auditPlan', 'auditPerform', 'auditManage', 'findingsManagement', 'templates', 'reports'],
      'Manager': ['dashboard', 'auditPlan', 'auditPerform', 'auditManage', 'findingsManagement', 'templates', 'reports'],
      'Admin': ['dashboard', 'auditPlan', 'auditPerform', 'auditManage', 'findingsManagement', 'templates', 'reports', 'userManagement']
    };
    if (!role) {
      return null;
    }
    return roleAccess[role] || null;
  }
  ngOnInit(): void {
    this.audirService.getData().subscribe((data: any) => {
      const role = this.getCurrentRole();
      const allowed = this.getAllowedNavPaths(role);
      this.navItems = allowed ? data.navigationItems.filter((item: any) => allowed.includes(item.path)) : data.navigationItems;
    });
  }

  sendDataToAppComponent(header: string) {
    this.header = header;
    localStorage.setItem('header', this.header);
    this.headerName.emit(this.header);
  }
}

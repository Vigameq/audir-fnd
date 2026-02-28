import { Component, EventEmitter, Output } from '@angular/core';
import { AudirService } from 'src/services/audir-services.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  header: string = '';
  navItems: any[] = [];
  @Output() headerName = new EventEmitter<string>();
  constructor(private audirService: AudirService, private authService: AuthService) {
  }

  private getCurrentRole(): string {
    return this.authService.getCurrentRole();
  }

  private getAllowedNavPaths(role: string): string[] | null {
    const roleAccess: Record<string, string[]> = {
      'Lead Auditor': ['dashboard', 'auditPlan', 'auditPerform', 'auditManage', 'findingsManagement', 'templates', 'reports'],
      'Manager': ['dashboard', 'auditPlan', 'auditPerform', 'auditManage', 'findingsManagement', 'templates', 'reports', 'userManagement'],
      'Admin': ['dashboard', 'auditPlan', 'auditPerform', 'auditManage', 'findingsManagement', 'templates', 'reports', 'userManagement'],
      'Auditee': ['dashboard', 'auditPerform', 'auditManage', 'findingsManagement', 'reports']
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
      const items = Array.isArray(data?.navigationItems) ? data.navigationItems : [];
      if (allowed) {
        this.navItems = items.filter((item: any) => allowed.includes(item.path));
        return;
      }
      // For unknown roles, keep default navigation but never expose User Management.
      this.navItems = items.filter((item: any) => item?.path !== 'userManagement');
    });
  }

  sendDataToAppComponent(header: string) {
    this.header = header;
    localStorage.setItem('header', this.header);
    this.headerName.emit(this.header);
  }
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuditPlanComponent } from './audit-plan/audit-plan.component';
import { AuditPerformComponent } from './audit-perform/audit-perform.component';
import { FindingsManagementComponent } from './findings-management/findings-management.component';
import { TemplatesComponent } from './templates/templates.component';
import { ReportsComponent } from './reports/reports.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { authGuard as AuthGuard, roleGuard } from './auth.guard';
import { SpecificFunctionAuditInfoComponent } from './audit-perform/specific-function-audit-info/specific-function-audit-info.component';
import { CustomiseAuditQuestionDialogComponent } from './audit-perform/customise-audit-question-dialog/customise-audit-question-dialog.component';
import { FindingsAuditInfoComponent } from './findings-management/findings-audit-info/findings-audit-info.component';
import { AuditManageComponent } from './audit-manage/audit-manage.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard', component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'auditPlan', component: AuditPlanComponent,
    canActivate: [AuthGuard, roleGuard(['Admin', 'Manager', 'Lead Auditor', 'Auditor'])]
  },
  {
    path: 'auditPerform', component: AuditPerformComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'auditPerform/:id', component: SpecificFunctionAuditInfoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'auditManage', component: AuditManageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'findingsManagement', component: FindingsManagementComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'findingsManagement/:id', component: FindingsAuditInfoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'templates', component: TemplatesComponent,
    canActivate: [AuthGuard, roleGuard(['Admin', 'Manager', 'Lead Auditor', 'Auditor'])]
  },
  {
    path: 'reports', component: ReportsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'userManagement', component: UserManagementComponent,
    canActivate: [AuthGuard, roleGuard(['Admin'])]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

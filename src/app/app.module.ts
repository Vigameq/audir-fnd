import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuditPlanComponent } from './audit-plan/audit-plan.component';
import { AuditPerformComponent } from './audit-perform/audit-perform.component';
import { FindingsManagementComponent } from './findings-management/findings-management.component';
import { TemplatesComponent } from './templates/templates.component';
import { ReportsComponent } from './reports/reports.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DropdownArrowIconsComponent } from './dropdown-arrow-icons/dropdown-arrow-icons.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IgxCalendarModule, IgxIconModule } from 'igniteui-angular';
import { AuditPlanSuccessPopupComponent } from './audit-plan/audit-plan-success-popup/audit-plan-success-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ImportCreatePlanDialogComponent } from './audit-plan/import-create-plan-dialog/import-create-plan-dialog.component';
import { EditPlanDialogComponent } from './audit-plan/edit-plan-dialog/edit-plan-dialog.component';
import { ToastrModule } from 'ngx-toastr';
import { ImportTemplateDialogComponent } from './templates/Import-template-dialog/import-template-dialog/import-template-dialog.component';
import { AuditorRemarksComponent } from './templates/Import-template-dialog/auditor-remarks/auditor-remarks.component';
import { SpecificFunctionAuditInfoComponent } from './audit-perform/specific-function-audit-info/specific-function-audit-info.component';
import { CustomiseAuditQuestionDialogComponent } from './audit-perform/customise-audit-question-dialog/customise-audit-question-dialog.component';
import { AuditFunctionalQuestionProgressDialogComponent } from './audit-perform/audit-functional-question-progress-dialog/audit-functional-question-progress-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    DashboardComponent,
    AuditPlanComponent,
    AuditPerformComponent,
    FindingsManagementComponent,
    TemplatesComponent,
    ReportsComponent,
    UserManagementComponent,
    LoginComponent,
    HeaderComponent,
    DropdownArrowIconsComponent,
    AuditPlanSuccessPopupComponent,
    ImportCreatePlanDialogComponent,
    EditPlanDialogComponent,
    ImportTemplateDialogComponent,
    AuditorRemarksComponent,
    SpecificFunctionAuditInfoComponent,
    CustomiseAuditQuestionDialogComponent,
    AuditFunctionalQuestionProgressDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IgxCalendarModule,
    IgxIconModule,
    MatDialogModule,
    MatButtonModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Add this to allow custom elements

})
export class AppModule { }

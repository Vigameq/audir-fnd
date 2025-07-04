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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { IgxCalendarModule, IgxIconModule } from 'igniteui-angular';
import { AuditPlanSuccessPopupComponent } from './audit-plan/audit-plan-success-popup/audit-plan-success-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ImportCreatePlanDialogComponent } from './audit-plan/import-create-plan-dialog/import-create-plan-dialog.component';
import { EditPlanDialogComponent } from './audit-plan/edit-plan-dialog/edit-plan-dialog.component';
import { ToastrModule } from 'ngx-toastr';
import { SpecificFunctionAuditInfoComponent } from './audit-perform/specific-function-audit-info/specific-function-audit-info.component';
import { CustomiseAuditQuestionDialogComponent } from './audit-perform/customise-audit-question-dialog/customise-audit-question-dialog.component';
import { AuditFunctionalQuestionProgressDialogComponent } from './audit-perform/audit-functional-question-progress-dialog/audit-functional-question-progress-dialog.component';
import { NotificationsComponent } from './header/notifications/notifications.component';
import { PascalCasePipe } from './custom-pipes/pascal-case.pipe';
import { SubmitConfirmationDialogComponent } from './audit-perform/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ImportTemplateDialogComponent } from './templates/Import-template-dialog/import-template-dialog.component';
import { FindingsAuditInfoComponent } from './findings-management/findings-audit-info/findings-audit-info.component';
import { FindingsQuestionResponseDialogComponent } from './findings-management/findings-question-response-dialog/findings-question-response-dialog.component';
import { ApprovalRemarksDialogComponent } from './findings-management/approval-remarks-dialog/approval-remarks-dialog.component';
import { FindingsAuditProgressDialogComponent } from './findings-management/findings-audit-progress-dialog/findings-audit-progress-dialog.component';
import { CreateUserDialogComponent } from './user-management/create-user-dialog/create-user-dialog.component';
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
    ApprovalRemarksDialogComponent,
    SpecificFunctionAuditInfoComponent,
    CustomiseAuditQuestionDialogComponent,
    AuditFunctionalQuestionProgressDialogComponent,
    NotificationsComponent,
    PascalCasePipe,
    SubmitConfirmationDialogComponent,
    FindingsAuditInfoComponent,
    FindingsQuestionResponseDialogComponent,
    FindingsAuditProgressDialogComponent,
    CreateUserDialogComponent
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
    ToastrModule.forRoot(),
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Add this to allow custom elements

})
export class AppModule { }

import { NgModule } from '@angular/core';
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
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DropdownArrowIconsComponent } from './dropdown-arrow-icons/dropdown-arrow-icons.component';

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
    DropdownArrowIconsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

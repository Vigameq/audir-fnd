import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPlanSuccessPopupComponent } from './audit-plan-success-popup.component';

describe('AuditPlanSuccessPopupComponent', () => {
  let component: AuditPlanSuccessPopupComponent;
  let fixture: ComponentFixture<AuditPlanSuccessPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuditPlanSuccessPopupComponent]
    });
    fixture = TestBed.createComponent(AuditPlanSuccessPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

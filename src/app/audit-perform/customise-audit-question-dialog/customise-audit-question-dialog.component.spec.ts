import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomiseAuditQuestionDialogComponent } from './customise-audit-question-dialog.component';

describe('CustomiseAuditQuestionDialogComponent', () => {
  let component: CustomiseAuditQuestionDialogComponent;
  let fixture: ComponentFixture<CustomiseAuditQuestionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomiseAuditQuestionDialogComponent]
    });
    fixture = TestBed.createComponent(CustomiseAuditQuestionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

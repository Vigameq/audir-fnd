import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditFunctionalQuestionProgressDialogComponent } from './audit-functional-question-progress-dialog.component';

describe('AuditFunctionalQuestionProgressDialogComponent', () => {
  let component: AuditFunctionalQuestionProgressDialogComponent;
  let fixture: ComponentFixture<AuditFunctionalQuestionProgressDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuditFunctionalQuestionProgressDialogComponent]
    });
    fixture = TestBed.createComponent(AuditFunctionalQuestionProgressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

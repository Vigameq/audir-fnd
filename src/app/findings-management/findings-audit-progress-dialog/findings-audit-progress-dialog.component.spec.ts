import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingsAuditProgressDialogComponent } from './findings-audit-progress-dialog.component';

describe('FindingsAuditProgressDialogComponent', () => {
  let component: FindingsAuditProgressDialogComponent;
  let fixture: ComponentFixture<FindingsAuditProgressDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FindingsAuditProgressDialogComponent]
    });
    fixture = TestBed.createComponent(FindingsAuditProgressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

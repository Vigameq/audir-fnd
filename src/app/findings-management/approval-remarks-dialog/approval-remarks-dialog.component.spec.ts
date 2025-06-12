import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApprovalRemarksDialogComponent } from './approval-remarks-dialog.component';

describe('ApprovalRemarksDialogComponent', () => {
  let component: ApprovalRemarksDialogComponent;
  let fixture: ComponentFixture<ApprovalRemarksDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovalRemarksDialogComponent]
    });
    fixture = TestBed.createComponent(ApprovalRemarksDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportCreatePlanDialogComponent } from './import-create-plan-dialog.component';

describe('ImportCreatePlanDialogComponent', () => {
  let component: ImportCreatePlanDialogComponent;
  let fixture: ComponentFixture<ImportCreatePlanDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportCreatePlanDialogComponent]
    });
    fixture = TestBed.createComponent(ImportCreatePlanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

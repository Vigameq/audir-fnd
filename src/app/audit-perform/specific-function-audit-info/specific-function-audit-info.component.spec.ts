import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificFunctionAuditInfoComponent } from './specific-function-audit-info.component';

describe('SpecificFunctionAuditInfoComponent', () => {
  let component: SpecificFunctionAuditInfoComponent;
  let fixture: ComponentFixture<SpecificFunctionAuditInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecificFunctionAuditInfoComponent]
    });
    fixture = TestBed.createComponent(SpecificFunctionAuditInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

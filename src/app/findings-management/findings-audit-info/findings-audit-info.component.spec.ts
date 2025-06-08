import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingsAuditInfoComponent } from './findings-audit-info.component';

describe('FindingsAuditInfoComponent', () => {
  let component: FindingsAuditInfoComponent;
  let fixture: ComponentFixture<FindingsAuditInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FindingsAuditInfoComponent]
    });
    fixture = TestBed.createComponent(FindingsAuditInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

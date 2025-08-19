import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditManageComponent } from './audit-manage.component';

describe('AuditManageComponent', () => {
  let component: AuditManageComponent;
  let fixture: ComponentFixture<AuditManageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuditManageComponent]
    });
    fixture = TestBed.createComponent(AuditManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

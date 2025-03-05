import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPerformComponent } from './audit-perform.component';

describe('AuditPerformComponent', () => {
  let component: AuditPerformComponent;
  let fixture: ComponentFixture<AuditPerformComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuditPerformComponent]
    });
    fixture = TestBed.createComponent(AuditPerformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

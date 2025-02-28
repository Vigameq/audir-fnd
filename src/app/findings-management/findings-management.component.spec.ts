import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingsManagementComponent } from './findings-management.component';

describe('FindingsManagementComponent', () => {
  let component: FindingsManagementComponent;
  let fixture: ComponentFixture<FindingsManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FindingsManagementComponent]
    });
    fixture = TestBed.createComponent(FindingsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

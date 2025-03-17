import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditorRemarksComponent } from './auditor-remarks.component';

describe('AuditorRemarksComponent', () => {
  let component: AuditorRemarksComponent;
  let fixture: ComponentFixture<AuditorRemarksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuditorRemarksComponent]
    });
    fixture = TestBed.createComponent(AuditorRemarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingsResponseDialogComponent } from './findings-response-dialog.component';

describe('FindingsResponseDialogComponent', () => {
  let component: FindingsResponseDialogComponent;
  let fixture: ComponentFixture<FindingsResponseDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FindingsResponseDialogComponent]
    });
    fixture = TestBed.createComponent(FindingsResponseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

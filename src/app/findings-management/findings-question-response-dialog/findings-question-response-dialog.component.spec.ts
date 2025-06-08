import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingsQuestionResponseDialogComponent } from './findings-question-response-dialog.component';

describe('FindingsQuestionResponseDialogComponent', () => {
  let component: FindingsQuestionResponseDialogComponent;
  let fixture: ComponentFixture<FindingsQuestionResponseDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FindingsQuestionResponseDialogComponent]
    });
    fixture = TestBed.createComponent(FindingsQuestionResponseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

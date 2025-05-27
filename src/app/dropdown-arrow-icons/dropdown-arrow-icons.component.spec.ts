import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownArrowIconsComponent } from './dropdown-arrow-icons.component';

describe('DropdownArrowIconsComponent', () => {
  let component: DropdownArrowIconsComponent;
  let fixture: ComponentFixture<DropdownArrowIconsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DropdownArrowIconsComponent]
    });
    fixture = TestBed.createComponent(DropdownArrowIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

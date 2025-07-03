import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
  styleUrls: ['./create-user-dialog.component.scss']
})
export class CreateUserDialogComponent {
  @ViewChild('roleDropdown') roleDropdown: ElementRef | undefined;

  roleSelectedOption: any = { name: 'Select role' };
  isRoleDropdownOpen = false;
  createUserForm: FormGroup = new FormGroup({
    firstNameValue: new FormControl('', Validators.required),
    emailValue: new FormControl('', [Validators.required, Validators.email]),
    organizationValue: new FormControl('vigameq', Validators.required),
    departmentValue: new FormControl('', Validators.required),
    lastNameValue: new FormControl('', Validators.required),
    passwordValue: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[a-z]).{8,}$/)
    ]),
    startDateTimeValue: new FormControl('', Validators.required),
    roleValue: new FormControl('', Validators.required),
    locationValue: new FormControl('', Validators.required),
    userProfileImageValue: new FormControl(null, Validators.required)
  });
  roles = [{
    name: 'Manager'
  },
  {
    name: 'Auditor'
  },
  {
    name: 'Auditee'
  }]

  constructor(private renderer: Renderer2, private CreateUserFormBuilder: FormBuilder, public dialogRef: MatDialogRef<CreateUserDialogComponent>) { }

  ngOnInit(): void {
    this.createUserForm = this.CreateUserFormBuilder.group({
      firstNameValue: new FormControl('', Validators.required),
      emailValue: new FormControl('', [Validators.required, Validators.email]),
      organizationValue: new FormControl('vigameq', Validators.required),
      departmentValue: new FormControl('', Validators.required),
      lastNameValue: new FormControl('', Validators.required),
      passwordValue: new FormControl('', Validators.required),
      startDateTimeValue: new FormControl('', Validators.required),
      roleValue: new FormControl('', Validators.required),
      locationValue: new FormControl('', Validators.required),
      userProfileImageValue: new FormControl(null, Validators.required)
    });
  }

  onUserCreation() {
  }

  onRoleDropdownClick() {
    this.isRoleDropdownOpen = !this.isRoleDropdownOpen;

  }

  onClose() {
    this.dialogRef.close();
  }

  onUserCreatedSucess() {
    this.dialogRef.close('success');
  }

  onRoleOptionChange(event: any) {
    const target = event.target as HTMLSelectElement;
  }

  ngAfterViewInit() {
    this.renderer.listen('document', 'click', (event: Event) => {
      if (this.roleDropdown && !this.roleDropdown.nativeElement.contains(event.target)) {
        this.isRoleDropdownOpen = false;
      }
    });
  }

  onProfileImageUpload(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      if (file.type !== 'image/jpeg') {
        alert('Only JPG images are allowed!');
        this.createUserForm.patchValue({ userProfileImageValue: null });
        return;
      }
      this.createUserForm.patchValue({
        userProfileImageValue: file
      });
      this.createUserForm.get('userProfileImageValue')!.updateValueAndValidity();
    }
  }
}

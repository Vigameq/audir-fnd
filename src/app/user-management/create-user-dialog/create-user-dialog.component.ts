import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AudirService } from 'src/services/audir-services.service';

@Component({
  selector: 'app-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
  styleUrls: ['./create-user-dialog.component.scss']
})
export class CreateUserDialogComponent {
  @ViewChild('roleDropdown') roleDropdown: ElementRef | undefined;
  isAllDetailsAvailable: boolean | undefined;
  roleSelectedOption: any = { name: 'Select role' };
  isRoleDropdownOpen = false;
  createUserForm: FormGroup = new FormGroup({
    firstNameValue: new FormControl('', [Validators.required, Validators.minLength(3)]),
    emailValue: new FormControl('', [Validators.required, Validators.email]),
    organisationValue: new FormControl('vigameq', [Validators.required, Validators.minLength(3)]),
    departmentValue: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lastNameValue: new FormControl('', [Validators.required, Validators.minLength(3)]),
    passwordValue: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[a-z]).{8,}$/)
    ]),
    roleValue: new FormControl('', [Validators.required, Validators.minLength(3)]),
    locationValue: new FormControl('', [Validators.required, Validators.minLength(3)]),
    userProfileImageValue: new FormControl<File | null>(null, Validators.required)
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

  constructor(private audirService: AudirService, private renderer: Renderer2, private CreateUserFormBuilder: FormBuilder, public dialogRef: MatDialogRef<CreateUserDialogComponent>) { }

  ngOnInit(): void {
    this.createUserForm = this.CreateUserFormBuilder.group({
      firstNameValue: new FormControl('', [Validators.required, Validators.minLength(3)]),
      emailValue: new FormControl('', [Validators.required, Validators.email]),
      organisationValue: new FormControl('vigameq', [Validators.required, Validators.minLength(3)]),
      departmentValue: new FormControl('', [Validators.required, Validators.minLength(3)]),
      lastNameValue: new FormControl('', [Validators.required, Validators.minLength(3)]),
      passwordValue: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[a-z]).{8,}$/)
      ]),
      roleValue: new FormControl('', Validators.required),
      locationValue: new FormControl('', [Validators.required, Validators.minLength(3)]),
      userProfileImageValue: new FormControl<File | null>(null, Validators.required)
    });
  }

  onUserCreation() {
    if (this.createUserForm.value.userProfileImageValue && this.createUserForm.value.firstNameValue &&
      this.createUserForm.value.lastNameValue && this.createUserForm.value.emailValue &&
      this.createUserForm.value.organisationValue && this.createUserForm.value.roleValue && this.createUserForm.value.departmentValue &&
      this.createUserForm.value.locationValue && this.createUserForm.value.passwordValue) {
      this.isAllDetailsAvailable = true;
      const userCreationDetails: any = new FormData();
      userCreationDetails.append('userProfileImage', this.createUserForm.value.userProfileImageValue);
      userCreationDetails.append('firstName', this.createUserForm.value.firstNameValue);
      userCreationDetails.append('lastName', this.createUserForm.value.lastNameValue);
      userCreationDetails.append('eMail', this.createUserForm.value.emailValue);
      userCreationDetails.append('organisation', this.createUserForm.value.organisationValue);
      userCreationDetails.append('role', this.createUserForm.value.roleValue);
      userCreationDetails.append('department', this.createUserForm.value.departmentValue);
      userCreationDetails.append('location', this.createUserForm.value.locationValue);
      userCreationDetails.append('password', this.createUserForm.value.passwordValue);
      this.audirService.updateAuditPlan(userCreationDetails).subscribe((response: any) => {
        if (response) {
          this.audirService.showSuccess(response.message);
          this.dialogRef.close('success');
        } else {
          this.audirService.showError('Failed to create user');
        }
      }, (error: any) => {
        this.audirService.showError('Failed to create user');
        console.error('Error for creating user:', error);
      });
    }
    else {
      this.isAllDetailsAvailable = false;
      this.audirService.showError('Fill all required fields to create new user');

    }
  }

  get form() {
    return this.createUserForm.controls;
  }

  onRoleDropdownClick() {
    this.isRoleDropdownOpen = !this.isRoleDropdownOpen;
  }

  onClose() {
    this.dialogRef.close();
  }

  onRoleOptionChange(event: any) {
    const target = event.target as HTMLSelectElement;
    this.createUserForm.patchValue({
      roleValue: target.value
    });
  }

  ngAfterViewInit() {
    this.renderer.listen('document', 'click', (event: Event) => {
      if (this.roleDropdown && !this.roleDropdown.nativeElement.contains(event.target)) {
        this.isRoleDropdownOpen = false;
      }
    });
  }

  onProfileImageUpload(event: any): void {
    const uploadedImage: any = (event.target as HTMLInputElement).files?.[0];
    if (uploadedImage) {
      if (!uploadedImage.type.includes('jpeg')) {
        this.createUserForm.patchValue({
          userProfileImageValue: null
        });
        alert('Only JPG files are allowed.');
        return;
      }

      if (uploadedImage.size > 2 * 1024 * 1024) {
        this.createUserForm.patchValue({
          userProfileImageValue: null
        });
        alert('File size must be under 2MB.');
        return;
      }
      this.createUserForm.patchValue({
        userProfileImageValue: uploadedImage
      });
      this.createUserForm.get('userProfileImageValue')?.updateValueAndValidity();
    }
  }
}

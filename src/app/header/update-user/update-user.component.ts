import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AudirService } from 'src/services/audir-services.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent {
  @ViewChild('roleDropdown') roleDropdown: ElementRef | undefined;
  @ViewChild('locationDropdown') locationDropdown: ElementRef | undefined;
  isAllDetailsAvailable: boolean | undefined;
  isEmailValid: boolean | undefined;
  roleSelectedOption: any = { name: '' };
  locationSelectedOption: any = '';
  locations = ["Amaravati", "Bengaluru", "Bhopal", "Bhubaneswar", "Chandigarh", "Chennai", "Dehradun", "Gandhinagar", "Gangtok", "Hyderabad", "Jaipur", "Kolkata", "Lucknow", "Mumbai", "Panaji", "Patna", "Raipur", "Ranchi", "Shillong", "Shimla", "Thiruvananthapuram"];
  isRoleDropdownOpen = false;
  isLocationDropdownOpen = false;
  userDetails: any;
  updateUserForm: FormGroup = new FormGroup({
    firstNameValue: new FormControl('', [Validators.required, Validators.minLength(3)]),
    emailValue: new FormControl('', [Validators.required, Validators.email]),
    departmentValue: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lastNameValue: new FormControl('', [Validators.required, Validators.minLength(3)]),
    roleValue: new FormControl('', [Validators.required, Validators.minLength(3)]),
    locationValue: new FormControl('', [Validators.required, Validators.minLength(3)])
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

  constructor(private audirService: AudirService, private renderer: Renderer2, private updateUserFormBuilder: FormBuilder, public dialogRef: MatDialogRef<UpdateUserComponent>) {
    this.userDetails = localStorage.getItem('userDetails');
    this.roleSelectedOption.name = (JSON.parse(this.userDetails)).role;
  }

  ngOnInit(): void {
    this.updateUserForm = this.updateUserFormBuilder.group({
      firstNameValue: new FormControl((JSON.parse(this.userDetails)).firstname, [Validators.required, Validators.minLength(3)]),
      emailValue: new FormControl((JSON.parse(this.userDetails)).eMail, [Validators.required, Validators.email]),
      departmentValue: new FormControl((JSON.parse(this.userDetails)).department, [Validators.required, Validators.minLength(3)]),
      lastNameValue: new FormControl((JSON.parse(this.userDetails)).lastName, [Validators.required, Validators.minLength(3)]),
      roleValue: new FormControl((JSON.parse(this.userDetails)).role, Validators.required),
      locationValue: new FormControl('', [Validators.required, Validators.minLength(3)])
    });
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$/;
    this.isEmailValid = emailRegex.test(email);
    return this.isEmailValid;
  }

  onUserUpdation() {
    if (this.updateUserForm.value.firstNameValue &&
      this.updateUserForm.value.lastNameValue && this.updateUserForm.value.emailValue && this.updateUserForm.value.roleValue && this.updateUserForm.value.departmentValue &&
      this.updateUserForm.value.locationValue && this.isValidEmail(this.updateUserForm.value.emailValue)) {
      this.isAllDetailsAvailable = true;
      const userUpdationDetails: any = {
        'email': this.updateUserForm.value.emailValue,
        'role': this.updateUserForm.value.roleValue,
        'department': this.updateUserForm.value.departmentValue,
        'location': this.updateUserForm.value.locationValue,
        'firstName': this.updateUserForm.value.firstNameValue,
        'lastName': this.updateUserForm.value.lastNameValue
      };
      this.audirService.updateUser(userUpdationDetails).subscribe((response: any) => {
        if (response) {
          this.audirService.showSuccess(response.message);
          this.dialogRef.close('success');
        } else {
          this.audirService.showError('Failed to update user');
        }
      }, (error: any) => {
        this.audirService.showError('Failed to create user');
        console.error('Error for creating user:', error);
      });
    }
    else {
      this.isAllDetailsAvailable = false;
      this.audirService.showError('Please enter mandatory (*) fields');

    }
  }

  get form() {
    return this.updateUserForm.controls;
  }

  onRoleDropdownClick() {
    this.isRoleDropdownOpen = !this.isRoleDropdownOpen;
  }

  onLocationDropdownClick() {
    this.isLocationDropdownOpen = !this.isLocationDropdownOpen;
  }

  onClose() {
    this.dialogRef.close();
  }

  onRoleOptionChange(event: any) {
    const target = event.target as HTMLSelectElement;
    this.updateUserForm.patchValue({
      roleValue: target.value
    });
  }

  onLocationOptionChange(event: any) {
    const target = event.target as HTMLSelectElement;
    this.updateUserForm.patchValue({
      locationValue: target.value
    });
  }

  ngAfterViewInit() {
    this.renderer.listen('document', 'click', (event: Event) => {
      if (this.roleDropdown && !this.roleDropdown.nativeElement.contains(event.target)) {
        this.isRoleDropdownOpen = false;
      }
      else if (this.locationDropdown && !this.locationDropdown.nativeElement.contains(event.target)) {
        this.isLocationDropdownOpen = false;
      }
    });
  }
}

import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth.service';
import { AudirService } from 'src/services/audir-services.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent {
  isAllDetailsAvailable: boolean | undefined;
  userDetails: any;
  isOldPwdMatched: any = true;
  updatePasswordForm: FormGroup = new FormGroup({
    emailValue: new FormControl(''),
    newPasswordValue: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[a-z]).{8,}$/)
    ]),
    oldPasswordValue: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[a-z]).{8,}$/)
    ])
  });

  constructor(private authService: AuthService, private audirService: AudirService, private renderer: Renderer2, private updateUserPasswordFormBuilder: FormBuilder, public dialogRef: MatDialogRef<UpdatePasswordComponent>) {
    this.userDetails = localStorage.getItem('userDetails');
  }

  ngOnInit(): void {
    this.updatePasswordForm = this.updateUserPasswordFormBuilder.group({
      emailValue: new FormControl((JSON.parse(this.userDetails)).eMail),
      oldPasswordValue: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ]),
      newPasswordValue: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ])
    });
  }

  onUserPasswordUpdation() {
    if (this.updatePasswordForm.value.oldPasswordValue && this.updatePasswordForm.value.emailValue && this.updatePasswordForm.value.newPasswordValue) {
      this.isAllDetailsAvailable = true;
      const userPasswordUpdationDetails: any = {
        'email': this.updatePasswordForm.value.emailValue,
        'oldPassword': this.updatePasswordForm.value.oldPasswordValue,
        'password': this.updatePasswordForm.value.newPasswordValue
      };
      if (!this.checkOldPasswordError() && !this.checkNewPasswordError() && this.isOldPwdMatched && !this.isOldNewPwdMatched()) {
        this.authService.login(userPasswordUpdationDetails.email, userPasswordUpdationDetails.oldPassword).subscribe(
          (response: any) => {
            if (response) {
              this.audirService.updatePassword(userPasswordUpdationDetails).subscribe((response: any) => {
                if (response) {
                  this.audirService.showSuccess(response.message);
                  this.dialogRef.close('success');
                } else {
                  this.audirService.showError('Failed to update password');
                }
              }, (error: any) => {
                this.audirService.showError('Failed to update password');
                console.error('Error for updating user password:', error);
              });
            } else {
              this.isOldPwdMatched = false;
            }
          }, (error: any) => {

            if (error.error.status === 500) {
              this.audirService.showError(error.error.statusText);
            } else {
              this.isOldPwdMatched = false;
            }
            console.error(error);
          }
        );
      }
    }
    else {
      this.isAllDetailsAvailable = false;
      this.audirService.showError('Please enter mandatory (*) fields');
    }
  }

  isOldNewPwdMatched(){
    return ((this.form['newPasswordValue'].value === this.form['oldPasswordValue'].value) && (this.form['oldPasswordValue'].value !== '' || this.form['newPasswordValue'].value !== ''))
  }

  get form() {
    return this.updatePasswordForm.controls;
  }

  onClose() {
    this.dialogRef.close();
  }

  checkOldPasswordError() {
    return (this.form['oldPasswordValue'].touched && this.form['oldPasswordValue'].invalid) || ((this.isAllDetailsAvailable === false) && this.form['oldPasswordValue'].invalid);
  }

  checkNewPasswordError() {
    return (this.form['newPasswordValue'].touched && this.form['newPasswordValue'].invalid) || ((this.isAllDetailsAvailable === false) && this.form['newPasswordValue'].invalid);
  }

  onPasswordChange() {
    this.isOldPwdMatched = true;
  }
}

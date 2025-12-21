import { Component } from '@angular/core';
import { CreateUserDialogComponent } from './create-user-dialog/create-user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AudirService } from 'src/services/audir-services.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchQuery = '';
  roles = ['Manager', 'Auditor', 'Auditee'];
  currentUserEmail = '';

  constructor(private dialog: MatDialog, private audirService: AudirService) {
    this.currentUserEmail = localStorage.getItem('user')?.toString() || '';
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    const payload = { eMail: this.currentUserEmail };
    this.audirService.listUsers(payload).subscribe({
      next: (response: any) => {
        const users = Array.isArray(response) ? response : [];
        this.users = users.map((user: any) => ({
          ...user,
          roleDraft: user.role,
          isRoleDirty: false,
          isSaving: false,
          isDeleting: false
        }));
        this.applyFilter();
      },
      error: (error: any) => {
        console.error('Error fetching users:', error);
        this.audirService.showError('Failed to load users');
      }
    });
  }

  applyFilter(): void {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      this.filteredUsers = [...this.users];
      return;
    }
    this.filteredUsers = this.users.filter((user) => {
      const name = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
      return name.includes(query) || (user.email || '').toLowerCase().includes(query);
    });
  }

  onRoleChange(user: any, event: Event): void {
    const target = event.target as HTMLSelectElement;
    user.roleDraft = target.value;
    user.isRoleDirty = user.roleDraft !== user.role;
  }

  saveRole(user: any): void {
    if (!user.isRoleDirty || user.isSaving) {
      return;
    }
    user.isSaving = true;
    const payload = {
      email: user.email,
      role: user.roleDraft,
      requester_email: this.currentUserEmail
    };
    this.audirService.updateUser(payload).subscribe({
      next: (response: any) => {
        if (response) {
          user.role = user.roleDraft;
          user.isRoleDirty = false;
          this.audirService.showSuccess('Role updated');
        }
        user.isSaving = false;
      },
      error: (error: any) => {
        console.error('Error updating role:', error);
        this.audirService.showError('Failed to update role');
        user.isSaving = false;
      }
    });
  }

  resetPassword(user: any): void {
    if (!user?.email) {
      return;
    }
    const newPassword = window.prompt('Enter a new password for this user');
    if (!newPassword) {
      return;
    }
    const confirmed = window.confirm(`Reset password for ${user.email}?`);
    if (!confirmed) {
      return;
    }
    const payload = {
      email: user.email,
      password: newPassword
    };
    this.audirService.updatePassword(payload).subscribe({
      next: (response: any) => {
        if (response) {
          this.audirService.showSuccess('Password reset successfully');
        }
      },
      error: (error: any) => {
        console.error('Error resetting password:', error);
        this.audirService.showError('Failed to reset password');
      }
    });
  }

  deleteUser(user: any): void {
    if (!user?.email || user.email === this.currentUserEmail) {
      return;
    }
    const confirmed = window.confirm(`Delete user ${user.email}? This cannot be undone.`);
    if (!confirmed) {
      return;
    }
    user.isDeleting = true;
    const payload = {
      email: user.email,
      requester_email: this.currentUserEmail
    };
    this.audirService.deleteUser(payload).subscribe({
      next: (response: any) => {
        if (response) {
          this.users = this.users.filter((item) => item.email !== user.email);
          this.applyFilter();
          this.audirService.showSuccess('User deleted');
        }
        user.isDeleting = false;
      },
      error: (error: any) => {
        console.error('Error deleting user:', error);
        this.audirService.showError('Failed to delete user');
        user.isDeleting = false;
      }
    });
  }

  openCreateUserDialog(): void {
    const dialogRef = this.dialog.open(CreateUserDialogComponent, {
      autoFocus: false,
      disableClose: true,
      width: '654px',
      height: '628px',
      data: {}
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 'success') {
        this.loadUsers();
      }
      console.log(`Dialog result: ${result}`);
    });
  }
}

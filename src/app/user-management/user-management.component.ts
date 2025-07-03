import { Component } from '@angular/core';
import { CreateUserDialogComponent } from './create-user-dialog/create-user-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent {

  constructor(private dialog: MatDialog) {
  }

  openCreateUserDialog(): void {
    const dialogRef = this.dialog.open(CreateUserDialogComponent, {
      autoFocus: false,
      disableClose: true,
      width: '654px',
      height: '620px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result === 'success') {
      }
      console.log(`Dialog result: ${result}`);
    });
  }
}

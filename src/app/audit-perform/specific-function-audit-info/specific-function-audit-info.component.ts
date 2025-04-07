import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomiseAuditQuestionDialogComponent } from '../customise-audit-question-dialog/customise-audit-question-dialog.component';
import { AuditFunctionalQuestionProgressDialogComponent } from '../audit-functional-question-progress-dialog/audit-functional-question-progress-dialog.component';

@Component({
  selector: 'app-specific-function-audit-info',
  templateUrl: './specific-function-audit-info.component.html',
  styleUrls: ['./specific-function-audit-info.component.scss']
})
export class SpecificFunctionAuditInfoComponent {
  auditorInfo = { id: 'VIG1893893', standardType: 'This1', functionType: 'function1', city: 'bangalore', country: 'india', startDate: '26/05/2024', endDate: '28/05/2024', startTime: '10:00 AM', endTime: '10:00 AM', percentage: '70', auditorName: 'Krishna Achar', auditCompaey: 'ACS Manufacturing Group' };
  // progressData = {
  //   auditorNote: {
  //     label: 'Auditor Note',
  //     name: 'Krishna Achar',
  //     note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  //     date: '21/05/2024'
  //   },
  //   auditeeResponse: {
  //     label: 'Auditee Response',
  //     name: 'Rajesh Rao',
  //     type: 'Purchase',
  //     response: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  //     date: '27/05/2024'
  //   },
  //   closure: {
  //     label: 'NC Closed',
  //     closedBy: 'NC Closed',
  //     closureDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  //     date: '28/05/2024'
  //   }
  // };

  progressData = [
    {
      label: 'Auditor Note',
      auditorName: 'Krishna Achar',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      date: '21/05/2024',
      lineHeight: 0,
      color: ''
    },
    {
      label: 'Auditee Response',
      auditorName: 'Rajesh Rao',
      type: 'Purchase',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      date: '27/05/2024',
      lineHeight: 0,
      color: ''
    },
    {
      label: 'NC Closed',
      auditorName: 'Krishna Achar',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      date: '28/05/2024',
      lineHeight: 0,
      color: ''
    }
  ];
  allFunctionalQuestions: any[] = [
    {
      questionNumber: 'Question1',
      questionText: 'Does the organization continually improve the suitability, adequacy and effectiveness of the quality management system?',
      status: 'Noteworthy'
    },
    {
      questionNumber: 'Question2',
      questionText: 'Does the organization continually improve the suitability, adequacy and effectiveness of the quality management system?',
      status: 'complaint'
    },
    {
      questionNumber: 'Question3',
      questionText: 'Does the organization continually improve the suitability, adequacy and effectiveness of the quality management system?',
      status: 'OFI'
    },
    {
      questionNumber: 'Question4',
      questionText: 'Does the organization continually improve the suitability, adequacy and effectiveness of the quality management system?',
      status: 'OFI'
    },
    {
      questionNumber: 'Question5',
      questionText: 'Does the organization continually improve the suitability, adequacy and effectiveness of the quality management system?',
      status: 'OFI'
    },
    {
      questionNumber: 'Question6',
      questionText: 'Does the organization continually improve the suitability, adequacy and effectiveness of the quality management system?',
      status: 'OFI'
    }
  ];
  constructor(private dialog: MatDialog) { }

  customizeQuestion(index: number) {
    const dialogRef = this.dialog.open(CustomiseAuditQuestionDialogComponent, {
      width: 'auto',
      position: { right: '0', top: '0' },
      panelClass: 'customize-question-dialog-container',
      data: this.allFunctionalQuestions[index]
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  questionProgressData() {
    const dialogRef = this.dialog.open(AuditFunctionalQuestionProgressDialogComponent, {
      width: 'auto',
      position: { right: '0', top: '0' },
      panelClass: 'question-progress-dialog-container',
      data: { auditorInfo: this.auditorInfo, progressData: this.progressData }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

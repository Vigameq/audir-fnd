import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomiseAuditQuestionDialogComponent } from '../customise-audit-question-dialog/customise-audit-question-dialog.component';
import { AuditFunctionalQuestionProgressDialogComponent } from '../audit-functional-question-progress-dialog/audit-functional-question-progress-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AudirService } from 'src/services/audir-services.service';
import { Location } from "@angular/common";

@Component({
  selector: 'app-specific-function-audit-info',
  templateUrl: './specific-function-audit-info.component.html',
  styleUrls: ['./specific-function-audit-info.component.scss']
})
export class SpecificFunctionAuditInfoComponent {

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
  allFunctionalQuestions!: any[];
  auditInfo: any;
  auditId: any;
  constructor(private dialog: MatDialog,
    private route: ActivatedRoute,
    private audirService: AudirService,
    private location: Location,
    private readonly router: Router) {
    this.route.paramMap.subscribe(params => {
      this.auditId = { "audit_id": params.get('id') };
      this.getPlanAudit(this.auditId);
      this.getQuestions(this.auditId);
    });
  }

  ngOnInit() {
    
  }

  getQuestions(auditId: any) {
    this.audirService.getAuditQuestions(auditId).subscribe((auditQuestion: any) => {
      if (auditQuestion) {
        this.allFunctionalQuestions = Object.values(auditQuestion.questions.template).flat();
      }
    }, (error: any) => {
      console.error('Error for getting questions:', error);
    });
  }

  getPlanAudit(auditId: any) {
    this.audirService.getAuditPlan(auditId).subscribe((audit: any) => {
      if (audit) {
        this.auditInfo = audit.audit_data;
      }
    }, (error: any) => {
      console.error('Error for getting audit plan:', error);
    });
  }

  questionInfo(index: number) {
    const dialogRef = this.dialog.open(CustomiseAuditQuestionDialogComponent, {
      width: 'auto',
      position: { right: '0', top: '0' },
      panelClass: 'customize-question-dialog-container',
      data: {
        index:index+1,
        questionText: this.allFunctionalQuestions[index],
        auditId: this.auditId
      }
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
      data: { auditorInfo: this.auditInfo, progressData: this.progressData }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  back() {
    this.location.back();
  }
}

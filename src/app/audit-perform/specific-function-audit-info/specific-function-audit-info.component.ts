import { Component } from '@angular/core';

@Component({
  selector: 'app-specific-function-audit-info',
  templateUrl: './specific-function-audit-info.component.html',
  styleUrls: ['./specific-function-audit-info.component.scss']
})
export class SpecificFunctionAuditInfoComponent {
  auditorInfo = { id: 'VIG1893893', standardType: 'This1', functionType: 'function1', city: 'bangalore', country: 'india', startDate: '26/05/2024', endDate: '28/05/2024', startTime: '10:00 AM', endTime: '10:00 AM', percentage: '70', auditorName: 'Krishna Achar', auditCompaey: 'ACS Manufacturing Group' };
  allfunctionalQuestions: any[] = [
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
  constructor() { }
}

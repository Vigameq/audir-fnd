import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { AudirService } from 'src/services/audir-services.service';

@Component({
  selector: 'app-audit-perform',
  templateUrl: './audit-perform.component.html',
  styleUrls: ['./audit-perform.component.scss']
})
export class AuditPerformComponent {
  searchQuery: string = '';
  isStandardDropdownOpen: boolean = false;
  standardDropdownOptions = ['options1', 'option2', 'option3'];
  standardSelectedOption: string = '';
  showChild: boolean = false;
  auditPerformInfoData = [
    { id: 'VIG1893893', standardType: 'This1', functionType: 'function1', city: 'bangalore', country: 'india', startDate: '26/05/2024', endDate: '28/05/2024', startTime: '10:00 AM', endTime: '10:00 AM', percentage: '70', auditorName: 'Krishna Achar', auditCompaey: 'ACS Manufacturing Group' },
    { id: 'VIG18938932', standardType: 'This2', functionType: 'function2', city: 'hyderabad', country: 'india', startDate: '26/05/2024', endDate: '28/05/2024', startTime: '10:00 AM', endTime: '10:00 AM', percentage: '20', auditorName: 'Krishna Achar', auditCompaey: 'ACS Manufacturing Group' },
    { id: 'VIG18938933', standardType: 'This3', functionType: 'function3', city: 'kerala', country: 'india', startDate: '26/05/2024', endDate: '28/05/2024', startTime: '10:00 AM', endTime: '10:00 AM', percentage: '30', auditorName: 'Krishna Achar', auditCompaey: 'ACS Manufacturing Group' },
    { id: 'VIG18938934', standardType: 'This4', functionType: 'function4', city: 'Amaravathi', country: 'india', startDate: '26/05/2024', endDate: '28/05/2024', startTime: '10:00 AM', endTime: '10:00 AM', percentage: '40', auditorName: 'Krishna Achar', auditCompaey: 'ACS Manufacturing Group' },
    { id: 'VIG18938931', standardType: 'This1', functionType: 'function1', city: 'bangalore', country: 'india', startDate: '26/05/2024', endDate: '28/05/2024', startTime: '10:00 AM', endTime: '10:00 AM', percentage: '90', auditorName: 'Krishna Achar', auditCompaey: 'ACS Manufacturing Group' },
    { id: 'VIG18938932', standardType: 'This2', functionType: 'function2', city: 'hyderabad', country: 'india', startDate: '26/05/2024', endDate: '28/05/2024', startTime: '10:00 AM', endTime: '10:00 AM', percentage: '90', auditorName: 'Krishna Achar', auditCompaey: 'ACS Manufacturing Group' },
    { id: 'VIG18938933', standardType: 'This3', functionType: 'function3', city: 'kerala', country: 'india', startDate: '26/05/2024', endDate: '28/05/2024', startTime: '10:00 AM', endTime: '10:00 AM', percentage: '80', auditorName: 'Krishna Achar', auditCompaey: 'ACS Manufacturing Group' },
    { id: 'VIG18938934', standardType: 'This4', functionType: 'function4', city: 'Amaravathi', country: 'india', startDate: '26/05/2024', endDate: '28/05/2024', startTime: '10:00 AM', endTime: '10:00 AM', percentage: '30', auditorName: 'Krishna Achar', auditCompaey: 'ACS Manufacturing Group' },
    { id: 'VIG18938931', standardType: 'This1', functionType: 'function1', city: 'bangalore', country: 'india', startDate: '26/05/2024', endDate: '28/05/2024', startTime: '10:00 AM', endTime: '10:00 AM', percentage: '26', auditorName: 'Krishna Achar', auditCompaey: 'ACS Manufacturing Group' },
    { id: 'VIG18938932', standardType: 'This2', functionType: 'function2', city: 'hyderabad', country: 'india', startDate: '26/05/2024', endDate: '28/05/2024', startTime: '10:00 AM', endTime: '10:00 AM', percentage: '10', auditorName: 'Krishna Achar', auditCompaey: 'ACS Manufacturing Group' },
    { id: 'VIG18938933', standardType: 'This3', functionType: 'function3', city: 'kerala', country: 'india', startDate: '26/05/2024', endDate: '28/05/2024', startTime: '10:00 AM', endTime: '10:00 AM', percentage: '50', auditorName: 'Krishna Achar', auditCompaey: 'ACS Manufacturing Group' },
    { id: 'VIG18938934', standardType: 'This4', functionType: 'function4', city: 'Amaravathi', country: 'india', startDate: '26/05/2024', endDate: '28/05/2024', startTime: '10:00 AM', endTime: '10:00 AM', percentage: '60', auditorName: 'Krishna Achar', auditCompaey: 'ACS Manufacturing Group' }
  ];

  @ViewChild('standardDropdown') standardDropdown: ElementRef | undefined;
  auditList: any;

  constructor(private renderer: Renderer2,private audirService: AudirService) { }

  ngOnInit(){
    this.getAuditLists();
  }

  getAuditLists(){
    var payload = {
      eMail: "chandrahas@gmail.com",
      start_date_filter: {
          from: "2023-01-09",
          to: "2024-01-09"
      },
      "status_filter": ["completed","created","inprogress","submitted"]
  }
    this.audirService.getAuditLists(payload).subscribe((response: any)=>{
      if(response){
        this.auditList = response.audit_data;
      }      
    })
  }

  showChildFlag(){
    this.showChild = !this.showChild;
  }

  onSearch() {
    console.log('Search query:', this.searchQuery);
  }

  clearSearch() {
    this.searchQuery = '';
  }

  onStandardOptionChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    console.log("Selected Option: ", this.standardSelectedOption, target);
    this.standardSelectedOption = target.value;
  }

  onStandardDropdownClick(): void {
    this.isStandardDropdownOpen = !this.isStandardDropdownOpen;
  }

  ngAfterViewInit() {
    this.renderer.listen('document', 'click', (event: Event) => {
      if (this.standardDropdown && !this.standardDropdown.nativeElement.contains(event.target)) {
        this.isStandardDropdownOpen = false;
      }
    });
  }
}

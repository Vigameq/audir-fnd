import { ChangeDetectorRef, Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { AudirService } from 'src/services/audir-services.service';

@Component({
  selector: 'app-audit-perform',
  templateUrl: './audit-perform.component.html',
  styleUrls: ['./audit-perform.component.scss']
})
export class AuditPerformComponent {
  searchQuery: string = '';
  isStandardDropdownOpen: boolean = false;
  isAuditeeDropdownOpen: boolean = false;
  isSubAuditOpened: boolean = false;
  standardDropdownOptions = ['options1', 'option2', 'option3'];
  auditeeDropdownOptions: any;
  standardSelectedOption: string = '';
  @ViewChildren('detailsContent') detailsContentElements!: QueryList<ElementRef>;
  @ViewChild('standardDropdown') standardDropdown: ElementRef | undefined;
  @ViewChild('auditeeDropdown') auditeeDropdown: ElementRef | undefined;
  auditList: any;
  auditeeSelectedValue: any = '';

  constructor(private cdr: ChangeDetectorRef, private renderer: Renderer2, private audirService: AudirService) { }

  ngOnInit() {
    this.getAuditLists();
    this.getPlanItems();
  }

  getAuditLists() {
    const email = localStorage.getItem('user')?.toString() || '';
    var payload = {
      eMail: email,
      start_date_filter: {
        from: "2024-06-09",
        to: "2025-12-30"
      },
      "status_filter": ["completed", "created", "inprogress", "submitted"]
    };

    this.auditList = [
      {
        "audit_id": "VIG000066",
        "audit_scope": "typw",
        "audit_status": "created",
        "audit_title": "Gadip",
        "audit_type": "Type 1",
        "auditees": [
          "user4@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com"
        ],
        "city": "Guntur",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Mon, 03 Nov 2025 00:00:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "Gadip",
        "link_audit": "None",
        "start_date": "Thu, 02 Oct 2025 00:00:00 GMT",
        "sub_audits": [
          {
            "audit_id": "VIG000248",
            "audit_scope": "test",
            "audit_status": "created",
            "audit_title": "testg",
            "audit_type": "ISO 270015",
            "auditees": [
              "user 4"
            ],
            "auditors": [
              "user 4"
            ],
            "city": "Panaji",
            "country": "India",
            "created_by": "varunomkar007@gmail.com",
            "end_date": "Wed, 09 Apr 2025 16:39:00 GMT",
            "function_template": [
              "G",
              "a",
              "d",
              "i"
            ],
            "functions": "testgg",
            "link_audit": "Gadip",
            "start_date": "Tue, 08 Apr 2025 15:39:00 GMT",
            "template": [
              "Gadi"
            ],
            "updated_at": "None",
            "updated_by": "Tue, 08 Apr 2025 15:38:27 GMT"
          },
          {
            "audit_id": "VIG000248",
            "audit_scope": "test",
            "audit_status": "created",
            "audit_title": "testg",
            "audit_type": "ISO 270015",
            "auditees": [
              "user 4"
            ],
            "auditors": [
              "user 4"
            ],
            "city": "Panaji",
            "country": "India",
            "created_by": "varunomkar007@gmail.com",
            "end_date": "Wed, 09 Apr 2025 16:39:00 GMT",
            "function_template": [
              "G",
              "a",
              "d",
              "i"
            ],
            "functions": "testgg",
            "link_audit": "Gadip",
            "start_date": "Tue, 08 Apr 2025 15:39:00 GMT",
            "template": [
              "Gadi"
            ],
            "updated_at": "None",
            "updated_by": "Tue, 08 Apr 2025 15:38:27 GMT"
          },
          {
            "audit_id": "VIG000248",
            "audit_scope": "test",
            "audit_status": "created",
            "audit_title": "testg",
            "audit_type": "ISO 270015",
            "auditees": [
              "user 4"
            ],
            "auditors": [
              "user 4"
            ],
            "city": "Panaji",
            "country": "India",
            "created_by": "varunomkar007@gmail.com",
            "end_date": "Wed, 09 Apr 2025 16:39:00 GMT",
            "function_template": [
              "G",
              "a",
              "d",
              "i"
            ],
            "functions": "testgg",
            "link_audit": "Gadip",
            "start_date": "Tue, 08 Apr 2025 15:39:00 GMT",
            "template": [
              "Gadi"
            ],
            "updated_at": "None",
            "updated_by": "Tue, 08 Apr 2025 15:38:27 GMT"
          }
        ],
        "template": [
          "Type 1"
        ],
        "updated_at": null,
        "updated_by": "Wed, 12 Mar 2025 19:22:26 GMT"
      },
      {
        "audit_id": "VIG000251",
        "audit_scope": "test",
        "audit_status": "created",
        "audit_title": "ghkklkh",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 4"
        ],
        "auditors": [
          "user 2"
        ],
        "city": "Raipur",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Thu, 10 Apr 2025 17:31:00 GMT",
        "function_template": [
          "G",
          "a",
          "d",
          "i"
        ],
        "functions": "dfgg",
        "link_audit": "Gadip17",
        "start_date": "Thu, 17 Apr 2025 17:31:00 GMT",
        "sub_audits": [],
        "template": [
          "Array_question",
          "Gadi"
        ],
        "updated_at": null,
        "updated_by": "Mon, 07 Apr 2025 12:02:16 GMT"
      },
      {
        "audit_id": "VIG000254",
        "audit_scope": "ewfqwefgqwerg",
        "audit_status": "created",
        "audit_title": "ISO27001",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 3"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Raipur",
        "country": "India",
        "created_by": "chandrahas@gmail.com",
        "end_date": "Sat, 26 Apr 2025 21:47:00 GMT",
        "function_template": [
          "G",
          "a",
          "d",
          "i"
        ],
        "functions": "HRMS-Q1",
        "link_audit": "None",
        "start_date": "Wed, 16 Apr 2025 21:47:00 GMT",
        "sub_audits": [],
        "template": [
          "Gadi",
          "IS0-Q3"
        ],
        "updated_at": null,
        "updated_by": "Mon, 07 Apr 2025 16:17:42 GMT"
      },
      {
        "audit_id": "VIG000250",
        "audit_scope": "test",
        "audit_status": "created",
        "audit_title": "12345test",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 4"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Raipur",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Fri, 18 Apr 2025 16:21:00 GMT",
        "function_template": [
          "I",
          "S",
          "0",
          "-",
          "Q",
          "3"
        ],
        "functions": "dfg",
        "link_audit": "Gadip15",
        "start_date": "Fri, 11 Apr 2025 16:21:00 GMT",
        "sub_audits": [],
        "template": [
          "IS0-Q7",
          "Array_question"
        ],
        "updated_at": null,
        "updated_by": "Mon, 07 Apr 2025 10:51:53 GMT"
      },
      {
        "audit_id": "VIG000255",
        "audit_scope": "Chandrahas-Q4 HR Q4",
        "audit_status": "created",
        "audit_title": "Chandrahas-Q4",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 3"
        ],
        "auditors": [
          "user 3"
        ],
        "city": "Panaji",
        "country": "India",
        "created_by": "chandrahas@gmail.com",
        "end_date": "Sat, 12 Apr 2025 16:22:00 GMT",
        "function_template": [
          "I",
          "S",
          "0",
          "-",
          "Q",
          "3"
        ],
        "functions": "HR Q4",
        "link_audit": "Chandrahas-4",
        "start_date": "Thu, 10 Apr 2025 16:22:00 GMT",
        "sub_audits": [],
        "template": [
          "ISO27001"
        ],
        "updated_at": "None",
        "updated_by": "Tue, 08 Apr 2025 12:11:23 GMT"
      },
      {
        "audit_id": "VIG000244",
        "audit_scope": "HR scope",
        "audit_status": "created",
        "audit_title": "ISO2700_HR",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 3"
        ],
        "auditors": [
          "user 3"
        ],
        "city": "Raipur",
        "country": "India",
        "created_by": "chandrahas@gmail.com",
        "end_date": "Fri, 11 Apr 2025 12:39:00 GMT",
        "function_template": [
          "I",
          "S",
          "0",
          "-",
          "Q",
          "7"
        ],
        "functions": "HR_FINANCE",
        "link_audit": "Chandrahas-Audit-8",
        "start_date": "Tue, 08 Apr 2025 12:41:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2",
          "IS0-Q3",
          "Array_question"
        ],
        "updated_at": "None",
        "updated_by": "Tue, 08 Apr 2025 15:39:53 GMT"
      },
      {
        "audit_id": "VIG000245",
        "audit_scope": "gvsdag",
        "audit_status": "created",
        "audit_title": "Chandrahas-Audit123",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 3"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Patna",
        "country": "India",
        "created_by": "chandrahas@gmail.com",
        "end_date": "Sat, 05 Apr 2025 19:33:00 GMT",
        "function_template": [
          "I",
          "S",
          "0",
          "-",
          "Q",
          "3"
        ],
        "functions": "xa",
        "link_audit": "Chandrahas-3",
        "start_date": "Tue, 01 Apr 2025 19:33:00 GMT",
        "sub_audits": [],
        "template": [
          "Array_question",
          "IS0-Q3"
        ],
        "updated_at": null,
        "updated_by": "Sun, 06 Apr 2025 14:03:38 GMT"
      },
      {
        "audit_id": "VIG000035",
        "audit_scope": "tweqtg",
        "audit_status": "created",
        "audit_title": "Chandrahas-Audit-5",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 4"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Imphal",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Fri, 28 Mar 2025 22:01:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "Finance-ISMS-5",
        "link_audit": "None",
        "start_date": "Sat, 22 Mar 2025 22:01:00 GMT",
        "sub_audits": [
          {
            "audit_id": "VIG000040",
            "audit_scope": "gj",
            "audit_status": "created",
            "audit_title": "hgjklkjl",
            "audit_type": "ISO 270015",
            "auditees": [
              "user 3"
            ],
            "auditors": [
              "user 1"
            ],
            "city": "Imphal",
            "country": "India",
            "created_by": "varunomkar007@gmail.com",
            "end_date": "Fri, 14 Mar 2025 13:25:00 GMT",
            "function_template": [
              "Type 2"
            ],
            "functions": "jgg",
            "link_audit": "Chandrahas-Audit-5",
            "start_date": "Thu, 13 Mar 2025 22:26:00 GMT",
            "template": [
              "Type 2"
            ],
            "updated_at": null,
            "updated_by": "Tue, 11 Mar 2025 16:56:38 GMT"
          }
        ],
        "template": [
          "Type 1"
        ],
        "updated_at": null,
        "updated_by": "Sat, 08 Mar 2025 16:31:39 GMT"
      },
      {
        "audit_id": "VIG000103",
        "audit_scope": "adgd",
        "audit_status": "created",
        "audit_title": "fda",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 4"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Panaji",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 22 Mar 2025 18:33:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "[']",
        "link_audit": "Chandrahas-Audit-323",
        "start_date": "Sat, 22 Mar 2025 18:33:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Thu, 13 Mar 2025 13:03:19 GMT"
      },
      {
        "audit_id": "VIG000051",
        "audit_scope": "yerter",
        "audit_status": "created",
        "audit_title": "Chandrahas-Audit-356",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 4"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Imphal",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Mon, 31 Mar 2025 21:33:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "[']",
        "link_audit": "[']",
        "start_date": "Fri, 21 Mar 2025 21:33:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 1"
        ],
        "updated_at": null,
        "updated_by": "Wed, 12 Mar 2025 16:03:36 GMT"
      },
      {
        "audit_id": "VIG000026",
        "audit_scope": "ghiw",
        "audit_status": "created",
        "audit_title": "dfgh",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 3"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Itanagar",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Fri, 21 Mar 2025 17:09:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "gadi",
        "link_audit": "",
        "start_date": "Thu, 20 Mar 2025 17:09:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Sat, 08 Mar 2025 11:39:57 GMT"
      },
      {
        "audit_id": "VIG000023",
        "audit_scope": "fgh",
        "audit_status": "created",
        "audit_title": "dfhj2",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 3"
        ],
        "auditors": [
          "user 2"
        ],
        "city": "Jaipur",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Wed, 26 Mar 2025 16:41:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "dfg",
        "link_audit": "",
        "start_date": "Thu, 20 Mar 2025 16:41:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Sat, 08 Mar 2025 11:11:20 GMT"
      },
      {
        "audit_id": "VIG000022",
        "audit_scope": "Gowtha",
        "audit_status": "created",
        "audit_title": "12345gf",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 3"
        ],
        "auditors": [
          "user 2"
        ],
        "city": "Jaipur",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Tue, 18 Mar 2025 16:34:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "gadi",
        "link_audit": "",
        "start_date": "Thu, 20 Mar 2025 16:34:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Sat, 08 Mar 2025 11:04:43 GMT"
      },
      {
        "audit_id": "VIG000238",
        "audit_scope": "Test 12",
        "audit_status": "created",
        "audit_title": "ISO27001-Q5",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 3"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Ranchi",
        "country": "",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Fri, 28 Mar 2025 15:31:00 GMT",
        "function_template": [
          "A",
          "r",
          "r",
          "a",
          "y",
          "_",
          "q",
          "u",
          "e",
          "s",
          "t",
          "i",
          "o",
          "n"
        ],
        "functions": "Finance-ISMS-32",
        "link_audit": "Chandrahas-2",
        "start_date": "Thu, 20 Mar 2025 15:31:00 GMT",
        "sub_audits": [],
        "template": [
          "Array_question",
          "ISO27-Q1",
          "ISO27-Q2"
        ],
        "updated_at": null,
        "updated_by": "Wed, 19 Mar 2025 10:02:14 GMT"
      },
      {
        "audit_id": "VIG000015",
        "audit_scope": "fghj",
        "audit_status": "created",
        "audit_title": "qwer",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 4"
        ],
        "auditors": [
          "user 2"
        ],
        "city": "Imphal",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Tue, 11 Mar 2025 11:13:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "fgjk",
        "link_audit": "None",
        "start_date": "Wed, 19 Mar 2025 11:13:00 GMT",
        "sub_audits": [
          {
            "audit_id": "VIG000016",
            "audit_scope": "sdf",
            "audit_status": "created",
            "audit_title": "1234g",
            "audit_type": "ISO 270015",
            "auditees": [
              "user 3"
            ],
            "auditors": [
              "user 2"
            ],
            "city": "Jaipur",
            "country": "India",
            "created_by": "varunomkar007@gmail.com",
            "end_date": "Thu, 13 Mar 2025 15:39:00 GMT",
            "function_template": [
              "Type 1"
            ],
            "functions": "dfg",
            "link_audit": "qwer",
            "start_date": "Fri, 14 Mar 2025 15:39:00 GMT",
            "template": [
              "Type 2"
            ],
            "updated_at": null,
            "updated_by": "Sat, 08 Mar 2025 10:09:36 GMT"
          }
        ],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Sat, 08 Mar 2025 05:44:03 GMT"
      },
      {
        "audit_id": "VIG000039",
        "audit_scope": "Good",
        "audit_status": "created",
        "audit_title": "ghkkl",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 4"
        ],
        "auditors": [
          "user 2"
        ],
        "city": "Hyderabad",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Fri, 14 Mar 2025 22:24:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "ghjhkjk",
        "link_audit": "",
        "start_date": "Sat, 15 Mar 2025 22:24:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Tue, 11 Mar 2025 16:55:12 GMT"
      },
      {
        "audit_id": "VIG000247",
        "audit_scope": "Test 12345",
        "audit_status": "created",
        "audit_title": "Chandrahas-q4",
        "audit_type": "Physical",
        "auditees": [
          "user3@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "chandrahas@gmail.com",
        "end_date": "Wed, 19 Mar 2025 00:00:00 GMT",
        "function_template": [
          "ISO-Q3"
        ],
        "functions": "ISO",
        "link_audit": "None",
        "start_date": "Sat, 15 Mar 2025 00:00:00 GMT",
        "sub_audits": [
          {
            "audit_id": "VIG000253",
            "audit_scope": "test",
            "audit_status": "created",
            "audit_title": "testghjjk",
            "audit_type": "ISO 270015",
            "auditees": [
              "user 4"
            ],
            "auditors": [
              "user 1"
            ],
            "city": "Raipur",
            "country": "India",
            "created_by": "varunomkar007@gmail.com",
            "end_date": "Wed, 16 Apr 2025 17:33:00 GMT",
            "function_template": [
              "I",
              "S",
              "0",
              "-",
              "Q",
              "7"
            ],
            "functions": "test",
            "link_audit": "Chandrahas-q4",
            "start_date": "Wed, 16 Apr 2025 17:33:00 GMT",
            "template": [
              "Array_question",
              "Gadi",
              "Gadi",
              "IS0-Q3",
              "Array_question"
            ],
            "updated_at": null,
            "updated_by": "Mon, 07 Apr 2025 12:04:10 GMT"
          }
        ],
        "template": [
          "ISO-Q3"
        ],
        "updated_at": null,
        "updated_by": "Sun, 06 Apr 2025 14:04:51 GMT"
      },
      {
        "audit_id": "VIG000246",
        "audit_scope": "Test 12345",
        "audit_status": "created",
        "audit_title": "Chandrahas-q3",
        "audit_type": "Physical",
        "auditees": [
          "user3@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "chandrahas@gmail.com",
        "end_date": "Wed, 19 Mar 2025 00:00:00 GMT",
        "function_template": [
          "ISO-Q3"
        ],
        "functions": "ISO",
        "link_audit": "None",
        "start_date": "Sat, 15 Mar 2025 00:00:00 GMT",
        "sub_audits": [],
        "template": [
          "ISO-Q3"
        ],
        "updated_at": null,
        "updated_by": "Sun, 06 Apr 2025 14:04:51 GMT"
      },
      {
        "audit_id": "VIG000032",
        "audit_scope": "test",
        "audit_status": "created",
        "audit_title": "Chandrahas-Audit-3",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 4"
        ],
        "auditors": [
          "user 2"
        ],
        "city": "Kohima",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 22 Mar 2025 21:54:00 GMT",
        "function_template": [
          "Type 1"
        ],
        "functions": "Finance-ISMS-3",
        "link_audit": "",
        "start_date": "Fri, 14 Mar 2025 21:54:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 1"
        ],
        "updated_at": null,
        "updated_by": "Sat, 08 Mar 2025 16:25:50 GMT"
      },
      {
        "audit_id": "VIG000101",
        "audit_scope": "adfgdf",
        "audit_status": "created",
        "audit_title": "adgadfdgd",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 4"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Raipur",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 22 Mar 2025 18:32:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "[']",
        "link_audit": "Chandrahas-553",
        "start_date": "Fri, 14 Mar 2025 18:32:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 1"
        ],
        "updated_at": null,
        "updated_by": "Thu, 13 Mar 2025 13:02:42 GMT"
      },
      {
        "audit_id": "VIG000025",
        "audit_scope": "gj",
        "audit_status": "created",
        "audit_title": "12345hj",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 3"
        ],
        "auditors": [
          "user 2"
        ],
        "city": "Jaipur",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Tue, 18 Mar 2025 16:52:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "jhkl;",
        "link_audit": "",
        "start_date": "Fri, 14 Mar 2025 16:52:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Sat, 08 Mar 2025 11:23:06 GMT"
      },
      {
        "audit_id": "VIG000102",
        "audit_scope": "adgdafg",
        "audit_status": "created",
        "audit_title": "adfgadfg",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 4"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Ranchi",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 29 Mar 2025 18:32:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "[']",
        "link_audit": "Chandrahas-923",
        "start_date": "Thu, 13 Mar 2025 18:32:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 1"
        ],
        "updated_at": null,
        "updated_by": "Thu, 13 Mar 2025 13:02:59 GMT"
      },
      {
        "audit_id": "VIG000100",
        "audit_scope": "adgdfg",
        "audit_status": "created",
        "audit_title": "afdgadfg",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 4"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Panaji",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Fri, 21 Mar 2025 18:32:00 GMT",
        "function_template": [
          "Type 1"
        ],
        "functions": "[']",
        "link_audit": "Chandrahas-666",
        "start_date": "Thu, 13 Mar 2025 18:31:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Thu, 13 Mar 2025 13:02:09 GMT"
      },
      {
        "audit_id": "VIG000092",
        "audit_scope": "adg",
        "audit_status": "created",
        "audit_title": "afddfg",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 3"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Patna",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Fri, 07 Mar 2025 17:15:00 GMT",
        "function_template": [
          "Type 1"
        ],
        "functions": "[']",
        "link_audit": "Chandrahas - 18",
        "start_date": "Thu, 13 Mar 2025 17:15:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 1"
        ],
        "updated_at": null,
        "updated_by": "Thu, 13 Mar 2025 11:45:40 GMT"
      },
      {
        "audit_id": "VIG000021",
        "audit_scope": "123",
        "audit_status": "created",
        "audit_title": "12",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 3"
        ],
        "auditors": [
          "user 2"
        ],
        "city": "Imphal",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Tue, 11 Mar 2025 16:24:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "df",
        "link_audit": "",
        "start_date": "Thu, 13 Mar 2025 16:24:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Sat, 08 Mar 2025 10:54:30 GMT"
      },
      {
        "audit_id": "VIG000019",
        "audit_scope": "Gow",
        "audit_status": "created",
        "audit_title": "12345f",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 4"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Itanagar",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Tue, 18 Mar 2025 16:11:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "fgh",
        "link_audit": "",
        "start_date": "Thu, 13 Mar 2025 16:11:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Sat, 08 Mar 2025 10:41:33 GMT"
      },
      {
        "audit_id": "VIG000018",
        "audit_scope": "ghhhj",
        "audit_status": "created",
        "audit_title": "ertd",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 3"
        ],
        "auditors": [
          "user 2"
        ],
        "city": "Itanagar",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Wed, 12 Mar 2025 16:06:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "dfgh",
        "link_audit": "",
        "start_date": "Thu, 13 Mar 2025 16:05:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 1"
        ],
        "updated_at": null,
        "updated_by": "Sat, 08 Mar 2025 10:36:16 GMT"
      },
      {
        "audit_id": "VIG000084",
        "audit_scope": "sdgsd",
        "audit_status": "created",
        "audit_title": "sdfgsd",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 4"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Jaipur",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Tue, 25 Mar 2025 13:19:00 GMT",
        "function_template": [
          "Type 1"
        ],
        "functions": "sdgf",
        "link_audit": "Chandrahas-1",
        "start_date": "Thu, 13 Mar 2025 13:19:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 1"
        ],
        "updated_at": null,
        "updated_by": "Thu, 13 Mar 2025 07:49:46 GMT"
      },
      {
        "audit_id": "VIG000079",
        "audit_scope": "asgsdg",
        "audit_status": "created",
        "audit_title": "gasg",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 3"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Itanagar",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Thu, 27 Mar 2025 12:33:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "",
        "link_audit": "None",
        "start_date": "Thu, 13 Mar 2025 12:32:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 1"
        ],
        "updated_at": null,
        "updated_by": "Thu, 13 Mar 2025 07:03:15 GMT"
      },
      {
        "audit_id": "VIG000078",
        "audit_scope": "sfg",
        "audit_status": "created",
        "audit_title": "fdgfg",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 4"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Jaipur",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 22 Mar 2025 12:27:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "gsdg",
        "link_audit": "None",
        "start_date": "Thu, 13 Mar 2025 12:26:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 1"
        ],
        "updated_at": null,
        "updated_by": "Thu, 13 Mar 2025 06:57:42 GMT"
      },
      {
        "audit_id": "VIG000073",
        "audit_scope": "setwet",
        "audit_status": "created",
        "audit_title": "Chandrahas-Audit-323",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 3"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Kohima",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Fri, 14 Mar 2025 11:34:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "sgfsdg",
        "link_audit": "None",
        "start_date": "Thu, 13 Mar 2025 11:34:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 1"
        ],
        "updated_at": null,
        "updated_by": "Thu, 13 Mar 2025 06:05:45 GMT"
      },
      {
        "audit_id": "VIG000104",
        "audit_scope": "Test 123",
        "audit_status": "created",
        "audit_title": "Chandrahas-1234",
        "audit_type": "ISO 270015",
        "auditees": [
          "user3@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 15 Mar 2025 00:00:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "dvgr",
        "link_audit": "None",
        "start_date": "Thu, 13 Mar 2025 00:00:00 GMT",
        "sub_audits": [
          {
            "audit_id": "VIG000236",
            "audit_scope": "dsgeqrgerqg",
            "audit_status": "created",
            "audit_title": "ISO27001-Q2",
            "audit_type": "ISO 270015",
            "auditees": [
              "user 4"
            ],
            "auditors": [
              "user 1"
            ],
            "city": "Patna",
            "country": "India",
            "created_by": "varunomkar007@gmail.com",
            "end_date": "Thu, 27 Mar 2025 12:43:00 GMT",
            "function_template": [
              "T",
              "y",
              "p",
              "e",
              " ",
              "3"
            ],
            "functions": "HR-Q2",
            "link_audit": "Chandrahas-1234",
            "start_date": "Thu, 20 Mar 2025 12:43:00 GMT",
            "template": [
              "T",
              "y",
              "p",
              "e",
              " ",
              "2"
            ],
            "updated_at": null,
            "updated_by": "Mon, 17 Mar 2025 07:14:05 GMT"
          }
        ],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Thu, 13 Mar 2025 13:06:54 GMT"
      },
      {
        "audit_id": "VIG000080",
        "audit_scope": "Test 123",
        "audit_status": "created",
        "audit_title": "Chandrahas-5555",
        "audit_type": "ISO 270015",
        "auditees": [
          "user3@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 15 Mar 2025 00:00:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "dvgr",
        "link_audit": "None",
        "start_date": "Thu, 13 Mar 2025 00:00:00 GMT",
        "sub_audits": [
          {
            "audit_id": "VIG000083",
            "audit_scope": "sdfsdf",
            "audit_status": "created",
            "audit_title": "dfhs",
            "audit_type": "ISO 270015",
            "auditees": [
              "user 3"
            ],
            "auditors": [
              "user 2"
            ],
            "city": "Itanagar",
            "country": "India",
            "created_by": "varunomkar007@gmail.com",
            "end_date": "Wed, 26 Mar 2025 13:17:00 GMT",
            "function_template": [
              "Type 3"
            ],
            "functions": "sfdh",
            "link_audit": "Chandrahas-5555",
            "start_date": "Thu, 13 Mar 2025 13:17:00 GMT",
            "template": [
              "Type 2"
            ],
            "updated_at": null,
            "updated_by": "Thu, 13 Mar 2025 07:48:32 GMT"
          }
        ],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Thu, 13 Mar 2025 07:36:27 GMT"
      },
      {
        "audit_id": "VIG000081",
        "audit_scope": "Test 123",
        "audit_status": "created",
        "audit_title": "Chandrahas-555544",
        "audit_type": "ISO 270015",
        "auditees": [
          "user3@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 15 Mar 2025 00:00:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "dvgr",
        "link_audit": "None",
        "start_date": "Thu, 13 Mar 2025 00:00:00 GMT",
        "sub_audits": [
          {
            "audit_id": "VIG000098",
            "audit_scope": "adgdf",
            "audit_status": "created",
            "audit_title": "adgfga",
            "audit_type": "ISO 270015",
            "auditees": [
              "user 4"
            ],
            "auditors": [
              "user 1"
            ],
            "city": "[']",
            "country": "[']",
            "created_by": "varunomkar007@gmail.com",
            "end_date": "Fri, 21 Mar 2025 18:31:00 GMT",
            "function_template": [
              "Type 2"
            ],
            "functions": "[']",
            "link_audit": "Chandrahas-555544",
            "start_date": "Sat, 15 Mar 2025 18:31:00 GMT",
            "template": [
              "Type 2"
            ],
            "updated_at": null,
            "updated_by": "Thu, 13 Mar 2025 13:01:29 GMT"
          }
        ],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Thu, 13 Mar 2025 07:37:38 GMT"
      },
      {
        "audit_id": "VIG000082",
        "audit_scope": "Test 123",
        "audit_status": "created",
        "audit_title": "Chandrahas-55554",
        "audit_type": "ISO 270015",
        "auditees": [
          "user3@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 15 Mar 2025 00:00:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "dvgr",
        "link_audit": "None",
        "start_date": "Thu, 13 Mar 2025 00:00:00 GMT",
        "sub_audits": [
          {
            "audit_id": "VIG000096",
            "audit_scope": "shf",
            "audit_status": "created",
            "audit_title": "gshsgh",
            "audit_type": "ISO 270015",
            "auditees": [
              "user 4"
            ],
            "auditors": [
              "user 2"
            ],
            "city": "Raipur",
            "country": "India",
            "created_by": "varunomkar007@gmail.com",
            "end_date": "Wed, 12 Mar 2025 18:29:00 GMT",
            "function_template": [
              "Type 1"
            ],
            "functions": "sh",
            "link_audit": "Chandrahas-55554",
            "start_date": "Tue, 11 Mar 2025 18:29:00 GMT",
            "template": [
              "Type 2"
            ],
            "updated_at": null,
            "updated_by": "Thu, 13 Mar 2025 13:00:05 GMT"
          }
        ],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Thu, 13 Mar 2025 07:47:02 GMT"
      },
      {
        "audit_id": "VIG000085",
        "audit_scope": "Test 123",
        "audit_status": "created",
        "audit_title": "Chandrahas-55553",
        "audit_type": "ISO 270015",
        "auditees": [
          "user3@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 15 Mar 2025 00:00:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "dvgr",
        "link_audit": "None",
        "start_date": "Thu, 13 Mar 2025 00:00:00 GMT",
        "sub_audits": [
          {
            "audit_id": "VIG000086",
            "audit_scope": "dsvsdv",
            "audit_status": "created",
            "audit_title": "safas",
            "audit_type": "ISO 270015",
            "auditees": [
              "user 3"
            ],
            "auditors": [
              "user 2"
            ],
            "city": "Jaipur",
            "country": "India",
            "created_by": "varunomkar007@gmail.com",
            "end_date": "Thu, 20 Mar 2025 15:54:00 GMT",
            "function_template": [
              "Type 1"
            ],
            "functions": "",
            "link_audit": "Chandrahas-55553",
            "start_date": "Tue, 04 Mar 2025 15:54:00 GMT",
            "template": [
              "Type 1"
            ],
            "updated_at": null,
            "updated_by": "Thu, 13 Mar 2025 10:24:17 GMT"
          }
        ],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Thu, 13 Mar 2025 08:08:46 GMT"
      },
      {
        "audit_id": "VIG000087",
        "audit_scope": "Test 123",
        "audit_status": "created",
        "audit_title": "Chandrahas-53",
        "audit_type": "ISO 270015",
        "auditees": [
          "user3@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 15 Mar 2025 00:00:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "dvgr",
        "link_audit": "None",
        "start_date": "Thu, 13 Mar 2025 00:00:00 GMT",
        "sub_audits": [
          {
            "audit_id": "VIG000099",
            "audit_scope": "dfagadf",
            "audit_status": "created",
            "audit_title": "adgdafg",
            "audit_type": "ISO 270015",
            "auditees": [
              "user 4"
            ],
            "auditors": [
              "user 1"
            ],
            "city": "Raipur",
            "country": "India",
            "created_by": "varunomkar007@gmail.com",
            "end_date": "Thu, 20 Mar 2025 18:31:00 GMT",
            "function_template": [
              "[']"
            ],
            "functions": "[']",
            "link_audit": "Chandrahas-53",
            "start_date": "Thu, 13 Mar 2025 18:31:00 GMT",
            "template": [
              "Type 2"
            ],
            "updated_at": null,
            "updated_by": "Thu, 13 Mar 2025 13:01:51 GMT"
          }
        ],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Thu, 13 Mar 2025 10:31:15 GMT"
      },
      {
        "audit_id": "VIG000088",
        "audit_scope": "Test 123",
        "audit_status": "created",
        "audit_title": "Chandrahas-453",
        "audit_type": "ISO 270015",
        "auditees": [
          "user3@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 15 Mar 2025 00:00:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "dvgr",
        "link_audit": "None",
        "start_date": "Thu, 13 Mar 2025 00:00:00 GMT",
        "sub_audits": [
          {
            "audit_id": "VIG000097",
            "audit_scope": "gasdg",
            "audit_status": "created",
            "audit_title": "aggaga",
            "audit_type": "ISO 270015",
            "auditees": [
              "user 3"
            ],
            "auditors": [
              "user 1"
            ],
            "city": "Ranchi",
            "country": "India",
            "created_by": "varunomkar007@gmail.com",
            "end_date": "Sat, 22 Mar 2025 18:31:00 GMT",
            "function_template": [
              "Type 2"
            ],
            "functions": "",
            "link_audit": "Chandrahas-453",
            "start_date": "Fri, 07 Mar 2025 18:30:00 GMT",
            "template": [
              "Type 2"
            ],
            "updated_at": null,
            "updated_by": "Thu, 13 Mar 2025 13:01:02 GMT"
          }
        ],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Thu, 13 Mar 2025 10:36:14 GMT"
      },
      {
        "audit_id": "VIG000089",
        "audit_scope": "Test 123",
        "audit_status": "created",
        "audit_title": "Audit-demo",
        "audit_type": "ISO 270015",
        "auditees": [
          "user3@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 15 Mar 2025 00:00:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "dvgr",
        "link_audit": "None",
        "start_date": "Thu, 13 Mar 2025 00:00:00 GMT",
        "sub_audits": [
          {
            "audit_id": "VIG000090",
            "audit_scope": "Demo test",
            "audit_status": "created",
            "audit_title": "Demo 12",
            "audit_type": "ISO 270015",
            "auditees": [
              "user 3"
            ],
            "auditors": [
              "user 2"
            ],
            "city": "Patna",
            "country": "India",
            "created_by": "varunomkar007@gmail.com",
            "end_date": "Thu, 20 Mar 2025 16:16:00 GMT",
            "function_template": [
              "Type 2"
            ],
            "functions": "",
            "link_audit": "Audit-demo",
            "start_date": "Mon, 10 Mar 2025 16:16:00 GMT",
            "template": [
              "Type 1"
            ],
            "updated_at": null,
            "updated_by": "Thu, 13 Mar 2025 10:46:39 GMT"
          }
        ],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Thu, 13 Mar 2025 10:45:48 GMT"
      },
      {
        "audit_id": "VIG000091",
        "audit_scope": "Test 123",
        "audit_status": "created",
        "audit_title": "Chandrahas-007",
        "audit_type": "ISO 270015",
        "auditees": [
          "user3@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 15 Mar 2025 00:00:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "dvgr",
        "link_audit": "None",
        "start_date": "Thu, 13 Mar 2025 00:00:00 GMT",
        "sub_audits": [
          {
            "audit_id": "VIG000093",
            "audit_scope": "adbnadfn",
            "audit_status": "created",
            "audit_title": "dfsbdfb",
            "audit_type": "ISO 270015",
            "auditees": [
              "user 4"
            ],
            "auditors": [
              "user 1"
            ],
            "city": "Ranchi",
            "country": "India",
            "created_by": "varunomkar007@gmail.com",
            "end_date": "Sat, 29 Mar 2025 17:16:00 GMT",
            "function_template": [
              "Type 2"
            ],
            "functions": "[']",
            "link_audit": "Chandrahas-007",
            "start_date": "Thu, 13 Mar 2025 17:16:00 GMT",
            "template": [
              "Type 1"
            ],
            "updated_at": null,
            "updated_by": "Thu, 13 Mar 2025 11:46:15 GMT"
          }
        ],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Thu, 13 Mar 2025 11:21:37 GMT"
      },
      {
        "audit_id": "VIG000094",
        "audit_scope": "Test 123",
        "audit_status": "created",
        "audit_title": "Chandrahas-553",
        "audit_type": "ISO 270015",
        "auditees": [
          "user3@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 15 Mar 2025 00:00:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "dvgr",
        "link_audit": "None",
        "start_date": "Thu, 13 Mar 2025 00:00:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Thu, 13 Mar 2025 12:58:00 GMT"
      },
      {
        "audit_id": "VIG000095",
        "audit_scope": "Test 123",
        "audit_status": "created",
        "audit_title": "Chandrahas-003",
        "audit_type": "ISO 270015",
        "auditees": [
          "user3@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 15 Mar 2025 00:00:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "dvgr",
        "link_audit": "None",
        "start_date": "Thu, 13 Mar 2025 00:00:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Thu, 13 Mar 2025 12:58:46 GMT"
      },
      {
        "audit_id": "VIG000042",
        "audit_scope": "Test 123",
        "audit_status": "created",
        "audit_title": "Sample audit-24534",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 3"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 15 Mar 2025 00:00:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "dvgr",
        "link_audit": "None",
        "start_date": "Thu, 13 Mar 2025 00:00:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Wed, 12 Mar 2025 13:18:41 GMT"
      },
      {
        "audit_id": "VIG000043",
        "audit_scope": "Test 123",
        "audit_status": "created",
        "audit_title": "Sample audit-24",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 3"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 15 Mar 2025 00:00:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "dvgr",
        "link_audit": "None",
        "start_date": "Thu, 13 Mar 2025 00:00:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Wed, 12 Mar 2025 13:19:45 GMT"
      },
      {
        "audit_id": "VIG000045",
        "audit_scope": "Test 123",
        "audit_status": "created",
        "audit_title": "Sample audit-24120",
        "audit_type": "ISO 270015",
        "auditees": [
          "user2@gmail.com"
        ],
        "auditors": [
          "user@gmail.com"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 15 Mar 2025 00:00:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "dvgr",
        "link_audit": "None",
        "start_date": "Thu, 13 Mar 2025 00:00:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Wed, 12 Mar 2025 14:34:41 GMT"
      },
      {
        "audit_id": "VIG000046",
        "audit_scope": "Test 123",
        "audit_status": "created",
        "audit_title": "Sample audit-24121",
        "audit_type": "ISO 270015",
        "auditees": [
          "user2@gmail.com"
        ],
        "auditors": [
          "user@gmail.com"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 15 Mar 2025 00:00:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "dvgr",
        "link_audit": "None",
        "start_date": "Thu, 13 Mar 2025 00:00:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Wed, 12 Mar 2025 14:36:07 GMT"
      },
      {
        "audit_id": "VIG000047",
        "audit_scope": "Test 123",
        "audit_status": "created",
        "audit_title": "Sample audit-24122",
        "audit_type": "ISO 270015",
        "auditees": [
          "user2@gmail.com"
        ],
        "auditors": [
          "user@gmail.com"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 15 Mar 2025 00:00:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "dvgr",
        "link_audit": "None",
        "start_date": "Thu, 13 Mar 2025 00:00:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Wed, 12 Mar 2025 14:36:07 GMT"
      },
      {
        "audit_id": "VIG000048",
        "audit_scope": "Test 123",
        "audit_status": "created",
        "audit_title": "Sample audit-24125",
        "audit_type": "ISO 270015",
        "auditees": [
          "user3@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 15 Mar 2025 00:00:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "dvgr",
        "link_audit": "None",
        "start_date": "Thu, 13 Mar 2025 00:00:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Wed, 12 Mar 2025 15:22:27 GMT"
      },
      {
        "audit_id": "VIG000049",
        "audit_scope": "Test 123",
        "audit_status": "created",
        "audit_title": "Sample audit-24126",
        "audit_type": "ISO 270015",
        "auditees": [
          "user3@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 15 Mar 2025 00:00:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "dvgr",
        "link_audit": "None",
        "start_date": "Thu, 13 Mar 2025 00:00:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Wed, 12 Mar 2025 15:22:27 GMT"
      },
      {
        "audit_id": "VIG000059",
        "audit_scope": "Test 123",
        "audit_status": "created",
        "audit_title": "Chandrahas-2",
        "audit_type": "ISO 270015",
        "auditees": [
          "user3@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 15 Mar 2025 00:00:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "dvgr",
        "link_audit": "None",
        "start_date": "Thu, 13 Mar 2025 00:00:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Wed, 12 Mar 2025 16:17:27 GMT"
      },
      {
        "audit_id": "VIG000060",
        "audit_scope": "Test 123",
        "audit_status": "created",
        "audit_title": "Chandrahas-3",
        "audit_type": "ISO 270015",
        "auditees": [
          "user3@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 15 Mar 2025 00:00:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "dvgr",
        "link_audit": "None",
        "start_date": "Thu, 13 Mar 2025 00:00:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Wed, 12 Mar 2025 16:17:27 GMT"
      },
      {
        "audit_id": "VIG000061",
        "audit_scope": "Test 123",
        "audit_status": "created",
        "audit_title": "Chandrahas-4",
        "audit_type": "ISO 270015",
        "auditees": [
          "user3@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 15 Mar 2025 00:00:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "dvgr",
        "link_audit": "None",
        "start_date": "Thu, 13 Mar 2025 00:00:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Wed, 12 Mar 2025 16:59:44 GMT"
      },
      {
        "audit_id": "VIG000062",
        "audit_scope": "Test 123",
        "audit_status": "created",
        "audit_title": "Chandrahas-5",
        "audit_type": "ISO 270015",
        "auditees": [
          "user3@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 15 Mar 2025 00:00:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "dvgr",
        "link_audit": "None",
        "start_date": "Thu, 13 Mar 2025 00:00:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Wed, 12 Mar 2025 16:59:44 GMT"
      },
      {
        "audit_id": "VIG000065",
        "audit_scope": "Test 123",
        "audit_status": "created",
        "audit_title": "Chandrahas-9",
        "audit_type": "ISO 270015",
        "auditees": [
          "user3@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 15 Mar 2025 00:00:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "dvgr",
        "link_audit": "None",
        "start_date": "Thu, 13 Mar 2025 00:00:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Wed, 12 Mar 2025 17:21:28 GMT"
      },
      {
        "audit_id": "VIG000074",
        "audit_scope": "Test 123",
        "audit_status": "created",
        "audit_title": "Chandrahas-923",
        "audit_type": "ISO 270015",
        "auditees": [
          "user3@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 15 Mar 2025 00:00:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "dvgr",
        "link_audit": "None",
        "start_date": "Thu, 13 Mar 2025 00:00:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Thu, 13 Mar 2025 06:10:33 GMT"
      },
      {
        "audit_id": "VIG000075",
        "audit_scope": "Test 123",
        "audit_status": "created",
        "audit_title": "Chandrahas-999",
        "audit_type": "ISO 270015",
        "auditees": [
          "user3@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 15 Mar 2025 00:00:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "dvgr",
        "link_audit": "None",
        "start_date": "Thu, 13 Mar 2025 00:00:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Thu, 13 Mar 2025 06:14:28 GMT"
      },
      {
        "audit_id": "VIG000076",
        "audit_scope": "Test 123",
        "audit_status": "created",
        "audit_title": "Chandrahas-666",
        "audit_type": "ISO 270015",
        "auditees": [
          "user3@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 15 Mar 2025 00:00:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "dvgr",
        "link_audit": "None",
        "start_date": "Thu, 13 Mar 2025 00:00:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Thu, 13 Mar 2025 06:14:28 GMT"
      },
      {
        "audit_id": "VIG000064",
        "audit_scope": "dfsgadfg",
        "audit_status": "created",
        "audit_title": "Chandrahas-Audit-8",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 3"
        ],
        "auditors": [
          "user 2"
        ],
        "city": "Itanagar",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Thu, 27 Mar 2025 22:32:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "",
        "link_audit": "None",
        "start_date": "Wed, 12 Mar 2025 22:32:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 1"
        ],
        "updated_at": null,
        "updated_by": "Wed, 12 Mar 2025 17:02:47 GMT"
      },
      {
        "audit_id": "VIG000063",
        "audit_scope": "dsagg",
        "audit_status": "created",
        "audit_title": "Abc12",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 3"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Kohima",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Fri, 28 Mar 2025 22:30:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "ffwe",
        "link_audit": "Chandrahas - 123",
        "start_date": "Wed, 12 Mar 2025 22:30:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 3"
        ],
        "updated_at": null,
        "updated_by": "Wed, 12 Mar 2025 17:01:10 GMT"
      },
      {
        "audit_id": "VIG000036",
        "audit_scope": "ghjkl",
        "audit_status": "created",
        "audit_title": "ggjk",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 3"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Imphal",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Tue, 18 Mar 2025 22:04:00 GMT",
        "function_template": [],
        "functions": "hjj",
        "link_audit": "",
        "start_date": "Wed, 12 Mar 2025 22:04:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Sat, 08 Mar 2025 16:34:18 GMT"
      },
      {
        "audit_id": "VIG000058",
        "audit_scope": "weqfef",
        "audit_status": "created",
        "audit_title": "Chandrahas-1",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 4"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Imphal",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Fri, 14 Mar 2025 21:44:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "",
        "link_audit": "None",
        "start_date": "Wed, 12 Mar 2025 21:44:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Wed, 12 Mar 2025 16:14:41 GMT"
      },
      {
        "audit_id": "VIG000052",
        "audit_scope": "rterwt",
        "audit_status": "created",
        "audit_title": "Chandrahas-Audit-3333",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 3"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Jaipur",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Thu, 20 Mar 2025 21:34:00 GMT",
        "function_template": [
          "Type 1"
        ],
        "functions": "Finance-ISMS-333",
        "link_audit": "",
        "start_date": "Wed, 12 Mar 2025 21:34:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 3"
        ],
        "updated_at": null,
        "updated_by": "Wed, 12 Mar 2025 16:05:02 GMT"
      },
      {
        "audit_id": "VIG000050",
        "audit_scope": "test",
        "audit_status": "created",
        "audit_title": "Chandrahas-Audit-334",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 4"
        ],
        "auditors": [
          "user 2"
        ],
        "city": "Itanagar",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Wed, 26 Mar 2025 21:32:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "",
        "link_audit": "Sample Audit - 7331",
        "start_date": "Wed, 12 Mar 2025 21:32:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Wed, 12 Mar 2025 16:02:24 GMT"
      },
      {
        "audit_id": "VIG000105",
        "audit_scope": "demo - test",
        "audit_status": "created",
        "audit_title": "Audit-demo-123",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 4"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 22 Mar 2025 20:36:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "demo-1",
        "link_audit": "None",
        "start_date": "Wed, 12 Mar 2025 20:36:00 GMT",
        "sub_audits": [
          {
            "audit_id": "VIG000107",
            "audit_scope": "ISO27001, HR and organisation policies",
            "audit_status": "created",
            "audit_title": "HR-ISO27001-Q1",
            "audit_type": "ISO 270015",
            "auditees": [
              "user 3"
            ],
            "auditors": [
              "user 1"
            ],
            "city": "Chennai",
            "country": "India",
            "created_by": "varunomkar007@gmail.com",
            "end_date": "Tue, 11 Mar 2025 20:56:00 GMT",
            "function_template": [
              "Type 1"
            ],
            "functions": "HR",
            "link_audit": "Audit-demo-123",
            "start_date": "Tue, 11 Mar 2025 20:56:00 GMT",
            "template": [
              "Type 2"
            ],
            "updated_at": null,
            "updated_by": "Thu, 13 Mar 2025 15:28:11 GMT"
          }
        ],
        "template": [
          "Type 1"
        ],
        "updated_at": null,
        "updated_by": "Thu, 13 Mar 2025 15:08:17 GMT"
      },
      {
        "audit_id": "VIG000017",
        "audit_scope": "df",
        "audit_status": "created",
        "audit_title": "d",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 3"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Imphal",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Tue, 11 Mar 2025 15:52:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "fg",
        "link_audit": "",
        "start_date": "Wed, 12 Mar 2025 15:51:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 1"
        ],
        "updated_at": null,
        "updated_by": "Sat, 08 Mar 2025 10:22:18 GMT"
      },
      {
        "audit_id": "VIG000235",
        "audit_scope": "wrhrthwrhrt",
        "audit_status": "created",
        "audit_title": "dgfgghrt",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 4"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Patna",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Thu, 27 Mar 2025 12:42:00 GMT",
        "function_template": [
          "T",
          "y",
          "p",
          "e",
          " ",
          "2"
        ],
        "functions": "rtwhrthwrthrt",
        "link_audit": "Chandrahas-003",
        "start_date": "Wed, 12 Mar 2025 12:42:00 GMT",
        "sub_audits": [],
        "template": [
          "T",
          "y",
          "p",
          "e",
          " ",
          "2"
        ],
        "updated_at": null,
        "updated_by": "Mon, 17 Mar 2025 07:13:07 GMT"
      },
      {
        "audit_id": "VIG000041",
        "audit_scope": "tesrttttt",
        "audit_status": "created",
        "audit_title": "Chandrahas-Audit-31",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 4"
        ],
        "auditors": [
          "user 2"
        ],
        "city": "Jaipur",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Wed, 26 Mar 2025 22:41:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "Finance-ISMS-31",
        "link_audit": "",
        "start_date": "Tue, 11 Mar 2025 22:41:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Tue, 11 Mar 2025 17:11:18 GMT"
      },
      {
        "audit_id": "VIG000072",
        "audit_scope": "test",
        "audit_status": "created",
        "audit_title": "gadi6",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 4"
        ],
        "auditors": [
          "user 2"
        ],
        "city": "Hyderabad",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Wed, 12 Mar 2025 10:36:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "rtyui",
        "link_audit": "None",
        "start_date": "Tue, 11 Mar 2025 10:36:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 1"
        ],
        "updated_at": null,
        "updated_by": "Thu, 13 Mar 2025 05:06:39 GMT"
      },
      {
        "audit_id": "VIG000014",
        "audit_scope": "dfhj",
        "audit_status": "created",
        "audit_title": "1234678f",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 3"
        ],
        "auditors": [
          "user 2"
        ],
        "city": "Jaipur",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Thu, 20 Mar 2025 11:11:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "dfgh",
        "link_audit": "",
        "start_date": "Tue, 11 Mar 2025 02:11:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 1"
        ],
        "updated_at": null,
        "updated_by": "Sat, 08 Mar 2025 05:42:48 GMT"
      },
      {
        "audit_id": "VIG000037",
        "audit_scope": "Test 123",
        "audit_status": "created",
        "audit_title": "Sample audit-245",
        "audit_type": "ISO 270015",
        "auditees": [
          "[user 3]"
        ],
        "auditors": [
          "[user 1]"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Fri, 14 Mar 2025 22:37:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "dvgr",
        "link_audit": "None",
        "start_date": "Mon, 10 Mar 2025 22:37:00 GMT",
        "sub_audits": [
          {
            "audit_id": "VIG000038",
            "audit_scope": "tetsetttt",
            "audit_status": "created",
            "audit_title": "Chandrahas-Audit-35",
            "audit_type": "ISO 270015",
            "auditees": [
              "user 3"
            ],
            "auditors": [
              "user 2"
            ],
            "city": "Jaipur",
            "country": "India",
            "created_by": "varunomkar007@gmail.com",
            "end_date": "Fri, 14 Mar 2025 22:56:00 GMT",
            "function_template": [
              "Type 1"
            ],
            "functions": "Finance-ISMS-35",
            "link_audit": "Sample audit-245",
            "start_date": "Mon, 10 Mar 2025 22:56:00 GMT",
            "template": [
              "Type 1"
            ],
            "updated_at": null,
            "updated_by": "Mon, 10 Mar 2025 17:27:12 GMT"
          }
        ],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Mon, 10 Mar 2025 17:15:31 GMT"
      },
      {
        "audit_id": "VIG000031",
        "audit_scope": "test",
        "audit_status": "created",
        "audit_title": "Chandrahas-Audit-2",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 4"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Itanagar",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Sat, 08 Mar 2025 21:53:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "Finance-ISMS-2",
        "link_audit": "Sample Audit - 73d",
        "start_date": "Sat, 08 Mar 2025 21:53:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 1"
        ],
        "updated_at": null,
        "updated_by": "Sat, 08 Mar 2025 16:23:39 GMT"
      },
      {
        "audit_id": "VIG000030",
        "audit_scope": "Test",
        "audit_status": "created",
        "audit_title": "Chandrahas-Audit-1",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 3"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Jaipur",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Fri, 21 Mar 2025 20:39:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "Finance-ISMS-1",
        "link_audit": "",
        "start_date": "Sat, 08 Mar 2025 20:39:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 1"
        ],
        "updated_at": null,
        "updated_by": "Sat, 08 Mar 2025 15:09:33 GMT"
      },
      {
        "audit_id": "VIG000029",
        "audit_scope": "test",
        "audit_status": "created",
        "audit_title": "Chandrahas-Audit",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 3"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Chandigarh",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Thu, 13 Mar 2025 20:30:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "Finance-ISMS",
        "link_audit": "",
        "start_date": "Sat, 08 Mar 2025 20:29:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 1"
        ],
        "updated_at": null,
        "updated_by": "Sat, 08 Mar 2025 15:00:16 GMT"
      },
      {
        "audit_id": "VIG000033",
        "audit_scope": "testtyyy",
        "audit_status": "created",
        "audit_title": "Chandrahas-Audit-4",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 3"
        ],
        "auditors": [
          "user 2"
        ],
        "city": "Jaipur",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Thu, 13 Mar 2025 21:57:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "Finance-ISMS-4",
        "link_audit": "",
        "start_date": "Fri, 07 Mar 2025 21:57:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 3"
        ],
        "updated_at": null,
        "updated_by": "Sat, 08 Mar 2025 16:28:29 GMT"
      },
      {
        "audit_id": "VIG000012",
        "audit_scope": "reqwrqw",
        "audit_status": "created",
        "audit_title": "Abcr",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 4"
        ],
        "auditors": [
          "user 2"
        ],
        "city": "Gangtok",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Fri, 07 Mar 2025 17:20:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "r",
        "link_audit": "Sample Audit - 3",
        "start_date": "Fri, 07 Mar 2025 19:16:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 1"
        ],
        "updated_at": null,
        "updated_by": "Fri, 07 Mar 2025 11:47:08 GMT"
      },
      {
        "audit_id": "VIG000123",
        "audit_scope": "",
        "audit_status": "created",
        "audit_title": "qwe",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 3"
        ],
        "auditors": [
          "user 2"
        ],
        "city": "Hyderabad",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Thu, 13 Mar 2025 02:32:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "345",
        "link_audit": "Sample Audit - 733",
        "start_date": "Fri, 07 Mar 2025 02:32:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 1"
        ],
        "updated_at": null,
        "updated_by": "Mon, 10 Mar 2025 21:02:33 GMT"
      },
      {
        "audit_id": "VIG000056",
        "audit_scope": "ewfwefq",
        "audit_status": "created",
        "audit_title": "Chandrahas-123",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 4"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Gandhinagar",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Thu, 13 Mar 2025 21:42:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "",
        "link_audit": "",
        "start_date": "Thu, 06 Mar 2025 21:42:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Wed, 12 Mar 2025 16:12:23 GMT"
      },
      {
        "audit_id": "VIG000106",
        "audit_scope": "ISO27001, organisation policies",
        "audit_status": "created",
        "audit_title": "ISO27001-Q1-AUDIT",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 4"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Fri, 28 Mar 2025 20:43:00 GMT",
        "function_template": [
          "Type 3"
        ],
        "functions": "",
        "link_audit": "[']",
        "start_date": "Thu, 06 Mar 2025 20:43:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Thu, 13 Mar 2025 15:19:12 GMT"
      },
      {
        "audit_id": "VIG000013",
        "audit_scope": "dfghj",
        "audit_status": "created",
        "audit_title": "1234",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 3"
        ],
        "auditors": [
          "user 1"
        ],
        "city": "Kohima",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Tue, 18 Mar 2025 19:59:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "gadi",
        "link_audit": "Sample Audit - 4",
        "start_date": "Thu, 06 Mar 2025 19:59:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Fri, 07 Mar 2025 14:29:57 GMT"
      },
      {
        "audit_id": "VIG000024",
        "audit_scope": "fgh",
        "audit_status": "created",
        "audit_title": "12345gff",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 4"
        ],
        "auditors": [
          "user 2"
        ],
        "city": "Imphal",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Mon, 10 Mar 2025 16:49:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "dfg",
        "link_audit": "",
        "start_date": "Thu, 06 Mar 2025 16:49:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Sat, 08 Mar 2025 11:20:04 GMT"
      },
      {
        "audit_id": "VIG000054",
        "audit_scope": "tewrterw",
        "audit_status": "created",
        "audit_title": "Chandrahas-Audit-6",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 3"
        ],
        "auditors": [
          "user 2"
        ],
        "city": "Gandhinagar",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Thu, 20 Mar 2025 21:36:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "Finance-ISMS-6",
        "link_audit": "",
        "start_date": "Wed, 05 Mar 2025 21:36:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Wed, 12 Mar 2025 16:06:25 GMT"
      },
      {
        "audit_id": "VIG000020",
        "audit_scope": "good",
        "audit_status": "created",
        "audit_title": "12345",
        "audit_type": "ISO 270015",
        "auditees": [
          "user 3"
        ],
        "auditors": [
          "user 2"
        ],
        "city": "Imphal",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Fri, 21 Mar 2025 16:22:00 GMT",
        "function_template": [],
        "functions": "",
        "link_audit": "",
        "start_date": "Sat, 01 Mar 2025 16:22:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 2"
        ],
        "updated_at": null,
        "updated_by": "Sat, 08 Mar 2025 10:53:09 GMT"
      },
      {
        "audit_id": "VIG000067",
        "audit_scope": "Test",
        "audit_status": "created",
        "audit_title": "Gadip15",
        "audit_type": "Type 1",
        "auditees": [
          "user4@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com"
        ],
        "city": "Guntur",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Tue, 25 Feb 2025 00:00:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "Gadip",
        "link_audit": "None",
        "start_date": "Fri, 21 Feb 2025 00:00:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 1"
        ],
        "updated_at": null,
        "updated_by": "Wed, 12 Mar 2025 19:36:14 GMT"
      },
      {
        "audit_id": "VIG000068",
        "audit_scope": "Test",
        "audit_status": "created",
        "audit_title": "Gadip17",
        "audit_type": "Type 1",
        "auditees": [
          "user4@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com"
        ],
        "city": "Guntur",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Tue, 25 Feb 2025 00:00:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "Gadip",
        "link_audit": "None",
        "start_date": "Fri, 21 Feb 2025 00:00:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 1"
        ],
        "updated_at": null,
        "updated_by": "Wed, 12 Mar 2025 20:32:24 GMT"
      },
      {
        "audit_id": "VIG000069",
        "audit_scope": "Test",
        "audit_status": "created",
        "audit_title": "Gadip18",
        "audit_type": "Type 1",
        "auditees": [
          "user4@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com"
        ],
        "city": "Guntur",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Tue, 25 Feb 2025 00:00:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "Gadip",
        "link_audit": "None",
        "start_date": "Fri, 21 Feb 2025 00:00:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 1"
        ],
        "updated_at": null,
        "updated_by": "Wed, 12 Mar 2025 20:40:02 GMT"
      },
      {
        "audit_id": "VIG000070",
        "audit_scope": "Test",
        "audit_status": "created",
        "audit_title": "Gadip19",
        "audit_type": "Type 1",
        "auditees": [
          "user4@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com"
        ],
        "city": "Guntur",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Tue, 25 Feb 2025 00:00:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "Gadip",
        "link_audit": "None",
        "start_date": "Fri, 21 Feb 2025 00:00:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 1"
        ],
        "updated_at": null,
        "updated_by": "Thu, 13 Mar 2025 04:01:24 GMT"
      },
      {
        "audit_id": "VIG000071",
        "audit_scope": "Test",
        "audit_status": "created",
        "audit_title": "Gadip22",
        "audit_type": "Type 1",
        "auditees": [
          "user4@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com"
        ],
        "city": "Guntur",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Tue, 25 Feb 2025 00:00:00 GMT",
        "function_template": [
          "Type 2"
        ],
        "functions": "Gadip",
        "link_audit": "None",
        "start_date": "Fri, 21 Feb 2025 00:00:00 GMT",
        "sub_audits": [],
        "template": [
          "Type 1"
        ],
        "updated_at": null,
        "updated_by": "Thu, 13 Mar 2025 05:05:28 GMT"
      },
      {
        "audit_id": "VIG000001",
        "audit_scope": "This can be anything",
        "audit_status": "created",
        "audit_title": "Q1 - ISMS",
        "audit_type": "Physical",
        "auditees": [
          "user3@gmail.com",
          "user4@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com",
          "user2@gmail.com"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Thu, 12 Dec 2024 17:00:00 GMT",
        "function_template": [
          "Function 1.1"
        ],
        "functions": "Q1 - ISMS IT",
        "link_audit": "Sample Audit - 1",
        "start_date": "Thu, 12 Sep 2024 10:00:00 GMT",
        "sub_audits": [],
        "template": [
          "Function 1"
        ],
        "updated_at": null,
        "updated_by": "Tue, 31 Dec 2024 15:30:36 GMT"
      },
      {
        "audit_id": "VIG000003",
        "audit_scope": "This can be anything",
        "audit_status": "created",
        "audit_title": "Sample Audit - 1",
        "audit_type": "Physical",
        "auditees": [
          "user3@gmail.com",
          "user4@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com",
          "user2@gmail.com"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Thu, 12 Dec 2024 17:00:00 GMT",
        "function_template": [
          "Function 1.1"
        ],
        "functions": "Sample",
        "link_audit": "None",
        "start_date": "Thu, 12 Sep 2024 10:00:00 GMT",
        "sub_audits": [],
        "template": [
          "Function 1"
        ],
        "updated_at": null,
        "updated_by": "Tue, 31 Dec 2024 15:31:10 GMT"
      },
      {
        "audit_id": "VIG000004",
        "audit_scope": "This can be anything",
        "audit_status": "created",
        "audit_title": "Sample Audit - 2",
        "audit_type": "Physical",
        "auditees": [
          "user3@gmail.com",
          "user4@gmail.com"
        ],
        "auditors": [
          "user1@gmail.com",
          "user2@gmail.com"
        ],
        "city": "Bengaluru",
        "country": "India",
        "created_by": "varunomkar007@gmail.com",
        "end_date": "Thu, 12 Dec 2024 17:00:00 GMT",
        "function_template": [
          "Function 1.1"
        ],
        "functions": "Sample Audit - 2",
        "link_audit": "None",
        "start_date": "Thu, 12 Sep 2024 10:00:00 GMT",
        "sub_audits": [
          {
            "audit_id": "VIG000011",
            "audit_scope": "test",
            "audit_status": "created",
            "audit_title": "Abc",
            "audit_type": "ISO 270015",
            "auditees": [
              "user 4"
            ],
            "auditors": [
              "user 1"
            ],
            "city": "Bengaluru",
            "country": "India",
            "created_by": "varunomkar007@gmail.com",
            "end_date": "Sat, 08 Mar 2025 17:15:00 GMT",
            "function_template": [
              "Type 2"
            ],
            "functions": "xa",
            "link_audit": "Sample Audit - 2",
            "start_date": "Fri, 07 Mar 2025 17:15:00 GMT",
            "template": [
              "Type 1"
            ],
            "updated_at": null,
            "updated_by": "Fri, 07 Mar 2025 11:46:00 GMT"
          }
        ],
        "template": [
          "Function 1"
        ],
        "updated_at": null,
        "updated_by": "Tue, 31 Dec 2024 15:56:58 GMT"
      }
    ];
    // this.audirService.getAuditLists(payload).subscribe((response: any) => {
    //   if (response) {
    //     this.auditList = response.audit_data;
    //     console.log('111---',response)
    //   }
    // }, (error: any) => {
    //   console.error('Error for getting audits:', error);
    // });

    this.auditList = this.auditList.map((obj: any) => {
      obj.isSubAuditsOpened = false;
      return obj;
    });
  }

  openSubAudits(index: any) {
    this.auditList[index].isSubAuditsOpened = !this.auditList[index].isSubAuditsOpened;
    if (!this.isSubAuditOpened) {
      this.isSubAuditOpened = true;
      this.auditList[index].sub_audits = this.auditList[index].sub_audits.map((obj: any) => {
        obj.lineHeight = 0;
        return obj;
      });
      this.updateLineHeights(index);
    }
  }
  showQuestions() {

  }

  updateLineHeights(auditIndex: any) {
    setTimeout(() => {
      this.detailsContentElements.forEach((element, index) => {
        this.updateLineHeight(auditIndex, index, element.nativeElement);
      });
    }, 100);
  }

  updateLineHeight(auditIndex: any, index: number, statusContent: HTMLElement) {
    const subAudit: any = this.auditList[auditIndex].sub_audits;
    if (index <= subAudit.length) {
      const newLineHeight = index === 0 ? statusContent.offsetHeight - 66 : statusContent.offsetHeight - 4;
      if (subAudit.lineHeight !== newLineHeight) {
        this.auditList[auditIndex].sub_audits[index].lineHeight = newLineHeight;
      }
    }
  }

  onSearch() {
    console.log('Search query:', this.searchQuery);
  }

  clearSearch() {
    this.searchQuery = '';
  }

  onStandardOptionChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.standardSelectedOption = target.value;
  }

  onStandardDropdownClick(): void {
    this.isStandardDropdownOpen = !this.isStandardDropdownOpen;
  }

  onAuditeeDropdownClick() {
    this.isAuditeeDropdownOpen = !this.isAuditeeDropdownOpen;
  }

  onAuditeeOptionChange(event: any) {
    const target = event.target as HTMLSelectElement;
    this.auditeeSelectedValue = target.value;
  }

  ngAfterViewInit() {
    this.renderer.listen('document', 'click', (event: Event) => {
      if (this.standardDropdown && !this.standardDropdown.nativeElement.contains(event.target)) {
        this.isStandardDropdownOpen = false;
      }
      if (this.auditeeDropdown && !this.auditeeDropdown.nativeElement.contains(event.target)) {
        this.isAuditeeDropdownOpen = false;
      }
    });
  }

  getPlanItems() {
    const email = localStorage.getItem('user')?.toString() || '';
    this.audirService.getPlanItems(email).subscribe((items: any) => {
      if (items) {
        console.log('this.------', items)
        this.auditeeDropdownOptions = items.users.auditees;
      }
    }, (error: any) => {
      console.error('Error for getting plans:', error);
    });
  }
}

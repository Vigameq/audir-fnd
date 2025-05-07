export interface Audit {
    link_audit: string;
    audit_title: string;
    functions: string;
    template: string[];
    function_template: any;
    start_date: string;
    end_date: string;
    lead_auditor?: string;
    auditors: string[];
    auditees?: string[];
    city: string;
    country: string;
    audit_scope: string;
    audit_type: string;
    eMail: string;
}
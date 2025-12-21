import { Component } from '@angular/core';
import { AudirService } from 'src/services/audir-services.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  metrics = [
    { label: 'Total Audits', value: 0, trend: '' },
    { label: 'In Progress', value: 0, trend: '' },
    { label: 'Overdue', value: 0, trend: '' },
    { label: 'Completion Rate', value: '0%', trend: '' }
  ];

  statusData = [
    { label: 'Created', count: 0, color: '#9AA4B2' },
    { label: 'In Progress', count: 0, color: '#F2B705' },
    { label: 'Submitted', count: 0, color: '#2F7D32' },
    { label: 'Completed', count: 0, color: '#1E5E8C' },
    { label: 'Overdue', count: 0, color: '#C62828' }
  ];

  monthlyData = [
    { month: 'Jan', count: 0 },
    { month: 'Feb', count: 0 },
    { month: 'Mar', count: 0 },
    { month: 'Apr', count: 0 },
    { month: 'May', count: 0 },
    { month: 'Jun', count: 0 },
    { month: 'Jul', count: 0 },
    { month: 'Aug', count: 0 },
    { month: 'Sep', count: 0 },
    { month: 'Oct', count: 0 },
    { month: 'Nov', count: 0 },
    { month: 'Dec', count: 0 }
  ];

  auditorData: Array<{ name: string; audits: number; completion: number }> = [];
  auditeeData: Array<{ name: string; audits: number; completion: number }> = [];
  fromDate = '';
  toDate = '';

  constructor(private audirService: AudirService) {}

  ngOnInit(): void {
    const storedFrom = localStorage.getItem('dashboardFromDate');
    const storedTo = localStorage.getItem('dashboardToDate');
    const today = new Date();
    const last30 = new Date();
    last30.setDate(today.getDate() - 30);
    this.fromDate = storedFrom || last30.toISOString().substring(0, 10);
    this.toDate = storedTo || today.toISOString().substring(0, 10);
    this.loadSummary();
  }

  loadSummary(): void {
    const email = localStorage.getItem('user')?.toString() || '';
    const payload: any = { eMail: email };
    if (this.fromDate && this.toDate) {
      payload.start_date_filter = { from: this.fromDate, to: this.toDate };
    }
    this.audirService.dashboardSummary(payload).subscribe({
      next: (response: any) => {
        if (!response) {
          return;
        }
        const metrics = response.metrics || {};
        this.metrics = [
          { label: 'Total Audits', value: metrics.total_audits || 0, trend: '' },
          { label: 'In Progress', value: metrics.in_progress || 0, trend: '' },
          { label: 'Overdue', value: metrics.overdue || 0, trend: '' },
          { label: 'Completion Rate', value: `${metrics.completion_rate || 0}%`, trend: '' }
        ];
        const breakdown = Array.isArray(response.status_breakdown) ? response.status_breakdown : [];
        this.statusData = this.statusData.map((item) => {
          const match = breakdown.find((entry: any) => entry.label === item.label);
          return { ...item, count: match ? match.count : 0 };
        });
        if (Array.isArray(response.monthly)) {
          this.monthlyData = response.monthly.map((item: any) => ({
            month: item.month,
            count: item.count || 0
          }));
        }
        this.auditorData = Array.isArray(response.auditors) ? response.auditors : [];
        this.auditeeData = Array.isArray(response.auditees) ? response.auditees : [];
      },
      error: (error: any) => {
        console.error('Error loading dashboard summary:', error);
      }
    });
  }

  applyDateFilter(): void {
    if (!this.fromDate || !this.toDate) {
      return;
    }
    localStorage.setItem('dashboardFromDate', this.fromDate);
    localStorage.setItem('dashboardToDate', this.toDate);
    this.loadSummary();
  }

  getStatusTotal(): number {
    return this.statusData.reduce((sum, item) => sum + item.count, 0);
  }

  getStatusPercent(count: number): number {
    const total = this.getStatusTotal();
    return total ? Math.round((count / total) * 100) : 0;
  }

  getMonthlyMax(): number {
    return Math.max(...this.monthlyData.map((item) => item.count), 1);
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  searchQuery: string = '';

  onSearch() {
    console.log('Search query:', this.searchQuery);
    // You can add logic to filter items or perform search functionality here
  }

  clearSearch() {
    this.searchQuery = ''; // Clear the search input
  }
}

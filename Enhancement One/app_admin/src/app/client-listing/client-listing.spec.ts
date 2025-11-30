import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-client-listing',
  templateUrl: './client-listing.html',
  styleUrls: ['./client-listing.css'],
  standalone: true
})
export class ClientListing implements OnInit {
  clients: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.http.get<any[]>('/clients/api') // adjust to your Express API endpoint
      .subscribe({
        next: data => this.clients = data,
        error: err => console.error('Failed to load clients', err)
      });
  }
}

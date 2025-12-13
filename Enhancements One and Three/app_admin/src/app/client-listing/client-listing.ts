import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientCard } from '../client-card/client-card';
import { Client } from '../models/client';
import { ClientData } from '../services/client-data';
import { AuthService } from '../services/authentication';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-listing',
  standalone: true,
  imports: [CommonModule, ClientCard], 
  templateUrl: './client-listing.html',
  styleUrl: './client-listing.css',
  providers: [ClientData] 
})
export class ClientListing implements OnInit {
  clients!: Client[]; 
  message: string = '';

  constructor(
    private clientDataService: ClientData, 
    private router: Router,
    private authenticationService: AuthService 
  ) {
    console.log('client-listing constructor'); 
  }

  // Check if the user is logged in
  public isLoggedIn() {
    return this.authenticationService.isLoggedIn();
  }

  // Navigate to Add Client page
  public addClient(): void {
    this.router.navigate(['add-client']);
  }

  // Fetch clients from backend
  private getStuff(): void {
  this.clientDataService.getClients().subscribe({
    next: (value: Client[]) => {
      this.clients = value;
      this.message = value.length > 0 
        ? 'There are ' + value.length + ' clients available.'
        : 'There were no clients retrieved from the database.';
      console.log(this.message);
    },
    error: (err) => {
      console.error('Error fetching clients:', err); // <-- use console.error and pass the object
      // Optional: handle 401
      if (err.status === 401) {
        window.location.href = '/';
      }
    }
  });
}


  // Called when component is initialized
  ngOnInit(): void {
  this.getStuff(); // just fetch clients
}


}

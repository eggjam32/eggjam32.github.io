import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { ClientData } from '../services/client-data';
import { Client } from '../models/client';

@Component({
  selector: 'app-edit-client',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Required for reactive forms
  templateUrl: './edit-client.html',
  styleUrls: ['./edit-client.css']
})
export class EditClient implements OnInit {
  clientForm!: FormGroup; 
  client!: Client;
  submitted = false;
  message: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private clientDataService: ClientData // Service for API calls
  ) { }

  ngOnInit(): void {
    // Get client ID from local storage
    const clientId = localStorage.getItem("clientId");
    if (!clientId) {
      alert("No client selected!"); // If no client selected, redirect
      this.router.navigate(['']);
      return;
    }

    // Initialize the reactive form with validators
    this.clientForm = this.formBuilder.group({
      name: ['', Validators.required],
      dob: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      accountType: ['', Validators.required]
    });

    // Load client data from backend and populate form
    this.clientDataService.getClient(clientId)
      .subscribe({
        next: (data: Client) => {
          this.client = data;
          this.clientForm.patchValue(data); // Fill form with existing data
          this.message = 'Client loaded';
        },
        error: (error: any) => {
          console.log('Error:', error);
        }
      });
  }

  // Called when the form is submitted
  public onSubmit() {
    this.submitted = true;
    if (this.clientForm.valid) {
      // Merge form values with existing client object
      const updatedClient = { ...this.client, ...this.clientForm.value };

      // Call backend to update client
      this.clientDataService.updateClient(updatedClient)
        .subscribe({
          next: (data: Client) => {
            console.log('Client updated:', data);
            this.router.navigate(['']); // Navigate back to client list
          },
          error: (error: any) => {
            console.log('Error:', error);
          }
        });
    }
  }

  // Shortcut to access form controls in template
  get f() { return this.clientForm.controls; }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ClientData } from '../services/client-data';
import { Client } from '../models/client';

@Component({
  selector: 'app-add-client',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-client.html',
  styleUrls: ['./add-client.css']
})
export class AddClient implements OnInit {
  clientForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private clientService: ClientData
  ) { }

  ngOnInit() {
    this.clientForm = this.formBuilder.group({
      name: ['', Validators.required],
      dob: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      accountType: ['', Validators.required]
    });
  }

  // Called when form is submitted
  public onSubmit() {
    this.submitted = true;
    if (this.clientForm.valid) {
      this.clientService.addClient(this.clientForm.value)
        .subscribe({
          next: (data: Client) => {
            console.log('Client added:', data);
            this.router.navigate(['']);
          },
          error: (error: any) => {
            console.log('Error:', error);
          }
        });
    }
  }
  // Shortcut to access form fields in template
  get f() { return this.clientForm.controls; }
}

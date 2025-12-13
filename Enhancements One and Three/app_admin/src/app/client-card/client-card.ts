import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Client } from '../models/client';
import { AuthService } from '../services/authentication';

@Component({
  selector: 'app-client-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-card.html',
  styleUrls: ['./client-card.css']
})
export class ClientCard implements OnInit {
  @Input() client!: Client; 

  constructor(
    private router: Router,
    private authenticationService: AuthService
  ) { }

  ngOnInit(): void {}

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public editClient(client: Client): void {
    localStorage.removeItem('clientId');
    localStorage.setItem('clientId', client._id);
    this.router.navigate(['edit-client', client._id]);
  }
}

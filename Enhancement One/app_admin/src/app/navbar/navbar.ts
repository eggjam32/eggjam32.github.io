import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  public loggedIn = true; // Always true, since Express handles login

  ngOnInit() { }

  public onLogout(): void {
    // Redirect to Express logout
    window.location.href = '/logout';
  }
}
